import React, { useState } from 'react';
import { Plus, Edit, Trash2, RotateCcw, Tag, BookOpen, Clock, Upload, FileText } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const Flashcards: React.FC = () => {
  const { theme } = useTheme();
  const [selectedDeck, setSelectedDeck] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [flashcardDecks, setFlashcardDecks] = useState<any[]>([]);
  const [recentCards, setRecentCards] = useState<any[]>([]);

  const cardClass = `${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (flashcardDecks.length === 0 && recentCards.length === 0) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Flashcards
          </h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Deck</span>
          </button>
        </div>

        {/* Generation Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={cardClass}>
            <div className="text-center space-y-4">
              <Upload className="h-12 w-12 text-blue-600 mx-auto" />
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                From Uploaded Materials
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Generate flashcards from your PDFs, notes, and documents
              </p>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Upload & Generate
              </button>
            </div>
          </div>

          <div className={cardClass}>
            <div className="text-center space-y-4">
              <BookOpen className="h-12 w-12 text-green-600 mx-auto" />
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                From Topic Selection
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Choose subjects and topics for AI-generated flashcards
              </p>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                Select Topics
              </button>
            </div>
          </div>

          <div className={cardClass}>
            <div className="text-center space-y-4">
              <FileText className="h-12 w-12 text-purple-600 mx-auto" />
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Manual Creation
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Create custom flashcards manually
              </p>
              <button 
                onClick={() => setShowCreateForm(true)}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create Manually
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <BookOpen className={`h-16 w-16 mx-auto ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              No flashcard decks yet
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} max-w-md mx-auto`}>
              Start by creating your first flashcard deck. You can generate them from uploaded materials, select topics, or create them manually.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Flashcards
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Card</span>
        </button>
      </div>

      {/* Deck Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {flashcardDecks.map((deck) => (
          <div key={deck.id} className={cardClass}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {deck.name}
                </h3>
                <div className={`w-3 h-3 rounded-full ${deck.color}`}></div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Total Cards
                  </span>
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {deck.cards}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Due Today
                  </span>
                  <span className="text-sm font-medium text-red-600">
                    {deck.due}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Mastered
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    {deck.mastered}
                  </span>
                </div>
              </div>
              
              <button className={`w-full py-2 px-4 rounded-lg border-2 border-dashed ${
                theme === 'dark' 
                  ? 'border-gray-600 text-gray-400 hover:border-gray-500' 
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              } transition-colors`}>
                Study Deck
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={cardClass}>
          <div className="text-center space-y-4">
            <Clock className="h-12 w-12 text-blue-600 mx-auto" />
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Due Cards
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Review 65 cards due today
            </p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Start Review
            </button>
          </div>
        </div>

        <div className={cardClass}>
          <div className="text-center space-y-4">
            <BookOpen className="h-12 w-12 text-green-600 mx-auto" />
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Generate from PDF
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Let Kai create cards from your notes
            </p>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              Upload PDF
            </button>
          </div>
        </div>

        <div className={cardClass}>
          <div className="text-center space-y-4">
            <RotateCcw className="h-12 w-12 text-purple-600 mx-auto" />
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Forgotten Cards
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Revisit 12 difficult cards
            </p>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              Review Hard Cards
            </button>
          </div>
        </div>
      </div>

      {/* Recent Cards */}
      <div className={cardClass}>
        <div className="text-center py-8">
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            No flashcards created yet. Start by creating your first deck above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Flashcards;