import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Search, Trash2, Lock, Calendar } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { storage } from '../utils/storage';
import { JournalEntry } from '../types';
import { v4 as uuidv4 } from 'uuid';

const JournalCore: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>(() => storage.getJournalEntries());

  const [newEntry, setNewEntry] = useState({ title: '', content: '', isPrivate: false });
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<number | null>(null);
  const [password, setPassword] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [pendingPrivateEntry, setPendingPrivateEntry] = useState<string | null>(null);

  const prompts = [
    "How did today's study session go?",
    "What medical concept clicked for you recently?",
    "Describe a challenging moment in your studies.",
    "What are you grateful for in your medical journey?",
    "How are you taking care of yourself?",
    "What would you tell your past self about medical school?"
  ];

  const handleSaveEntry = () => {
    if (newEntry.title && newEntry.content) {
      let entryContent = newEntry.content;
      
      // Encrypt content if private
      if (newEntry.isPrivate) {
        entryContent = btoa(newEntry.content); // Simple base64 encoding
      }
      
      const entry: JournalEntry = {
        id: uuidv4(),
        title: newEntry.title,
        content: entryContent,
        isPrivate: newEntry.isPrivate,
        date: new Date(),
        mood: 'reflective',
        timestamp: Date.now()
      };
      
      storage.addJournalEntry(entry);
      setEntries([entry, ...storage.getJournalEntries()]);
      setNewEntry({ title: '', content: '', isPrivate: false });
      setShowNewEntry(false);
    }
  };

  const handleDeleteEntry = (id: string) => {
    storage.deleteJournalEntry(id);
    setEntries(storage.getJournalEntries());
    setSelectedEntry(null);
  };

  const handlePrivateEntryAccess = (entryId: string) => {
    setPendingPrivateEntry(entryId);
    setShowPasswordPrompt(true);
    setPassword('');
  };

  const handlePasswordSubmit = () => {
    if (password === 'pager') {
      setShowPasswordPrompt(false);
      setSelectedEntry(pendingPrivateEntry);
      setPendingPrivateEntry(null);
      setPassword('');
    } else {
      alert('Incorrect password!');
      setPassword('');
    }
  };

  const getDecryptedContent = (entry: JournalEntry) => {
    if (entry.isPrivate) {
      try {
        return atob(entry.content); // Simple base64 decoding
      } catch {
        return entry.content; // Fallback if not encrypted
      }
    }
    return entry.content;
  };
  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMoodColor = (mood: string) => {
    const colors = {
      contemplative: 'text-purple-400',
      determined: 'text-amber-400',
      enlightened: 'text-green-400',
      reflective: 'text-blue-400',
      frustrated: 'text-red-400',
      hopeful: 'text-cyan-400'
    };
    return colors[mood as keyof typeof colors] || 'text-green-400';
  };

  const kaiJournalComments = [
    "Writing helps organize thoughts. Even I keep logs, and I'm just code.",
    "Your entries show growth. That's more than most humans can say.",
    "Reflection is the beginning of wisdom. Or so the philosophy textbooks claim.",
    "These thoughts are worth preserving. Your future self will thank you."
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
          <h1 className="text-3xl font-pixel mb-4 terminal-glow">JOURNAL CORE</h1>
          <p className="text-lg opacity-75">Memory storage vault</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Entry List */}
          <div className="lg:col-span-1">
            {/* Search and New Entry */}
            <div className="space-y-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 opacity-50" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search entries..."
                  className="w-full bg-transparent border border-green-400 pl-10 pr-4 py-2 text-green-400 focus:outline-none focus:border-amber-400"
                />
              </div>
              
              <button
                onClick={() => setShowNewEntry(true)}
                className="w-full flex items-center justify-center space-x-2 border border-blue-400 py-3 hover:bg-blue-400 hover:text-black transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>NEW ENTRY</span>
              </button>
            </div>

            {/* Entry List */}
            <div className="space-y-3">
              {filteredEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedEntry(entry.id)}
                  onClick={() => {
                    if (entry.isPrivate) {
                      handlePrivateEntryAccess(entry.id);
                    } else {
                      setSelectedEntry(entry.id);
                    }
                  }}
                  className={`border p-3 cursor-pointer transition-all duration-300 ${
                    selectedEntry === entry.id 
                      ? 'border-amber-400 bg-amber-400 bg-opacity-10' 
                      : 'border-gray-600 hover:border-green-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-pixel text-sm">{entry.title}</span>
                    {entry.isPrivate && <Lock className="w-4 h-4 text-red-400" />}
                  </div>
                  <div className="text-xs opacity-75 mb-1">
                    {entry.date.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div className={`text-xs ${getMoodColor(entry.mood)}`}>
                    {entry.mood.toUpperCase()}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>


        {/* Password Prompt Modal */}
        {showPasswordPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-black border border-red-400 p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-pixel mb-4 text-red-400">PRIVATE ENTRY ACCESS</h3>
              <p className="text-sm opacity-75 mb-4">This entry is encrypted. Enter password to view:</p>
              
              <div className="space-y-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                  className="w-full bg-transparent border border-red-400 px-3 py-2 text-red-400 focus:outline-none focus:border-amber-400"
                  placeholder="Enter password..."
                  autoFocus
                />
                
                <div className="flex space-x-4">
                  <button
                    onClick={handlePasswordSubmit}
                    className="flex-1 bg-red-400 text-black py-2 px-4 hover:bg-red-300 transition-colors"
                  >
                    UNLOCK
                  </button>
                  <button
                    onClick={() => {
                      setShowPasswordPrompt(false);
                      setPendingPrivateEntry(null);
                      setPassword('');
                    }}
                    className="flex-1 border border-gray-400 py-2 px-4 text-gray-400 hover:bg-gray-400 hover:text-black transition-colors"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
              
              <div className="mt-4 text-xs opacity-50 text-center">
                <span className="text-blue-400">KAI:</span> Your secrets are safe... from everyone except you, apparently.
              </div>
            </motion.div>
          </motion.div>
        )}
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {showNewEntry ? (
              /* New Entry Form */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-blue-400 p-6"
              >
                <h2 className="text-xl font-pixel mb-6 text-blue-400">NEW JOURNAL ENTRY</h2>
                
                {/* Random Prompt */}
                <div className="mb-6 p-4 border border-gray-600 bg-gray-600 bg-opacity-10">
                  <div className="text-sm opacity-75 mb-2">Today's prompt:</div>
                  <div className="text-base italic">
                    "{prompts[Math.floor(Math.random() * prompts.length)]}"
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">Title:</label>
                    <input
                      type="text"
                      value={newEntry.title}
                      onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                      className="w-full bg-transparent border border-green-400 px-3 py-2 text-green-400 focus:outline-none focus:border-amber-400"
                      placeholder="Give your entry a title..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2">Content:</label>
                    <textarea
                      value={newEntry.content}
                      onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                      className="w-full bg-transparent border border-green-400 p-3 text-green-400 focus:outline-none focus:border-amber-400"
                      rows={12}
                      placeholder="Write your thoughts here..."
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="private"
                      checked={newEntry.isPrivate}
                      onChange={(e) => setNewEntry({...newEntry, isPrivate: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <label htmlFor="private" className="text-sm flex items-center space-x-1">
                      <Lock className="w-4 h-4" />
                      <span>Private Entry</span>
                    </label>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={handleSaveEntry}
                      className="flex-1 bg-blue-400 text-black py-2 px-4 hover:bg-blue-300 transition-colors"
                    >
                      SAVE ENTRY
                    </button>
                    <button
                      onClick={() => {
                        setShowNewEntry(false);
                        setNewEntry({ title: '', content: '', isPrivate: false });
                      }}
                      className="flex-1 border border-red-400 py-2 px-4 text-red-400 hover:bg-red-400 hover:text-black transition-colors"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : selectedEntry ? (
              /* Selected Entry Display */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-green-400 p-6"
              >
                {(() => {
                  const entry = entries.find(e => e.id === selectedEntry);
                  if (!entry) return null;
                  
                  return (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-pixel text-green-400">{entry.title}</h2>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-6 text-sm opacity-75">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{entry.date.toLocaleDateString('en-US', { 
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</span>
                        </div>
                        <div className={`${getMoodColor(entry.mood)}`}>
                          {entry.mood.toUpperCase()}
                        </div>
                        {entry.isPrivate && (
                          <div className="flex items-center space-x-1 text-red-400">
                            <Lock className="w-4 h-4" />
                            <span>PRIVATE</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="prose prose-invert max-w-none">
                        <p className="text-base leading-relaxed whitespace-pre-wrap">
                          {getDecryptedContent(entry)}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            ) : (
              /* Welcome Screen */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-green-400 p-8 text-center"
              >
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-green-400" />
                <h2 className="text-xl font-pixel mb-4">WELCOME TO YOUR JOURNAL</h2>
                <p className="text-base opacity-75 mb-6">
                  Select an entry from the left to read, or create a new one to capture your thoughts.
                </p>
                <div className="text-sm opacity-50">
                  <span className="text-blue-400">KAI:</span> {kaiJournalComments[Math.floor(Math.random() * kaiJournalComments.length)]}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Journal Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">
          <div className="border border-green-400 p-4 text-center">
            <div className="text-2xl font-pixel">{entries.length}</div>
            <div className="text-sm opacity-75">TOTAL ENTRIES</div>
          </div>
          <div className="border border-amber-400 p-4 text-center">
            <div className="text-2xl font-pixel text-amber-400">
              {entries.filter(e => e.isPrivate).length}
            </div>
            <div className="text-sm opacity-75">PRIVATE ENTRIES</div>
          </div>
          <div className="border border-blue-400 p-4 text-center">
            <div className="text-2xl font-pixel text-blue-400">
              {Math.round(entries.reduce((acc, entry) => acc + entry.content.length, 0) / entries.length)}
            </div>
            <div className="text-sm opacity-75">AVG WORDS</div>
          </div>
          <div className="border border-purple-400 p-4 text-center">
            <div className="text-2xl font-pixel text-purple-400">21</div>
            <div className="text-sm opacity-75">DAY STREAK</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JournalCore;