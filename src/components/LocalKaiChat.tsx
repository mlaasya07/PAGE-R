import React, { useState, useRef, useEffect } from 'react';
import { Brain, Send, Minimize2, Maximize2, X, Mic, MicOff, Volume2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useLocalKai } from '../hooks/useLocalKai';
import { useCodeStatus } from '../hooks/useCodeStatus';

interface LocalKaiChatProps {
  isVisible: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const LocalKaiChat: React.FC<LocalKaiChatProps> = ({ isVisible, onToggle, onClose }) => {
  const { theme } = useTheme();
  const { codeStatus } = useCodeStatus();
  const [inputText, setInputText] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    isLoading,
    isRecording,
    isTranscribing,
    sendMessage,
    startRecording,
    stopRecording,
    clearHistory
  } = useLocalKai();

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

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;
    await sendMessage(inputText);
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const getCodeStatusColor = () => {
    const colors = {
      'Code Blue': 'from-blue-600 to-blue-800',
      'Code Red': 'from-red-600 to-red-800',
      'Code Black': 'from-gray-800 to-gray-900',
      'Code White': 'from-gray-300 to-gray-400',
      'Code Orange': 'from-orange-600 to-orange-800',
      'Code Yellow': 'from-yellow-500 to-yellow-600',
      'Code Green': 'from-green-600 to-green-800',
      'Code Gold': 'from-yellow-400 to-yellow-500',
      'Code Violet': 'from-purple-600 to-purple-800'
    };
    return colors[codeStatus as keyof typeof colors] || 'from-blue-600 to-blue-800';
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
          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getCodeStatusColor()} flex items-center justify-center`}>
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div>
            <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Kai
            </h4>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Local • {codeStatus}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={clearHistory}
            className={`p-1 rounded text-xs ${
              theme === 'dark' 
                ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="Clear history"
          >
            Clear
          </button>
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
                  Kai is running locally via Ollama
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  Voice transcription via whisper.cpp
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
                        ? `bg-gradient-to-r ${getCodeStatusColor()} text-white`
                        : theme === 'dark'
                        ? 'bg-gray-700 text-gray-100'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.isVoice && (
                      <div className="flex items-center space-x-1 mb-1 opacity-70">
                        <Volume2 className="h-3 w-3" />
                        <span className="text-xs">Voice</span>
                      </div>
                    )}
                    {message.text}
                  </div>
                </div>
              ))
            )}
            
            {(isLoading || isTranscribing) && (
              <div className="flex justify-start">
                <div className={`p-3 rounded-lg text-sm ${
                  theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-900'
                }`}>
                  {isTranscribing ? 'Transcribing...' : 'Kai is thinking...'}
                </div>
              </div>
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
                disabled={isLoading || isRecording}
                className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } ${(isLoading || isRecording) ? 'opacity-50' : ''}`}
              />
              
              <button
                onClick={handleVoiceToggle}
                disabled={isLoading || isTranscribing}
                className={`p-2 rounded-lg transition-colors ${
                  isRecording 
                    ? 'bg-red-600 text-white' 
                    : `bg-gradient-to-r ${getCodeStatusColor()} text-white hover:opacity-80`
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
              
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading || isRecording}
                className={`p-2 bg-gradient-to-r ${getCodeStatusColor()} text-white rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            
            {isRecording && (
              <div className="mt-2 text-center">
                <span className={`text-xs ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                  Recording... Click mic to stop
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LocalKaiChat;