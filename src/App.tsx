import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isBirthday } from './utils/birthday';
import AccessGate from './components/AccessGate';
import BirthdayModal from './components/BirthdayModal';
import Dashboard from './components/Dashboard';
import FlashcardCore from './components/FlashcardCore';
import CaseLab from './components/CaseLab';
import PDFZone from './components/PDFZone';
import NeurosyncCalendar from './components/NeurosyncCalendar';
import StudyStats from './components/StudyStats';
import MoodTracker from './components/MoodTracker';
import JournalCore from './components/JournalCore';
import Games from './components/Games';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showBirthdayModal, setShowBirthdayModal] = useState(false);

  useEffect(() => {
    // Always require password on app start for privacy
    setIsAuthenticated(false);
    setIsLoading(false);
    
    // Check for birthday
    if (isBirthday()) {
      const today = new Date().toDateString();
      const lastBirthdayShown = localStorage.getItem('r-pager-birthday-shown');
      if (lastBirthdayShown !== today) {
        setTimeout(() => {
          setShowBirthdayModal(true);
          localStorage.setItem('r-pager-birthday-shown', today);
        }, 2000);
      }
    }
  }, []);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-400 font-terminal text-xl">
          INITIALIZING R-PAGER...
          <span className="cursor">▊</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-black crt-effect">
        <BirthdayModal 
          isOpen={showBirthdayModal} 
          onClose={() => setShowBirthdayModal(false)} 
        />
        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            <motion.div
              key="access-gate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AccessGate onAuthenticate={handleAuthentication} />
            </motion.div>
          ) : (
            <motion.div
              key="main-app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/flashcards" element={<FlashcardCore />} />
                <Route path="/cases" element={<CaseLab />} />
                <Route path="/pdf" element={<PDFZone />} />
                <Route path="/calendar" element={<NeurosyncCalendar />} />
                <Route path="/stats" element={<StudyStats />} />
                <Route path="/mood" element={<MoodTracker />} />
                <Route path="/journal" element={<JournalCore />} />
                <Route path="/games" element={<Games />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;