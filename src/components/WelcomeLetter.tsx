import React, { useState, useEffect } from 'react';
import { X, Upload, Calendar, CheckCircle } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface WelcomeLetterProps {
  onClose: () => void;
  onGetStarted: () => void;
}

const WelcomeLetter: React.FC<WelcomeLetterProps> = ({ onClose, onGetStarted }) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    localStorage.setItem('hasSeenWelcomeLetter', 'true');
    onGetStarted();
    onClose();
  };

  const handleRemindLater = () => {
    onClose();
  };

  const handleDontShow = () => {
    localStorage.setItem('hasSeenWelcomeLetter', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className={`relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl transform transition-all duration-500 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      } ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        
        {/* Close Button */}
        <button
          onClick={handleDontShow}
          className={`absolute top-4 right-4 p-2 rounded-full ${
            theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Letter Content */}
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'serif' }}>
              Welcome, Dr. Raghav
            </h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Or should we say... Commander-in-chief of your own learning battlefield.
            </p>
          </div>

          {/* Main Content */}
          <div className={`space-y-4 text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <p>
              Between clinical postings, exams breathing down your neck, and those PDFs that somehow multiply overnight — we know how medicine tests more than just your knowledge.
            </p>
            
            <p>
              That's why R-PAGER exists. Not as another tool you forget by next week, but as a quiet, loyal companion who grows with you.
            </p>

            <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Here's what we've built — just for you:
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: '📅', title: 'Smart Calendar', desc: 'Not just dates, but decisions — with difficulty, exam types, and life events factored in' },
              { icon: '🧠', title: 'AI-Generated Flashcards', desc: 'From your own notes, or built from scratch — spaced to match your memory\'s rhythm' },
              { icon: '🧪', title: 'Quizzes', desc: 'From uploaded PDFs, past exams, cases — it\'s not random, it\'s you-based' },
              { icon: '🧾', title: 'Clinical Cases & References', desc: 'Real scenarios, distilled to sharpen your instincts' },
              { icon: '📚', title: 'Material Management', desc: 'Upload, tag, read, and link your study life together' },
              { icon: '🎯', title: 'Personalized Planning', desc: 'The closer the exam, the more R-PAGER nudges you just right' }
            ].map((feature, index) => (
              <div key={index} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <div className="flex items-start space-x-3">
                  <span className="text-lg">{feature.icon}</span>
                  <div>
                    <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {feature.title}
                    </h4>
                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Emotional Section */}
          <div className={`p-4 rounded-lg border-l-4 border-blue-500 ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
            <h4 className={`font-medium mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>
              What You'll Feel:
            </h4>
            <p className={`text-sm ${theme === 'dark' ? 'text-blue-100' : 'text-blue-800'}`}>
              Less lost. Less late. Less like you're forgetting something important.
            </p>
            <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-blue-100' : 'text-blue-800'}`}>
              Because everything that matters — your goals, your materials, your pace — is here. And it's listening.
            </p>
          </div>

          {/* Closing */}
          <div className={`text-center space-y-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <p className="text-sm">
              So take a breath, maybe sip some coffee.<br />
              Let's get organized. Let's get ahead.
            </p>
            <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              You're not alone anymore.
            </p>
            <p className="text-xs text-right italic">
              — Kai & Team R-PAGER
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={handleGetStarted}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Get Started</span>
            </button>
            
            <button
              onClick={handleRemindLater}
              className={`flex-1 py-3 px-6 rounded-lg border transition-colors ${
                theme === 'dark' 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Remind Me Later
            </button>
            
            <button
              onClick={handleDontShow}
              className={`text-sm ${theme === 'dark' ? 'text-gray-500 hover:text-gray-400' : 'text-gray-500 hover:text-gray-600'}`}
            >
              Don't show this again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeLetter;