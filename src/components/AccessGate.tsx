import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AccessGateProps {
  onAuthenticate: () => void;
}

const AccessGate: React.FC<AccessGateProps> = ({ onAuthenticate }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isBooting, setIsBooting] = useState(true);
  const [bootText, setBootText] = useState('');

  const bootSequence = [
    'R-PAGER SYSTEM BOOT v2.1.4',
    'Initializing neural pathways...',
    'Loading medical databases...',
    'Calibrating caffeine sensors...',
    'Checking for signs of life...',
    'Vitals: STABLE',
    'Memory: SYNCED',
    'Soul: Still glitchy. That\'s okay.',
    '',
    'SYSTEM READY',
    'ACCESS REQUIRED'
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < bootSequence.length) {
        setBootText(prev => prev + bootSequence[index] + '\n');
        index++;
      } else {
        setIsBooting(false);
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === '508011') {
      setError('');
      // CRT flicker effect
      document.body.classList.add('glitch');
      setTimeout(() => {
        document.body.classList.remove('glitch');
        onAuthenticate();
      }, 500);
    } else {
      const errorMessages = [
        'Access Denied. This isn\'t your cadaver.',
        'Hint: Your pulse should know this.',
        '404 Brain not found. Have you tried glycolysis?',
        'Access Denied. Synaptic permissions insufficient.',
        'Hint: This memory isn’t mapped in your hippocampus.',
        'ERROR 451: Cortex Unavailable – Emotionally restricted content.',
        'Unauthorized probe detected. Cerebral firewall activated.',
        'You.re poking around in someone else’s gray matter, creep.',
        'Neural handshake failed. Try rebooting your empathy.',
        'This ain.t your flesh-vessel. Kindly exit the cranial premises.',
        'Thought.exe crashed. Restart limbic system and try again.',
        'Access Denied. You.re not in the manifest of authorized minds.',
        'Hint: Identity mismatch. Did you forget who you are again?',
        'Intruder alert: Synaptic signals traced to... not you.',
        'Memory is encrypted. You.ll need a soul-key to proceed.',
        '403 Forbidden: Your aura does not match the original donor.',
        'Unauthorized soul sync attempt detected. Audit logging your dreams now.',
        'Brain offline. Neurons out for coffee.',
        'Echoes found. Consciousness not included.',
        'Login failed. Neural patterns don’t align with the host corpse.',
        'Bio-authentication rejected. You.re just skin with questions.',
        'Error: Thought not found. Please insert deeper introspection.',
        'Fatal Exception: User attempted to think without permission.'
      ];
      setError(errorMessages[Math.floor(Math.random() * errorMessages.length)]);
      setCode('');
    }
  };

  if (isBooting) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-terminal p-8 flex items-center justify-center">
        <div className="max-w-2xl">
          <pre className="text-lg leading-relaxed whitespace-pre-wrap">
            {bootText}
            <span className="cursor">▊</span>
          </pre>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-black text-green-400 font-terminal p-8 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-md w-full">
        <div className="border border-green-400 p-8 terminal-glow">
          <div className="text-center mb-8">
            <h1 className="text-2xl mb-2 font-pixel">PROJECT R-PAGER</h1>
            <p className="text-sm opacity-75">"Vitals. Memory. Soul."</p>
            <p className="text-xs mt-4 opacity-50">A underground playground just for one doctor.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm mb-2">ENTER ACCESS CODE:</label>
              <div className="flex items-center">
                <input
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="bg-transparent border border-green-400 px-3 py-2 w-full font-terminal text-green-400 focus:outline-none focus:border-amber-400 transition-colors"
                  placeholder="______"
                  maxLength={6}
                  autoFocus
                />
                <span className="ml-2 cursor">▊</span>
              </div>
            </div>

            {error && (
              <motion.div 
                className="text-red-400 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full bg-transparent border border-green-400 py-2 px-4 text-green-400 hover:bg-green-400 hover:text-black transition-all duration-300 font-terminal"
            >
              AUTHENTICATE
            </button>
          </form>

          <div className="mt-8 text-xs opacity-50 text-center">
            <p>Authorized Personnel Only</p>
            <p>Dr. Raghav Kiran - Neural Access Terminal</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AccessGate;