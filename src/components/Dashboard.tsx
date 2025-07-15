import React from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const { isFirstLogin } = useAuth();

  const handleCreateFlashcards = () => {
    // TODO: Navigate to flashcard creation or show modal
    console.log('Create flashcard deck');
  };

  const handleAddExam = () => {
    // TODO: Navigate to exam creation or show modal
    console.log('Add exam date');
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Welcome Message */}
        <div className="space-y-4">
          {isFirstLogin ? (
            <h1 className={`text-4xl md:text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Welcome, Dr. Raghav
            </h1>
          ) : (
            <h1 className={`text-4xl md:text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Welcome back, Dr. Raghav
            </h1>
          )}
          <p className={`text-lg md:text-xl leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-xl mx-auto`}>
            {isFirstLogin 
              ? "Let's set up your study assistant. You can begin by adding your first exam or creating a flashcard deck."
              : "Ready to continue your studies? You can review your progress or add new content."
            }
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleCreateFlashcards}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-8 rounded-lg transition-colors flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <BookOpen className="h-5 w-5" />
            <span>Create Flashcard Deck</span>
          </button>
          
          <button
            onClick={handleAddExam}
            className={`w-full sm:w-auto ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'} font-medium py-4 px-8 rounded-lg transition-colors flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200`}
          >
            <Plus className="h-5 w-5" />
            <span>Add Exam Date</span>
          </button>
        </div>

        {/* Subtle Footer Text */}
        <div className="pt-8">
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            Your clinical companion is ready when you are.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;