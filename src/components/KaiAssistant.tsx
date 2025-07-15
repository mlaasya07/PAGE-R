import React from 'react';
import { Brain, MessageCircle } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface KaiAssistantProps {
  message: string;
}

const KaiAssistant: React.FC<KaiAssistantProps> = ({ message }) => {
  const { theme } = useTheme();

  return (
    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'} border`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-full ${theme === 'dark' ? 'bg-blue-800' : 'bg-blue-100'} flex items-center justify-center`}>
            <Brain className="h-4 w-4 text-blue-600" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>
              Kai
            </h4>
            <MessageCircle className="h-3 w-3 text-blue-500" />
          </div>
          <p className={`text-sm ${theme === 'dark' ? 'text-blue-100' : 'text-blue-800'}`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default KaiAssistant;