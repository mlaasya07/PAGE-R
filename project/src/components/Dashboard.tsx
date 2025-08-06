import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Brain, 
  FileText, 
  Calendar, 
  BarChart3, 
  Heart, 
  BookOpen, 
  Gamepad2,
  Stethoscope,
  Activity,
  Coffee
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import KaiAssistant from './KaiAssistant';

const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const modules = [
    {
      id: 'flashcards',
      title: 'FLASHCARD CORE',
      icon: Brain,
      description: 'Neural pattern recognition',
      path: '/flashcards',
      color: 'text-green-400 border-green-400'
    },
    {
      id: 'cases',
      title: 'CASE LAB',
      icon: Stethoscope,
      description: 'Clinical simulation chamber',
      path: '/cases',
      color: 'text-blue-400 border-blue-400'
    },
    {
      id: 'pdf',
      title: 'PDF ZONE',
      icon: FileText,
      description: 'Document processing unit',
      path: '/pdf',
      color: 'text-amber-400 border-amber-400'
    },
    {
      id: 'calendar',
      title: 'NEUROSYNC CALENDAR',
      icon: Calendar,
      description: 'Temporal coordination matrix',
      path: '/calendar',
      color: 'text-purple-400 border-purple-400'
    },
    {
      id: 'stats',
      title: 'STUDY STATS',
      icon: BarChart3,
      description: 'Performance analytics',
      path: '/stats',
      color: 'text-cyan-400 border-cyan-400'
    },
    {
      id: 'mood',
      title: 'MOOD TRACKER',
      icon: Heart,
      description: 'Emotional diagnostics',
      path: '/mood',
      color: 'text-pink-400 border-pink-400'
    },
    {
      id: 'journal',
      title: 'JOURNAL CORE',
      icon: BookOpen,
      description: 'Memory storage vault',
      path: '/journal',
      color: 'text-orange-400 border-orange-400'
    },
    {
      id: 'games',
      title: 'NEURAL GAMES',
      icon: Gamepad2,
      description: 'Cognitive enhancement protocols',
      path: '/games',
      color: 'text-red-400 border-red-400'
    }
  ];

  const welcomeMessages = [
    "Hello, Dr. Raghav Kiran. Your neural logs await."
  ];

  const kaiMessage = welcomeMessages[0];

  return (
    <div className="min-h-screen bg-black text-green-400 font-terminal">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-pixel mb-4 terminal-glow">PAGE-R TERMINAL</h1>
          <p className="text-xl mb-2">{kaiMessage}</p>
          <div className="text-sm opacity-75 blinking-glow">
            SYSTEM TIME: {currentTime.toLocaleString('en-GB')}
          </div>
        </motion.div>

        {/* Status Bar */}
        <motion.div 
          className="mb-8 border border-green-400 p-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Activity className="w-5 h-5" />
              <span>STATUS: OPERATIONAL</span>
            </div>
            <div className="flex items-center space-x-4">
              <Coffee className="w-5 h-5" />
              <span>CAFFEINE: REQUIRED</span>
            </div>
            <div className="flex items-center space-x-4">
              <Brain className="w-5 h-5" />
              <span>NEURAL ACTIVITY: MODERATE</span>
            </div>
          </div>
        </motion.div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={module.path}>
                <div className={`border ${module.color} p-6 hover:bg-opacity-10 hover:bg-current transition-all duration-300 group cursor-pointer`}>
                  <div className="flex items-center mb-4">
                    <module.icon className="w-8 h-8 mr-3" />
                    <h3 className="text-lg font-pixel">{module.title}</h3>
                  </div>
                  <p className="text-sm opacity-75 group-hover:opacity-100 transition-opacity">
                    {module.description}
                  </p>
                  <div className="mt-4 text-xs opacity-50">
                    [CLICK TO ACCESS]
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="border border-green-400 p-4">
            <h4 className="text-lg mb-2">TODAY'S PROGRESS</h4>
            <div className="text-2xl font-pixel">--</div>
            <div className="text-xs opacity-75">Start studying to see progress</div>
          </div>
          
          <div className="border border-amber-400 p-4">
            <h4 className="text-lg mb-2 text-amber-400">STUDY STREAK</h4>
            <div className="text-2xl font-pixel text-amber-400">0 DAYS</div>
            <div className="text-xs opacity-75">Time to build that streak!</div>
          </div>
          
          <div className="border border-blue-400 p-4">
            <h4 className="text-lg mb-2 text-blue-400">NEXT EXAM</h4>
            <div className="text-2xl font-pixel text-blue-400">--</div>
            <div className="text-xs opacity-75">Add exams to calendar</div>
          </div>
        </motion.div>
      </main>

      <KaiAssistant />
      <Footer />
    </div>
  );
};

export default Dashboard;