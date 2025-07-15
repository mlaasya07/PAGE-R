import React, { useState, useRef, useEffect } from 'react';
import { Brain, Send, Minimize2, Maximize2, X, MessageCircle } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface KaiChatProps {
  isVisible: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const KaiChat: React.FC<KaiChatProps> = ({ isVisible, onToggle, onClose }) => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isVisible && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isVisible, isMinimized]);

  const generateKaiResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Mood detection and adaptive responses
    if (message.includes('tired') || message.includes('exhausted') || message.includes('overwhelmed')) {
      return "I can sense you're feeling drained. Let's keep this simple - would you like me to create a short 5-minute quiz to ease back in, or should we focus on reviewing something you're already comfortable with?";
    }
    
    if (message.includes('frustrated') || message.includes('stuck') || message.includes('confused')) {
      return "Frustration is part of the learning process. Let's break this down step by step. What specific topic is giving you trouble? I can create targeted flashcards or find a different approach.";
    }
    
    if (message.includes('confident') || message.includes('ready') || message.includes('energetic')) {
      return "Great energy! Let's channel that into something productive. Want to tackle a challenging quiz, or should we dive deep into a new topic you've been meaning to explore?";
    }

    // Content generation requests
    if (message.includes('quiz') || message.includes('mcq')) {
      if (message.includes('cvs') || message.includes('cardio')) {
        return "I'll create a cardiovascular quiz for you. What level would you prefer - basic concepts, clinical applications, or mixed? Also, how many questions?";
      }
      return "I can generate a quiz for you. Which subject and how many questions would you like? I can pull from your uploaded notes or create fresh questions.";
    }
    
    if (message.includes('flashcard') || message.includes('cards')) {
      return "Let's create some flashcards. Do you want me to generate them from your recent uploads, or would you prefer to specify a particular topic? I can make them definition-based, clinical scenarios, or diagram recall.";
    }
    
    if (message.includes('summarize') || message.includes('summary')) {
      return "I can help summarize content for you. Upload a document or paste the text you'd like me to condense into key points.";
    }

    // UI/Theme requests
    if (message.includes('theme') || message.includes('color') || message.includes('ui')) {
      return "I notice you want to change the interface. Would you like me to switch to a calmer color scheme, or did you have something specific in mind? I always ask before making changes.";
    }

    // Study planning
    if (message.includes('plan') || message.includes('schedule')) {
      return "Let's create a study plan. What exams do you have coming up? I can check your calendar and suggest a revision schedule based on your weak areas.";
    }

    // Performance analysis
    if (message.includes('performance') || message.includes('weak') || message.includes('improve')) {
      return "Based on your recent test scores, I can see some patterns. Would you like me to analyze your performance trends and suggest specific areas to focus on?";
    }

    // Default responses with personality
    const defaultResponses = [
      "I'm here to help with your studies. What would you like to work on?",
      "Ready to assist! Need help with flashcards, quizzes, or analyzing your performance?",
      "What's on your mind? I can help with content generation, study planning, or just organizing your thoughts.",
      "Let's tackle this together. What subject or topic should we focus on?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate Kai's response
    setTimeout(() => {
      const kaiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateKaiResponse(inputText),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, kaiResponse]);
    }, 1000);

    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${
      isMinimized ? 'w-80 h-16' : 'w-80 h-96'
    } ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-xl transition-all duration-300`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full ${theme === 'dark' ? 'bg-blue-800' : 'bg-blue-100'} flex items-center justify-center`}>
            <Brain className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Kai
            </h4>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Your Study Assistant
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className={`p-1 rounded ${
              theme === 'dark' 
                ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={onClose}
            className={`p-1 rounded ${
              theme === 'dark' 
                ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto h-64">
            {messages.length === 0 ? (
              <div className="text-center space-y-2">
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Hi Dr. Raghav! I'm Kai, your study assistant.
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  Ask me to create quizzes, summarize notes, or help with study planning.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.isUser
                        ? 'bg-blue-600 text-white'
                        : theme === 'dark'
                        ? 'bg-gray-700 text-gray-100'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Kai anything..."
                className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default KaiChat;