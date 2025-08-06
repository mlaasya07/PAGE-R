import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Play, RefreshCw, CheckCircle, Plus, Upload, X, Skull } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

interface CaseData {
  id: string;
  title: string;
  scenario: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
}

const CaseLab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentCase, setCurrentCase] = useState<CaseData | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [userCases, setUserCases] = useState<CaseData[]>([]);
  const [abgSequence, setAbgSequence] = useState('');
  const [isShutdown, setIsShutdown] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [newCase, setNewCase] = useState({
    title: '',
    scenario: '',
    question: '',
    options: ['', '', '', ''],
    correct: 0,
    explanation: '',
    category: 'custom'
  });

  const categories = [
    { id: 'cardio', name: 'CARDIO', color: 'text-red-400 border-red-400' },
    { id: 'endo', name: 'ENDO', color: 'text-blue-400 border-blue-400' },
    { id: 'psych', name: 'PSYCH', color: 'text-purple-400 border-purple-400' },
    { id: 'winging-it', name: 'WINGING IT', color: 'text-amber-400 border-amber-400' },
    { id: 'custom', name: 'CUSTOM CASES', color: 'text-green-400 border-green-400' }
  ];

  // ABG chaos mode detection
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      let newSequence = abgSequence + key;
      
      if ('abg'.startsWith(newSequence)) {
        setAbgSequence(newSequence);
        if (newSequence === 'abg') {
          triggerAbgChaos();
          setAbgSequence('');
        }
      } else {
        setAbgSequence('');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [abgSequence]);

  // Countdown timer for shutdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isShutdown && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (isShutdown && countdown === 0) {
      setIsShutdown(false);
      setCountdown(30);
    }
    return () => clearTimeout(timer);
  }, [isShutdown, countdown]);

  const triggerAbgChaos = () => {
    setIsShutdown(true);
    setCountdown(30);
  };

  const generateCase = (category: string) => {
    const categoryCases = userCases.filter(c => c.category === category);
    if (categoryCases.length > 0) {
      const randomCase = categoryCases[Math.floor(Math.random() * categoryCases.length)];
      setCurrentCase(randomCase);
      setShowAnswer(false);
    } else {
      // No cases available for this category
      setCurrentCase(null);
    }
  };

  const handleAddCase = () => {
    if (newCase.title && newCase.scenario && newCase.question && newCase.options.every(opt => opt.trim())) {
      const caseData: CaseData = {
        id: Date.now().toString(),
        ...newCase
      };
      
      setUserCases([...userCases, caseData]);
      setNewCase({
        title: '',
        scenario: '',
        question: '',
        options: ['', '', '', ''],
        correct: 0,
        explanation: '',
        category: 'custom'
      });
      setShowUploadForm(false);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...newCase.options];
    newOptions[index] = value;
    setNewCase({ ...newCase, options: newOptions });
  };

  const kaiComments = [
    "No cases yet? Time to add some clinical scenarios.",
    "Your case collection is emptier than a medical student's wallet.",
    "Upload some cases to test your diagnostic skills.",
    "The only case here is the case of missing cases."
  ];

  // ABG Chaos Mode Overlay
  if (isShutdown) {
    const currentTime = new Date().toLocaleTimeString();
    
    return (
      <div className="min-h-screen bg-black text-red-400 glitch font-terminal flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center border border-red-400 p-12 max-w-2xl"
        >
          <Skull className="w-24 h-24 mx-auto mb-8 text-red-400 glitch" />
          <h1 className="text-4xl font-pixel mb-8 text-red-400 glitch">SYSTEM FAILURE</h1>
          <div className="text-2xl font-pixel mb-4 glitch">
            DECLARED DEAD AT TIME: {currentTime}
          </div>
          <div className="text-xl mb-8 glitch">
            PREPARE FOR REBOOTING IN: {countdown} SECS
          </div>
          <div className="text-sm opacity-75 glitch">
            ABG CHAOS MODE ACTIVATED - ARTERIAL BLOOD GAS OVERLOAD DETECTED
          </div>
          <div className="mt-4 text-xs opacity-50 glitch">
            pH: 6.8 | pCO2: CRITICAL | HCO3: DEPLETED | PROGNOSIS: GRIM
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-terminal">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-pixel mb-4 terminal-glow">CASE LAB</h1>
          <p className="text-lg opacity-75">Clinical simulation chamber</p>
        </motion.div>

        {/* Category Selection */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                generateCase(category.id);
              }}
              className={`border ${category.color} p-6 hover:bg-opacity-10 hover:bg-current transition-all duration-300 font-pixel`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Stethoscope className="w-8 h-8 mx-auto mb-2" />
              <div className="text-sm">{category.name}</div>
              <div className="text-xs opacity-50 mt-1">
                {userCases.filter(c => c.category === category.id).length} cases
              </div>
            </motion.button>
          ))}
        </div>

        {/* Upload Case Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowUploadForm(true)}
            className="flex items-center space-x-2 border border-green-400 px-6 py-3 hover:bg-green-400 hover:text-black transition-colors mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>UPLOAD NEW CASE</span>
          </button>
        </div>

        {/* Hidden Easter Egg Hint */}
        <div className="text-center mb-8 text-xs opacity-50">
          <p>Psst... Type 'ABG' for acid-base chaos mode</p>
        </div>

        {/* Current Case Display */}
        {currentCase && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="border border-green-400 p-6 mb-6">
              <h2 className="text-2xl font-pixel mb-4 text-amber-400">
                {currentCase.title}
              </h2>
              
              <div className="mb-6">
                <h3 className="text-lg mb-3 text-blue-400">CLINICAL SCENARIO:</h3>
                <p className="text-base leading-relaxed mb-4">
                  {currentCase.scenario}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg mb-3 text-purple-400">QUESTION:</h3>
                <p className="text-base mb-4">{currentCase.question}</p>
              </div>

              <div className="space-y-3 mb-6">
                {currentCase.options.map((option: string, index: number) => (
                  <motion.button
                    key={index}
                    onClick={() => setShowAnswer(true)}
                    className={`w-full text-left p-4 border transition-all duration-300 ${
                      showAnswer && index === currentCase.correct
                        ? 'border-green-400 bg-green-400 bg-opacity-20 text-green-400'
                        : showAnswer && index !== currentCase.correct
                        ? 'border-red-400 text-red-400 opacity-50'
                        : 'border-gray-600 hover:border-amber-400 hover:text-amber-400'
                    }`}
                    whileHover={{ x: 5 }}
                  >
                    <span className="font-pixel mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </motion.button>
                ))}
              </div>

              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-green-400 p-4 bg-green-400 bg-opacity-10"
                >
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                    <span className="font-pixel text-green-400">EXPLANATION:</span>
                  </div>
                  <p className="text-base">{currentCase.explanation}</p>
                </motion.div>
              )}

              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={() => generateCase(selectedCategory)}
                  className="flex items-center space-x-2 border border-blue-400 px-6 py-3 hover:bg-blue-400 hover:text-black transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>NEW CASE</span>
                </button>
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="flex items-center space-x-2 border border-amber-400 px-6 py-3 hover:bg-amber-400 hover:text-black transition-colors"
                >
                  <Play className="w-5 h-5" />
                  <span>{showAnswer ? 'HIDE' : 'SHOW'} ANSWER</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        {!currentCase && !showUploadForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="border border-green-400 p-8">
              <Stethoscope className="w-16 h-16 mx-auto mb-4 text-green-400" />
              <h2 className="text-xl font-pixel mb-4">SELECT A CATEGORY OR UPLOAD A CASE</h2>
              <p className="text-base opacity-75 mb-6">
                Choose a medical specialty to view cases, or upload your own clinical scenarios. 
                Each case includes a scenario, multiple choice questions, and detailed explanations.
              </p>
              <div className="text-sm opacity-50">
                <span className="text-blue-400">KAI:</span> {kaiComments[Math.floor(Math.random() * kaiComments.length)]}
              </div>
            </div>
          </motion.div>
        )}

        {/* Upload Case Form */}
        {showUploadForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="border border-green-400 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-pixel text-green-400">UPLOAD NEW CASE</h2>
                <button
                  onClick={() => setShowUploadForm(false)}
                  className="text-green-400 hover:text-red-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm mb-2">Case Title:</label>
                  <input
                    type="text"
                    value={newCase.title}
                    onChange={(e) => setNewCase({...newCase, title: e.target.value})}
                    className="w-full bg-transparent border border-green-400 px-3 py-2 text-green-400 focus:outline-none focus:border-amber-400"
                    placeholder="Enter case title..."
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Category:</label>
                  <select
                    value={newCase.category}
                    onChange={(e) => setNewCase({...newCase, category: e.target.value})}
                    className="w-full bg-black border border-green-400 px-3 py-2 text-green-400 focus:outline-none focus:border-amber-400"
                  >
                    <option value="custom">Custom Cases</option>
                    <option value="cardio">Cardio</option>
                    <option value="endo">Endo</option>
                    <option value="psych">Psych</option>
                    <option value="winging-it">Winging It</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2">Clinical Scenario:</label>
                  <textarea
                    value={newCase.scenario}
                    onChange={(e) => setNewCase({...newCase, scenario: e.target.value})}
                    className="w-full bg-transparent border border-green-400 p-3 text-green-400 focus:outline-none focus:border-amber-400"
                    rows={4}
                    placeholder="Describe the clinical scenario..."
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Question:</label>
                  <textarea
                    value={newCase.question}
                    onChange={(e) => setNewCase({...newCase, question: e.target.value})}
                    className="w-full bg-transparent border border-green-400 p-3 text-green-400 focus:outline-none focus:border-amber-400"
                    rows={2}
                    placeholder="What is your question?"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Answer Options:</label>
                  {newCase.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 mb-2">
                      <span className="font-pixel text-sm w-6">{String.fromCharCode(65 + index)}.</span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-1 bg-transparent border border-green-400 px-3 py-2 text-green-400 focus:outline-none focus:border-amber-400"
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      />
                      <input
                        type="radio"
                        name="correct"
                        checked={newCase.correct === index}
                        onChange={() => setNewCase({...newCase, correct: index})}
                        className="w-4 h-4"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm mb-2">Explanation:</label>
                  <textarea
                    value={newCase.explanation}
                    onChange={(e) => setNewCase({...newCase, explanation: e.target.value})}
                    className="w-full bg-transparent border border-green-400 p-3 text-green-400 focus:outline-none focus:border-amber-400"
                    rows={3}
                    placeholder="Explain the correct answer..."
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleAddCase}
                    className="flex-1 bg-green-400 text-black py-3 px-6 hover:bg-green-300 transition-colors font-pixel"
                  >
                    UPLOAD CASE
                  </button>
                  <button
                    onClick={() => setShowUploadForm(false)}
                    className="flex-1 border border-red-400 py-3 px-6 text-red-400 hover:bg-red-400 hover:text-black transition-colors"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="border border-green-400 p-4 text-center">
            <div className="text-2xl font-pixel">{userCases.length}</div>
            <div className="text-sm opacity-75">TOTAL CASES</div>
          </div>
          <div className="border border-amber-400 p-4 text-center">
            <div className="text-2xl font-pixel text-amber-400">0</div>
            <div className="text-sm opacity-75">CASES SOLVED</div>
          </div>
          <div className="border border-blue-400 p-4 text-center">
            <div className="text-2xl font-pixel text-blue-400">--%</div>
            <div className="text-sm opacity-75">ACCURACY RATE</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CaseLab;