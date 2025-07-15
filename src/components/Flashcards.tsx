import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, RotateCcw, Tag, BookOpen, Clock, Upload, FileText, Play, Star, Eye } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import UploadManager from './UploadManager';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  subject: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: string;
  nextReview?: string;
  reviewCount: number;
  correctCount: number;
  deckId: string;
}

interface FlashcardDeck {
  id: string;
  name: string;
  subject: string;
  description?: string;
  color: string;
  cards: number;
  due: number;
  mastered: number;
  createdDate: string;
  lastStudied?: string;
}

const Flashcards: React.FC = () => {
  const { theme } = useTheme();
  const [selectedDeck, setSelectedDeck] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showTopicSelection, setShowTopicSelection] = useState(false);
  const [flashcardDecks, setFlashcardDecks] = useState<FlashcardDeck[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [studyMode, setStudyMode] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const [deckForm, setDeckForm] = useState({
    name: '',
    subject: '',
    description: '',
    color: 'bg-blue-500'
  });

  const [cardForm, setCardForm] = useState({
    question: '',
    answer: '',
    subject: '',
    tags: '',
    difficulty: 'medium' as Flashcard['difficulty'],
    deckId: ''
  });

  const cardClass = `${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`;

  const subjects = [
    'Anatomy', 'Physiology', 'Biochemistry', 'Pathology', 'Pharmacology',
    'Microbiology', 'Forensic Medicine', 'Community Medicine', 'Medicine',
    'Surgery', 'Obstetrics & Gynecology', 'Pediatrics', 'Psychiatry'
  ];

  const deckColors = [
    'bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];

  useEffect(() => {
    const savedDecks = localStorage.getItem('flashcard-decks');
    const savedCards = localStorage.getItem('flashcards');
    
    if (savedDecks) {
      setFlashcardDecks(JSON.parse(savedDecks));
    }
    if (savedCards) {
      setFlashcards(JSON.parse(savedCards));
    }
  }, []);

  const saveDecks = (decks: FlashcardDeck[]) => {
    setFlashcardDecks(decks);
    localStorage.setItem('flashcard-decks', JSON.stringify(decks));
  };

  const saveCards = (cards: Flashcard[]) => {
    setFlashcards(cards);
    localStorage.setItem('flashcards', JSON.stringify(cards));
  };

  const handleCreateDeck = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newDeck: FlashcardDeck = {
      id: Date.now().toString(),
      name: deckForm.name,
      subject: deckForm.subject,
      description: deckForm.description || undefined,
      color: deckForm.color,
      cards: 0,
      due: 0,
      mastered: 0,
      createdDate: new Date().toISOString()
    };

    saveDecks([...flashcardDecks, newDeck]);
    setDeckForm({ name: '', subject: '', description: '', color: 'bg-blue-500' });
    setShowCreateForm(false);
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCard: Flashcard = {
      id: Date.now().toString(),
      question: cardForm.question,
      answer: cardForm.answer,
      subject: cardForm.subject,
      tags: cardForm.tags.split(',').map(t => t.trim()),
      difficulty: cardForm.difficulty,
      reviewCount: 0,
      correctCount: 0,
      deckId: cardForm.deckId
    };

    const updatedCards = [...flashcards, newCard];
    saveCards(updatedCards);

    // Update deck card count
    const updatedDecks = flashcardDecks.map(deck => 
      deck.id === cardForm.deckId 
        ? { ...deck, cards: deck.cards + 1, due: deck.due + 1 }
        : deck
    );
    saveDecks(updatedDecks);

    setCardForm({
      question: '',
      answer: '',
      subject: '',
      tags: '',
      difficulty: 'medium',
      deckId: ''
    });
  };

  const handleFilesUploaded = (uploadedFiles: any[]) => {
    // Generate flashcards from uploaded files
    const generatedCards: Flashcard[] = uploadedFiles.flatMap(file => {
      // This would typically use AI to parse the file content
      // For now, we'll create sample cards
      return [
        {
          id: `${file.id}-1`,
          question: `Key concept from ${file.name}`,
          answer: 'Generated answer from file content',
          subject: file.subject || 'General',
          tags: file.tags || ['generated'],
          difficulty: 'medium' as const,
          reviewCount: 0,
          correctCount: 0,
          deckId: 'generated'
        }
      ];
    });

    // Create a deck for generated cards if it doesn't exist
    if (!flashcardDecks.find(d => d.id === 'generated')) {
      const generatedDeck: FlashcardDeck = {
        id: 'generated',
        name: 'Generated from Uploads',
        subject: 'Mixed',
        color: 'bg-purple-500',
        cards: generatedCards.length,
        due: generatedCards.length,
        mastered: 0,
        createdDate: new Date().toISOString()
      };
      saveDecks([...flashcardDecks, generatedDeck]);
    }

    saveCards([...flashcards, ...generatedCards]);
    setShowUpload(false);
  };

  const generateFromTopic = (subject: string, topic: string) => {
    // This would typically use AI to generate cards
    const sampleCards: Flashcard[] = [
      {
        id: `topic-${Date.now()}-1`,
        question: `What is the main function of ${topic}?`,
        answer: `Generated answer about ${topic} in ${subject}`,
        subject,
        tags: [topic.toLowerCase(), 'generated'],
        difficulty: 'medium',
        reviewCount: 0,
        correctCount: 0,
        deckId: 'topic-generated'
      }
    ];

    // Create topic deck if needed
    if (!flashcardDecks.find(d => d.id === 'topic-generated')) {
      const topicDeck: FlashcardDeck = {
        id: 'topic-generated',
        name: `${subject} - ${topic}`,
        subject,
        color: 'bg-green-500',
        cards: sampleCards.length,
        due: sampleCards.length,
        mastered: 0,
        createdDate: new Date().toISOString()
      };
      saveDecks([...flashcardDecks, topicDeck]);
    }

    saveCards([...flashcards, ...sampleCards]);
    setShowTopicSelection(false);
  };

  const startStudySession = (deckId: string) => {
    const deckCards = flashcards.filter(card => card.deckId === deckId);
    if (deckCards.length > 0) {
      setSelectedDeck(deckId);
      setStudyMode(true);
      setCurrentCard(0);
      setShowAnswer(false);
    }
  };

  const handleCardResponse = (correct: boolean) => {
    const card = flashcards.find(c => c.deckId === selectedDeck);
    if (card) {
      const updatedCard = {
        ...card,
        reviewCount: card.reviewCount + 1,
        correctCount: correct ? card.correctCount + 1 : card.correctCount,
        lastReviewed: new Date().toISOString()
      };
      
      saveCards(flashcards.map(c => c.id === card.id ? updatedCard : c));
    }

    // Move to next card or end session
    const deckCards = flashcards.filter(card => card.deckId === selectedDeck);
    if (currentCard < deckCards.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
    } else {
      setStudyMode(false);
      setCurrentCard(0);
    }
  };

  if (flashcardDecks.length === 0 && !showCreateForm && !showUpload && !showTopicSelection) {
    return (
      <div className="space-y-8">
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
              <button 
                onClick={() => setShowUpload(true)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
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
              <button 
                onClick={() => setShowTopicSelection(true)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
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

  // Study Mode View
  if (studyMode) {
    const deckCards = flashcards.filter(card => card.deckId === selectedDeck);
    const card = deckCards[currentCard];

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Study Session
          </h2>
          <button
            onClick={() => setStudyMode(false)}
            className={`px-4 py-2 rounded-lg border ${
              theme === 'dark' 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            End Session
          </button>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className={cardClass}>
            <div className="text-center space-y-6">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Card {currentCard + 1} of {deckCards.length}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  card?.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  card?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {card?.difficulty}
                </span>
              </div>

              <div className="space-y-4">
                <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {card?.question}
                </h3>

                {showAnswer && (
                  <div className={`p-4 rounded-lg border-l-4 border-blue-500 ${
                    theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
                  }`}>
                    <p className={`${theme === 'dark' ? 'text-blue-100' : 'text-blue-800'}`}>
                      {card?.answer}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-center space-x-4">
                {!showAnswer ? (
                  <button
                    onClick={() => setShowAnswer(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Show Answer
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleCardResponse(false)}
                      className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Incorrect
                    </button>
                    <button
                      onClick={() => handleCardResponse(true)}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Correct
                    </button>
                  </>
                )}
              </div>
            </div>
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
          <span>New Deck</span>
        </button>
      </div>

      {/* Create Deck Form */}
      {showCreateForm && (
        <div className={cardClass}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Create New Deck
          </h3>
          <form onSubmit={handleCreateDeck} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Deck Name *
                </label>
                <input
                  type="text"
                  required
                  value={deckForm.name}
                  onChange={(e) => setDeckForm({...deckForm, name: e.target.value})}
                  className={`w-full px-3 py-2 rounded-md border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="e.g., Cardiovascular System"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Subject *
                </label>
                <select
                  required
                  value={deckForm.subject}
                  onChange={(e) => setDeckForm({...deckForm, subject: e.target.value})}
                  className={`w-full px-3 py-2 rounded-md border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Select subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Description
              </label>
              <textarea
                value={deckForm.description}
                onChange={(e) => setDeckForm({...deckForm, description: e.target.value})}
                className={`w-full px-3 py-2 rounded-md border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                rows={3}
                placeholder="Brief description of this deck..."
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Color
              </label>
              <div className="flex space-x-2">
                {deckColors.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setDeckForm({...deckForm, color})}
                    className={`w-8 h-8 rounded-full ${color} ${
                      deckForm.color === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Deck
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className={`px-6 py-2 rounded-lg border ${
                  theme === 'dark' 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Upload Manager */}
      {showUpload && (
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Generate Flashcards from Materials
            </h3>
            <button
              onClick={() => setShowUpload(false)}
              className={`text-gray-500 hover:text-gray-700 ${theme === 'dark' ? 'hover:text-gray-300' : ''}`}
            >
              Cancel
            </button>
          </div>
          <UploadManager 
            onFilesUploaded={handleFilesUploaded}
            category="general"
            maxFiles={5}
          />
        </div>
      )}

      {/* Topic Selection */}
      {showTopicSelection && (
        <div className={cardClass}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Generate from Topic
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map(subject => (
              <button
                key={subject}
                onClick={() => generateFromTopic(subject, 'Basic Concepts')}
                className={`p-4 rounded-lg border text-left hover:shadow-md transition-shadow ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {subject}
                </h4>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Generate basic flashcards
                </p>
              </button>
            ))}
          </div>
          <div className="mt-4">
            <button
              onClick={() => setShowTopicSelection(false)}
              className={`px-4 py-2 rounded-lg border ${
                theme === 'dark' 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Deck Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flashcardDecks.map((deck) => (
          <div key={deck.id} className={cardClass}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {deck.name}
                </h3>
                <div className={`w-4 h-4 rounded-full ${deck.color}`}></div>
              </div>
              
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {deck.subject}
              </p>
              
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
              
              <button 
                onClick={() => startStudySession(deck.id)}
                className={`w-full py-2 px-4 rounded-lg ${deck.color} text-white hover:opacity-80 transition-opacity flex items-center justify-center space-x-2`}
              >
                <Play className="h-4 w-4" />
                <span>Study Deck</span>
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
              Review {flashcardDecks.reduce((sum, deck) => sum + deck.due, 0)} cards due today
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
            <button 
              onClick={() => setShowUpload(true)}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
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
              Revisit difficult cards
            </p>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              Review Hard Cards
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcards;