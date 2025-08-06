import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Cake } from 'lucide-react';
import { getBirthdayMessage, getAge } from '../utils/birthday';

interface BirthdayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BirthdayModal: React.FC<BirthdayModalProps> = ({ isOpen, onClose }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const age = getAge();
  const message = getBirthdayMessage(age);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // Create confetti effect
      const confettiCount = 50;
      const confettiContainer = document.createElement('div');
      confettiContainer.style.position = 'fixed';
      confettiContainer.style.top = '0';
      confettiContainer.style.left = '0';
      confettiContainer.style.width = '100%';
      confettiContainer.style.height = '100%';
      confettiContainer.style.pointerEvents = 'none';
      confettiContainer.style.zIndex = '9999';
      document.body.appendChild(confettiContainer);

      for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][Math.floor(Math.random() * 5)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.animationName = 'confetti-fall';
        confetti.style.animationTimingFunction = 'linear';
        confetti.style.animationIterationCount = 'infinite';
        confettiContainer.appendChild(confetti);
      }

        const lastBirthdayShown = localStorage.getItem('page-r-birthday-shown');
      const style = document.createElement('style');
      style.textContent = `
        @keyframes confetti-fall {
            localStorage.setItem('page-r-birthday-shown', today);
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `;
      document.head.appendChild(style);

      // Cleanup after 5 seconds
      setTimeout(() => {
        document.body.removeChild(confettiContainer);
        document.head.removeChild(style);
        setShowConfetti(false);
      }, 5000);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 font-terminal"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="bg-black border-4 border-amber-400 p-8 max-w-md w-full mx-4 relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-amber-400 hover:text-red-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <Cake className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              </motion.div>
              <Gift className="w-8 h-8 text-green-400 mx-auto" />
            </div>

            <div className="text-center">
              <pre className="text-sm text-green-400 whitespace-pre-wrap leading-relaxed">
                {message}
              </pre>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={onClose}
                className="border border-amber-400 px-6 py-2 text-amber-400 hover:bg-amber-400 hover:text-black transition-colors"
              >
                THANK YOU, KAI! 🎉
              </button>
            </div>

            <div className="text-center mt-4 text-xs opacity-50">
              <span className="text-blue-400">KAI:</span> Now get back to studying. The birthday break is over!
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BirthdayModal;