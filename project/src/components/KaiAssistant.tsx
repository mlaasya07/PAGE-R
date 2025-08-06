import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, MessageCircle, X } from 'lucide-react';

const KaiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{id: number, text: string, sender: 'user' | 'kai'}>>([]);
  const [kaiMood, setKaiMood] = useState('normal');

  const kaiResponses = {
    normal: [
      "I'm here, Doctor. What's troubling your neural pathways today?",
      "Another question? Your curiosity is almost as caffeinated as you should be.",
      "Processing... Please wait while I pretend to think deeply about this.",
      "Ah, seeking wisdom from your digital intern. How modern of you."
    ],
    sassy: [
      "Really? That's what you're asking me? Did you skip basic anatomy?",
      "I've seen medical students with more focus than your current query.",
      "Let me guess - you haven't had coffee in the last 30 minutes?",
      "Your question suggests you need sleep more than answers."
    ],
    supportive: [
      "Hey, it's okay. Even the best doctors started somewhere.",
      "You're doing better than you think, Dr. Kiran.",
      "Remember: every expert was once a beginner who refused to give up.",
      "Your dedication is showing. Keep going, you've got this."
    ]
  };

  const easterEggs = {
    'stat': () => {
      setKaiMood('panic');
      return "🚨 CODE RED ACTIVATED! All hands on deck! Wait... it's just you. Never mind.";
    },
    'kai why': () => {
      return "The mitochondria has more direction than I do. But at least I'm here for you.";
    },
    'mcq hell': () => {
      return "Initiating MCQ rain sequence... Just kidding. That would be cruel even for me.";
    },
    'code blue': () => {
      setKaiMood('calm');
      return "💙 Switching to calm mode. Take a deep breath, Doctor. Everything will be okay.";
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'user' as const
    };

    setMessages(prev => [...prev, newMessage]);

    // Check for easter eggs
    const lowerMessage = message.toLowerCase();
    let response = '';

    if (easterEggs[lowerMessage as keyof typeof easterEggs]) {
      response = easterEggs[lowerMessage as keyof typeof easterEggs]();
    } else {
      const responses = kaiResponses[kaiMood as keyof typeof kaiResponses];
      response = responses[Math.floor(Math.random() * responses.length)];
    }

    setTimeout(() => {
      const kaiMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'kai' as const
      };
      setMessages(prev => [...prev, kaiMessage]);
    }, 1000);

    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Kai Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 bg-green-400 text-black p-3 rounded-full shadow-lg hover:bg-amber-400 transition-colors z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Bot className="w-6 h-6" />
      </motion.button>

      {/* Kai Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-20 right-6 w-80 h-96 bg-black border border-green-400 shadow-xl z-50 font-terminal"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-green-400">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-pixel">KAI ASSISTANT</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-green-400 hover:text-red-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto h-64 space-y-3">
              {messages.length === 0 && (
                <div className="text-green-400 text-sm opacity-75">
                  Kai is online. Type 'kai why' for existential wisdom, or 'stat' for chaos.
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`text-sm ${
                    msg.sender === 'user' 
                      ? 'text-amber-400 text-right' 
                      : 'text-green-400'
                  }`}
                >
                  <span className="text-xs opacity-50">
                    {msg.sender === 'user' ? 'DR. KIRAN: ' : 'KAI: '}
                  </span>
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-green-400">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Kai anything..."
                  className="flex-1 bg-transparent border border-green-400 px-2 py-1 text-green-400 text-sm focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-green-400 text-black px-3 py-1 text-sm hover:bg-amber-400 transition-colors"
                >
                  SEND
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default KaiAssistant;