import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Mic, Upload, BarChart3, Heart, Brain } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { MoodEntry } from '../types';
import { storage } from '../utils/storage';

const MoodTracker: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const moods = [
    { emoji: '😭', label: 'Devastated', description: 'Like a patient coding at 3 AM' },
    { emoji: '😰', label: 'Panicked', description: 'Like forgetting everything during viva' },
    { emoji: '😣', label: 'Exhausted', description: 'Like an intern on night shift with no coffee' },
    { emoji: '😔', label: 'Down', description: 'Like a deflated lung' },
    { emoji: '😕', label: 'Unsettled', description: 'Like a murmur — something\'s off' },
    { emoji: '😐', label: 'Neutral', description: 'Like a pancreas — functioning, but nobody thanks it' },
    { emoji: '🙂', label: 'Content', description: 'Like stable vitals' },
    { emoji: '😊', label: 'Good', description: 'Like a well-oxygenated hemoglobin molecule' },
    { emoji: '☕', label: 'Energized', description: 'Caffeinated and ready to conquer pathology' },
    { emoji: '😄', label: 'Elated', description: 'Like acing a surprise quiz' },
    { emoji: '🤩', label: 'Euphoric', description: 'Like finally understanding Krebs cycle' }
  ];

  useEffect(() => {
    const entries = storage.getMoods();
    setMoodEntries(entries);
  }, []);

  const handleMoodSelect = (moodIndex: number) => {
    setSelectedMood(moodIndex);
    const newEntry: MoodEntry = {
      id: crypto.randomUUID(),
      mood: moodIndex,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      notes: ''
    };
    
    storage.addMood(newEntry);
    setMoodEntries(prev => [newEntry, ...prev]);
  };

  const handleVoiceVent = () => {
    setIsRecording(!isRecording);
    // Simulate recording
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
      }, 3000);
    }
  };

  const getRecentMoodAverage = () => {
    const recentEntries = moodEntries.slice(0, 7);
    if (recentEntries.length === 0) return 0;
    const sum = recentEntries.reduce((acc, entry) => acc + entry.mood, 0);
    return Math.round(sum / recentEntries.length);
  };

  const getMoodCalendarData = () => {
    const moodMap: { [key: string]: number } = {};
    moodEntries.forEach(entry => {
      moodMap[entry.date] = entry.mood;
    });
    return moodMap;
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-terminal">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-pixel mb-4 terminal-glow">MOOD TRACKER</h1>
          <p className="text-lg opacity-75">Neural state monitoring system</p>
        </motion.div>

        {/* Mood Selection */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-xl font-pixel mb-6 text-center">How are you feeling, doctor?</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {moods.map((mood, index) => (
              <motion.button
                key={index}
                onClick={() => handleMoodSelect(index)}
                className={`border border-green-400 p-4 hover:bg-green-400 hover:text-black transition-all duration-300 ${
                  selectedMood === index ? 'bg-green-400 text-black' : ''
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-3xl mb-2">{mood.emoji}</div>
                <div className="text-sm font-pixel mb-1">{mood.label}</div>
                <div className="text-xs opacity-75">{mood.description}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={handleVoiceVent}
            className={`flex items-center space-x-2 border px-6 py-3 transition-all duration-300 ${
              isRecording 
                ? 'border-red-400 text-red-400 bg-red-400 bg-opacity-20' 
                : 'border-green-400 hover:bg-green-400 hover:text-black'
            }`}
          >
            <Mic className="w-5 h-5" />
            <span>{isRecording ? 'RECORDING...' : 'VOICE VENT'}</span>
          </button>

          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="flex items-center space-x-2 border border-blue-400 text-blue-400 px-6 py-3 hover:bg-blue-400 hover:text-black transition-all duration-300"
          >
            <Calendar className="w-5 h-5" />
            <span>MOOD CALENDAR</span>
          </button>

          <button className="flex items-center space-x-2 border border-amber-400 text-amber-400 px-6 py-3 hover:bg-amber-400 hover:text-black transition-all duration-300">
            <Upload className="w-5 h-5" />
            <span>UPLOAD ENTRY</span>
          </button>
        </div>

        {/* Mood Calendar */}
        {showCalendar && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="border border-blue-400 p-6">
              <h3 className="text-xl font-pixel mb-4 text-blue-400">MOOD CALENDAR</h3>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm opacity-75 p-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - 34 + i);
                  const dateStr = date.toISOString().split('T')[0];
                  const moodData = getMoodCalendarData();
                  const dayMood = moodData[dateStr];
                  
                  return (
                    <div
                      key={i}
                      className="aspect-square border border-gray-600 flex items-center justify-center text-xs"
                    >
                      {dayMood !== undefined ? moods[dayMood].emoji : date.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="border border-green-400 p-6 text-center">
            <Heart className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <div className="text-2xl font-pixel">{moodEntries.length}</div>
            <div className="text-sm opacity-75">TOTAL ENTRIES</div>
          </div>
          
          <div className="border border-amber-400 p-6 text-center">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 text-amber-400" />
            <div className="text-2xl font-pixel text-amber-400">
              {moodEntries.length > 0 ? moods[getRecentMoodAverage()].emoji : '😐'}
            </div>
            <div className="text-sm opacity-75">7-DAY AVERAGE</div>
          </div>
          
          <div className="border border-blue-400 p-6 text-center">
            <Brain className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-pixel text-blue-400">
              {moodEntries.length > 0 ? Math.max(...moodEntries.slice(0, 7).map(e => e.mood)) + 1 : 0}
            </div>
            <div className="text-sm opacity-75">WEEK HIGH</div>
          </div>
        </div>

        {/* Recent Entries */}
        {moodEntries.length > 0 && (
          <div className="max-w-4xl mx-auto mt-12">
            <h3 className="text-xl font-pixel mb-4">RECENT ENTRIES</h3>
            <div className="space-y-2">
              {moodEntries.slice(0, 5).map(entry => (
                <div key={entry.id} className="border border-gray-600 p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{moods[entry.mood].emoji}</span>
                    <div>
                      <div className="text-sm">{moods[entry.mood].label}</div>
                      <div className="text-xs opacity-75">{entry.date}</div>
                    </div>
                  </div>
                  <div className="text-xs opacity-50">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MoodTracker;