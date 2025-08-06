import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Brain, Shuffle, RotateCcw, Save, ChevronLeft, ChevronRight, Upload, FileText, Download, X } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { medicalDictionary, shuffleArray } from '../medicalDictionary';

interface Flashcard {
  id: number;
  front: string;
  back: string;
  deck: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
  correctCount: number;
  incorrectCount: number;
  imageFilename?: string;
  audioFilename?: string;
}

const FlashcardCore: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [newCard, setNewCard] = useState({ 
    front: '', 
    back: '', 
    deck: 'Medical Terms',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard'
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState('All');
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });
  const [uploadPreview, setUploadPreview] = useState<Flashcard[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [bulkDeck, setBulkDeck] = useState('Medical Terms');
  const [bulkDifficulty, setBulkDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Initialize with medical dictionary terms
  useEffect(() => {
    const savedCards = localStorage.getItem('page-r-flashcards');
    if (savedCards) {
      setFlashcards(JSON.parse(savedCards));
    } else {
      const initialCards = medicalDictionary.map((item, index) => ({
        id: index,
        front: item.term,
        back: item.definition,
        deck: 'Medical Terms',
        difficulty: 'medium' as 'easy' | 'medium' | 'hard',
        correctCount: 0,
        incorrectCount: 0
      }));
      setFlashcards(initialCards);
      localStorage.setItem('page-r-flashcards', JSON.stringify(initialCards));
    }
  }, []);

  const saveFlashcards = (cards: Flashcard[]) => {
    localStorage.setItem('page-r-flashcards', JSON.stringify(cards));
    setFlashcards(cards);
  };

  const filteredCards = selectedDeck === 'All' 
    ? flashcards 
    : flashcards.filter(card => card.deck === selectedDeck);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (filteredCards.length > 0) {
      setCurrentCard((prev) => (prev + 1) % filteredCards.length);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (filteredCards.length > 0) {
      setCurrentCard((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
      setIsFlipped(false);
    }
  };

  const handleShuffle = () => {
    const shuffled = shuffleArray([...filteredCards]);
    const shuffledIds = shuffled.map(card => card.id);
    const newCards = flashcards.map(card => {
      const newIndex = shuffledIds.indexOf(card.id);
      return newIndex !== -1 ? { ...card, shuffleOrder: newIndex } : card;
    });
    saveFlashcards(newCards);
    setCurrentCard(0);
    setIsFlipped(false);
  };

  const handleAddCard = () => {
    if (newCard.front && newCard.back) {
      const card: Flashcard = {
        id: Date.now(),
        ...newCard,
        correctCount: 0,
        incorrectCount: 0
      };
      const updatedCards = [...flashcards, card];
      saveFlashcards(updatedCards);
      setNewCard({ 
        front: '', 
        back: '', 
        deck: 'Medical Terms',
        difficulty: 'medium'
      });
      setShowAddForm(false);
    }
  };

  const handleMarkCorrect = () => {
    if (filteredCards.length > 0) {
      const currentCardData = filteredCards[currentCard];
      const updatedCards = flashcards.map(card => 
        card.id === currentCardData.id 
          ? { ...card, correctCount: card.correctCount + 1, lastReviewed: new Date() }
          : card
      );
      saveFlashcards(updatedCards);
      setSessionStats(prev => ({ ...prev, correct: prev.correct + 1 }));
      handleNext();
    }
  };

  const handleMarkIncorrect = () => {
    if (filteredCards.length > 0) {
      const currentCardData = filteredCards[currentCard];
      const updatedCards = flashcards.map(card => 
        card.id === currentCardData.id 
          ? { ...card, incorrectCount: card.incorrectCount + 1, lastReviewed: new Date() }
          : card
      );
      saveFlashcards(updatedCards);
      setSessionStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
      handleNext();
    }
  };

  const handleReset = () => {
    setCurrentCard(0);
    setIsFlipped(false);
    setSessionStats({ correct: 0, incorrect: 0 });
  };

  const handleSave = () => {
    alert('Deck saved successfully!');
  };

  // Bulk upload handlers
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    try {
      if (fileExtension === 'txt') {
        await handleTxtUpload(file);
      } else if (['csv', 'xls', 'xlsx'].includes(fileExtension || '')) {
        await handleCsvUpload(file);
      } else if (fileExtension === 'zip') {
        await handleZipUpload(file);
      } else {
        alert('Unsupported file format. Please use TXT, CSV, Excel, or ZIP files.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error processing file. Please check the format and try again.');
    }
  };

  const handleTxtUpload = async (file: File) => {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    const cards: Flashcard[] = [];

    lines.forEach((line, index) => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const front = line.substring(0, colonIndex).trim();
        const back = line.substring(colonIndex + 1).trim();
        
        if (front && back) {
          cards.push({
            id: Date.now() + index,
            front,
            back,
            deck: bulkDeck,
            difficulty: bulkDifficulty,
            correctCount: 0,
            incorrectCount: 0
          });
        }
      }
    });

    setUploadPreview(cards);
    setShowPreview(true);
  };

  const handleCsvUpload = async (file: File) => {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    const cards: Flashcard[] = [];

    if (lines.length === 0) return;

    // Check if first line has headers
    const firstLine = lines[0].toLowerCase();
    const hasHeaders = firstLine.includes('term') || firstLine.includes('definition') || firstLine.includes('front') || firstLine.includes('back');
    
    const dataLines = hasHeaders ? lines.slice(1) : lines;

    dataLines.forEach((line, index) => {
      const columns = line.split(',').map(col => col.trim().replace(/"/g, ''));
      
      if (columns.length >= 2) {
        const front = columns[0];
        const back = columns[1];
        const deck = columns[2] || bulkDeck;
        const difficulty = (columns[3] as 'easy' | 'medium' | 'hard') || bulkDifficulty;
        
        if (front && back) {
          cards.push({
            id: Date.now() + index,
            front,
            back,
            deck,
            difficulty,
            correctCount: 0,
            incorrectCount: 0
          });
        }
      }
    });

    setUploadPreview(cards);
    setShowPreview(true);
  };

  const handleZipUpload = async (file: File) => {
    // For now, show a message about ZIP support
    alert('ZIP upload with multimedia support is coming soon! For now, please use TXT or CSV formats.');
  };

  const confirmBulkUpload = () => {
    const updatedCards = [...flashcards, ...uploadPreview];
    saveFlashcards(updatedCards);
    setUploadPreview([]);
    setShowPreview(false);
    setShowBulkUpload(false);
    alert(`Successfully imported ${uploadPreview.length} flashcards!`);
  };

  const downloadSampleFiles = (type: 'txt' | 'csv') => {
    let content = '';
    let filename = '';
    
    if (type === 'txt') {
      content = `Myocardial Infarction: Heart attack caused by blocked coronary artery
Pneumonia: Infection that inflames air sacs in lungs
Diabetes Mellitus: Group of metabolic disorders characterized by high blood sugar
Hypertension: Condition where blood pressure is consistently elevated
Anemia: Condition with lack of healthy red blood cells`;
      filename = 'flashcards_sample.txt';
    } else {
      content = `term,definition,deck,difficulty
Myocardial Infarction,Heart attack caused by blocked coronary artery,Cardiology,hard
Pneumonia,Infection that inflames air sacs in lungs,Pulmonology,medium
Diabetes Mellitus,Group of metabolic disorders characterized by high blood sugar,Endocrinology,medium
Hypertension,Condition where blood pressure is consistently elevated,Cardiology,easy
Anemia,Condition with lack of healthy red blood cells,Hematology,easy`;
      filename = 'flashcards_sample.csv';
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStreak = () => {
    return sessionStats.correct;
  };

  const availableDecks = ['All', ...Array.from(new Set(flashcards.map(card => card.deck)))];

  const kaiComments = [
    "This question sounds like it came from AIIMS 2006. Shall I reword it?",
    "Another flashcard? Your dedication is almost concerning.",
    "I see you're building quite the collection. Your future self will thank you.",
    "That's a good one. Even I learned something, and I'm just code."
  ];

  return (
    <div className="min-h-screen bg-black text-green-400 font-terminal">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-pixel mb-4 terminal-glow">FLASHCARD CORE</h1>
          <p className="text-lg opacity-75">Neural pattern recognition system</p>
        </motion.div>

        {/* Deck Selection */}
        <div className="mb-6 text-center">
          <label className="block text-sm mb-2">SELECT DECK:</label>
          <select
            value={selectedDeck}
            onChange={(e) => {
              setSelectedDeck(e.target.value);
              setCurrentCard(0);
              setIsFlipped(false);
            }}
            className="bg-black border border-green-400 px-4 py-2 text-green-400 focus:outline-none focus:border-amber-400"
          >
            {availableDecks.map(deck => (
              <option key={deck} value={deck}>{deck}</option>
            ))}
          </select>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border border-green-400 p-4 text-center">
            <div className="text-2xl font-pixel">{filteredCards.length}</div>
            <div className="text-sm opacity-75">TOTAL CARDS</div>
          </div>
          <div className="border border-amber-400 p-4 text-center">
            <div className="text-2xl font-pixel text-amber-400">{filteredCards.length > 0 ? currentCard + 1 : 0}</div>
            <div className="text-sm opacity-75">CURRENT</div>
          </div>
          <div className="border border-purple-400 p-4 text-center">
            <div className="text-2xl font-pixel text-purple-400">{getStreak()}</div>
            <div className="text-sm opacity-75">SESSION STREAK</div>
          </div>
        </div>

        {/* Main Flashcard */}
        {filteredCards.length > 0 && (
          <motion.div
            className="max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="relative">
              <motion.div
                className="border border-green-400 p-8 min-h-64 flex items-center justify-center cursor-pointer"
                onClick={handleFlip}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center">
                  <div className="text-sm opacity-50 mb-4">
                    {filteredCards[currentCard].deck} | {isFlipped ? 'BACK' : 'FRONT'}
                  </div>
                  <div className="text-xl leading-relaxed">
                    {isFlipped ? filteredCards[currentCard].back : filteredCards[currentCard].front}
                  </div>
                  <div className="text-sm opacity-50 mt-4">
                    [CLICK TO {isFlipped ? 'FLIP BACK' : 'REVEAL ANSWER'}]
                  </div>
                </div>
              </motion.div>
              
              {/* Card Controls */}
              <div className="flex justify-center space-x-2 mt-6 flex-wrap">
                <button
                  onClick={handlePrevious}
                  className="border border-green-400 px-4 py-2 hover:bg-green-400 hover:text-black transition-colors flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>PREVIOUS</span>
                </button>
                
                {isFlipped && (
                  <>
                    <button
                      onClick={handleMarkIncorrect}
                      className="border border-red-400 px-4 py-2 hover:bg-red-400 hover:text-black transition-colors"
                    >
                      INCORRECT
                    </button>
                    <button
                      onClick={handleMarkCorrect}
                      className="border border-green-400 px-4 py-2 hover:bg-green-400 hover:text-black transition-colors"
                    >
                      CORRECT
                    </button>
                  </>
                )}
                
                <button
                  onClick={handleReset}
                  className="border border-amber-400 px-4 py-2 hover:bg-amber-400 hover:text-black transition-colors flex items-center space-x-1"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>RESET</span>
                </button>
                
                <button
                  onClick={handleNext}
                  className="border border-green-400 px-4 py-2 hover:bg-green-400 hover:text-black transition-colors flex items-center space-x-1"
                >
                  <span>NEXT</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
        
        {filteredCards.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto mb-8 text-center"
          >
            <div className="border border-green-400 p-8">
              <h3 className="text-xl font-pixel mb-4">NO FLASHCARDS IN THIS DECK</h3>
              <p className="text-base opacity-75 mb-4">
                {selectedDeck === 'All' ? 'Create your first flashcard to start studying!' : `No cards found in ${selectedDeck} deck.`}
              </p>
              <div className="text-sm opacity-50">
                <span className="text-blue-400">KAI:</span> An empty deck is like an empty stomach - time to fill it up!
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mb-8 flex-wrap">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 border border-blue-400 px-6 py-3 hover:bg-blue-400 hover:text-black transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>ADD CARD</span>
          </button>
          <button
            onClick={() => setShowBulkUpload(!showBulkUpload)}
            className="flex items-center space-x-2 border border-purple-400 px-6 py-3 hover:bg-purple-400 hover:text-black transition-colors"
          >
            <Upload className="w-5 h-5" />
            <span>BULK UPLOAD</span>
          </button>
          <button 
            onClick={handleShuffle}
            className="flex items-center space-x-2 border border-purple-400 px-6 py-3 hover:bg-purple-400 hover:text-black transition-colors"
          >
            <Shuffle className="w-5 h-5" />
            <span>SHUFFLE</span>
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center space-x-2 border border-amber-400 px-6 py-3 hover:bg-amber-400 hover:text-black transition-colors"
          >
            <Save className="w-5 h-5" />
            <span>SAVE DECK</span>
          </button>
        </div>

        {/* Session Stats */}
        {(sessionStats.correct > 0 || sessionStats.incorrect > 0) && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="border border-blue-400 p-4">
              <h3 className="font-pixel mb-3 text-blue-400">SESSION STATS</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-pixel text-green-400">{sessionStats.correct}</div>
                  <div className="text-sm opacity-75">CORRECT</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-pixel text-red-400">{sessionStats.incorrect}</div>
                  <div className="text-sm opacity-75">INCORRECT</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Upload Modal */}
        {showBulkUpload && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <div className="border border-purple-400 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-pixel text-purple-400">BULK UPLOAD FLASHCARDS</h2>
                <button
                  onClick={() => setShowBulkUpload(false)}
                  className="text-purple-400 hover:text-red-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Upload Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="border border-green-400 p-4">
                  <h3 className="font-pixel text-green-400 mb-3">📄 TXT UPLOAD</h3>
                  <p className="text-sm opacity-75 mb-3">Simple format: Term: Definition</p>
                  <button
                    onClick={() => downloadSampleFiles('txt')}
                    className="text-xs border border-green-400 px-3 py-1 hover:bg-green-400 hover:text-black transition-colors flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>SAMPLE TXT</span>
                  </button>
                </div>

                <div className="border border-amber-400 p-4">
                  <h3 className="font-pixel text-amber-400 mb-3">📊 CSV/EXCEL</h3>
                  <p className="text-sm opacity-75 mb-3">Spreadsheet format with columns</p>
                  <button
                    onClick={() => downloadSampleFiles('csv')}
                    className="text-xs border border-amber-400 px-3 py-1 hover:bg-amber-400 hover:text-black transition-colors flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>SAMPLE CSV</span>
                  </button>
                </div>

                <div className="border border-blue-400 p-4">
                  <h3 className="font-pixel text-blue-400 mb-3">📦 ZIP UPLOAD</h3>
                  <p className="text-sm opacity-75 mb-3">With images/audio (Coming Soon)</p>
                  <button
                    disabled
                    className="text-xs border border-gray-600 px-3 py-1 text-gray-600 cursor-not-allowed"
                  >
                    COMING SOON
                  </button>
                </div>
              </div>

              {/* Upload Settings */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm mb-2">Default Deck:</label>
                  <select
                    value={bulkDeck}
                    onChange={(e) => setBulkDeck(e.target.value)}
                    className="w-full bg-black border border-purple-400 px-3 py-2 text-purple-400 focus:outline-none focus:border-amber-400"
                  >
                    <option value="Medical Terms">Medical Terms</option>
                    <option value="Anatomy">Anatomy</option>
                    <option value="Physiology">Physiology</option>
                    <option value="Pathology">Pathology</option>
                    <option value="Pharmacology">Pharmacology</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Surgery">Surgery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2">Default Difficulty:</label>
                  <select
                    value={bulkDifficulty}
                    onChange={(e) => setBulkDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                    className="w-full bg-black border border-purple-400 px-3 py-2 text-purple-400 focus:outline-none focus:border-amber-400"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* File Upload */}
              <div className="border border-dashed border-purple-400 p-6 text-center mb-6">
                <input
                  type="file"
                  accept=".txt,.csv,.xls,.xlsx,.zip"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="bulk-upload"
                />
                <label htmlFor="bulk-upload" className="cursor-pointer">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <div className="text-lg mb-2">Drop files here or click to browse</div>
                  <div className="text-sm opacity-75">Supports: TXT, CSV, Excel (.xls, .xlsx), ZIP</div>
                </label>
              </div>
            </div>
          </motion.div>
        )}

        {/* Upload Preview Modal */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-black border border-green-400 p-6 max-w-4xl w-full mx-4 max-h-96 overflow-y-auto"
            >
              <h3 className="text-xl font-pixel mb-4 text-green-400">PREVIEW UPLOAD ({uploadPreview.length} cards)</h3>
              
              <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
                {uploadPreview.slice(0, 10).map((card, index) => (
                  <div key={index} className="border border-gray-600 p-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm opacity-75">Front:</div>
                        <div className="text-sm">{card.front}</div>
                      </div>
                      <div>
                        <div className="text-sm opacity-75">Back:</div>
                        <div className="text-sm">{card.back}</div>
                      </div>
                    </div>
                    <div className="text-xs opacity-50 mt-2">
                      Deck: {card.deck} | Difficulty: {card.difficulty}
                    </div>
                  </div>
                ))}
                {uploadPreview.length > 10 && (
                  <div className="text-center text-sm opacity-75">
                    ... and {uploadPreview.length - 10} more cards
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={confirmBulkUpload}
                  className="flex-1 bg-green-400 text-black py-2 px-4 hover:bg-green-300 transition-colors"
                >
                  IMPORT {uploadPreview.length} CARDS
                </button>
                <button
                  onClick={() => {
                    setShowPreview(false);
                    setUploadPreview([]);
                  }}
                  className="flex-1 border border-red-400 py-2 px-4 text-red-400 hover:bg-red-400 hover:text-black transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Add Card Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto border border-blue-400 p-6"
          >
            <h3 className="text-xl font-pixel mb-4 text-blue-400">ADD NEW FLASHCARD</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">FRONT (Question):</label>
                <textarea
                  value={newCard.front}
                  onChange={(e) => setNewCard({...newCard, front: e.target.value})}
                  className="w-full bg-transparent border border-green-400 p-3 text-green-400 focus:outline-none focus:border-amber-400"
                  rows={3}
                  placeholder="Enter your question here..."
                />
              </div>
              <div>
                <label className="block text-sm mb-2">BACK (Answer):</label>
                <textarea
                  value={newCard.back}
                  onChange={(e) => setNewCard({...newCard, back: e.target.value})}
                  className="w-full bg-transparent border border-green-400 p-3 text-green-400 focus:outline-none focus:border-amber-400"
                  rows={3}
                  placeholder="Enter your answer here..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">DECK:</label>
                  <select
                    value={newCard.deck}
                    onChange={(e) => setNewCard({...newCard, deck: e.target.value})}
                    className="w-full bg-black border border-green-400 p-3 text-green-400 focus:outline-none focus:border-amber-400"
                  >
                    <option value="Medical Terms">Medical Terms</option>
                    <option value="Anatomy">Anatomy</option>
                    <option value="Physiology">Physiology</option>
                    <option value="Pathology">Pathology</option>
                    <option value="Pharmacology">Pharmacology</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Surgery">Surgery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2">DIFFICULTY:</label>
                  <select
                    value={newCard.difficulty}
                    onChange={(e) => setNewCard({...newCard, difficulty: e.target.value as 'easy' | 'medium' | 'hard'})}
                    className="w-full bg-black border border-green-400 p-3 text-green-400 focus:outline-none focus:border-amber-400"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleAddCard}
                  className="flex-1 bg-blue-400 text-black py-2 px-4 hover:bg-blue-300 transition-colors"
                >
                  CREATE CARD
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 border border-red-400 py-2 px-4 text-red-400 hover:bg-red-400 hover:text-black transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </div>
            <div className="mt-4 text-sm opacity-75 text-center">
              <span className="text-blue-400">KAI:</span> {kaiComments[Math.floor(Math.random() * kaiComments.length)]}
            </div>
          </motion.div>
        )}

        {/* Deck List */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-pixel mb-4">AVAILABLE DECKS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableDecks.filter(deck => deck !== 'All').map((deck) => {
              const deckCards = flashcards.filter(card => card.deck === deck);
              const lastStudied = deckCards.reduce((latest, card) => {
                if (!card.lastReviewed) return latest;
                return !latest || card.lastReviewed > latest ? card.lastReviewed : latest;
              }, null as Date | null);
              
              return (
                <div 
                  key={deck} 
                  className="border border-green-400 p-4 hover:border-amber-400 transition-colors cursor-pointer"
                  onClick={() => setSelectedDeck(deck)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-pixel">{deck.toUpperCase()}</span>
                    <span className="text-sm opacity-75">
                      {deckCards.length} cards
                    </span>
                  </div>
                  <div className="text-xs opacity-50 mt-2">
                    Last studied: {lastStudied ? lastStudied.toLocaleDateString() : 'Never'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FlashcardCore;