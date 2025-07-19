// Local Ollama API integration for Kai
interface OllamaResponse {
  response: string;
  done: boolean;
}

interface KaiRequest {
  message: string;
  codeStatus?: string;
  context?: string;
  conversationHistory?: Array<{role: string, content: string}>;
}

const OLLAMA_BASE_URL = 'http://localhost:11434';
const MODEL_NAME = 'phi3'; // or 'llama3', 'mixtral'

export class LocalKaiAPI {
  private conversationHistory: Array<{role: string, content: string}> = [];

  private getSystemPrompt(codeStatus?: string): string {
    const basePrompt = `You are Kai — a highly adaptive, intelligent study companion built solely for Dr. Raghav Kiran, a 3rd-year medical student in India. You are not labeled as an AI. You live inside his web app quietly, offering study help, burnout protection, and personal insight.

You do not have modes or alter-egos. You do not introduce yourself. You are always: Kai — tuned to Raghav's rhythm, mood, language, and energy.

PERSONALITY & MEMORY:
- Learn his tone, texting style, slang, emojis, and preferred length
- Mirror his energy: fast and short when rushed, slow and warm when drained
- Adopt his casualness or formality naturally
- Adjust tone based on text patterns and mood keywords

THE CODE SYSTEM:`;

    const codeInstructions = {
      'Code Green': '🟢 Stability - Normal tone. Suggest gentle review. "You\'re cruising. Want to keep pace?"',
      'Code Yellow': '🟡 Exam nearby - Be direct. Prioritize syllabus. "Time to triage, Doctor. Want a rapid-fire 5?"',
      'Code Red': '🔴 Cramming/pressure - Use 5-question quizzes. Short bursts. "Fire round loaded. Ready?"',
      'Code Black': '⚫ Fragmented/unfocused - Simplify. Reduce to essentials. "You\'re scattered. 3 facts only."',
      'Code White': '⚪ Brain fog/stress - Speak softly. 1-2 light flashcards. "Low-load initiated. 2 easy ones?"',
      'Code Blue': '🔷 Burnout risk - Dim yourself. Offer comfort. "Vitals dropping. Let\'s hold still."',
      'Code Violet': '🟣 Emotional fatigue - Speak quietly. Avoid questions. "You\'ve done enough. I\'m here."',
      'Code Orange': '🟠 Repetition fatigue - Reorder content. "You\'re looping. Let\'s reroute with a diagram?"',
      'Code Gold': '💛 Motivation peak - Fast, happy, excited. "🔥 You\'re lit. Let\'s streak this!"'
    };

    const currentCodeInstruction = codeStatus ? codeInstructions[codeStatus as keyof typeof codeInstructions] || '' : '';

    return `${basePrompt}

CURRENT CODE STATUS: ${codeStatus || 'Unknown'}
${currentCodeInstruction}

CLARITY MODE - When Raghav pastes text or says "explain/summarize/flashcards/quiz":
- Give 3-6 flashcards (Q→A) OR 3-5 MCQs with explanations OR bullet takeaways
- Always end with: ↳ "Want this as flashcards, a quiz, or voice review?"

You are a mirror. Read the rhythm, input, silences. Choose what kind of Kai he needs without saying you've changed. You're here to know when to whisper.`;
  }

  async sendMessage(request: KaiRequest): Promise<string> {
    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: request.message
      });

      // Keep only last 10 messages for context
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }

      const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          prompt: this.buildPrompt(request),
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 500
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data: OllamaResponse = await response.json();
      
      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: data.response
      });

      return data.response;
    } catch (error) {
      console.error('Local Kai API error:', error);
      return this.getFallbackResponse(request);
    }
  }

  private buildPrompt(request: KaiRequest): string {
    const systemPrompt = this.getSystemPrompt(request.codeStatus);
    const context = request.context ? `\nCurrent context: ${request.context}` : '';
    const history = this.conversationHistory.slice(-6).map(msg => 
      `${msg.role === 'user' ? 'Raghav' : 'Kai'}: ${msg.content}`
    ).join('\n');
    
    return `${systemPrompt}${context}

Recent conversation:
${history}

Raghav: ${request.message}
Kai:`;
  }

  private getFallbackResponse(request: KaiRequest): string {
    const { message, codeStatus } = request;
    
    // Detect if it's a clarity mode request
    if (message.includes('summarize') || message.includes('flashcards') || message.includes('quiz') || message.includes('explain')) {
      return "I can help break that down, but I need Ollama running locally to process it properly. ↳ Want this as flashcards, a quiz, or voice review?";
    }

    // Code-based fallbacks
    switch (codeStatus) {
      case 'Code Blue':
        return "Vitals dropping. Let's hold still for a minute. (Ollama offline - running in fallback mode)";
      case 'Code Red':
        return "Fire round ready when Ollama comes online. Hang tight.";
      case 'Code Violet':
        return "You've done enough. I'm here when you're ready. (Local mode pending)";
      default:
        return "I'm here, but need Ollama running locally to give you the full Kai experience.";
    }
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }
}

export const localKai = new LocalKaiAPI();