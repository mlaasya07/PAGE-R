import React, { useState, useEffect } from 'react';
import { Stethoscope, Activity, Calendar, BookOpen, User, Home, Brain, Slash as FlashCard, FileText } from 'lucide-react';
import LoginScreen from './components/LoginScreen';
import WelcomeLetter from './components/WelcomeLetter';
import Dashboard from './components/Dashboard';
import Quizzes from './components/Quizzes';
import Flashcards from './components/Flashcards';
import References from './components/References';
import Profile from './components/Profile';
import CalendarView from './components/CalendarView';
import AcademicTracker from './components/AcademicTracker';
import KaiChat from './components/KaiChat';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { useCodeStatus } from './hooks/useCodeStatus';

function App() {
  const { isAuthenticated, isFirstLogin, login, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { codeStatus } = useCodeStatus();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showKai, setShowKai] = useState(false);
  const [showWelcomeLetter, setShowWelcomeLetter] = useState(false);

  useEffect(() => {
    if (isAuthenticated && isFirstLogin) {
      const hasSeenLetter = localStorage.getItem('hasSeenWelcomeLetter');
      if (!hasSeenLetter) {
        setShowWelcomeLetter(true);
      }
    }
  }, [isAuthenticated, isFirstLogin]);

  useEffect(() => {
    document.title = 'R-PAGER - Clinical Companion';
  }, []);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} />;
  }

  const handleWelcomeGetStarted = () => {
    setActiveTab('calendar'); // Navigate to calendar for setup
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Code Blue': 'bg-blue-500',
      'Code Red': 'bg-red-500',
      'Code Black': 'bg-gray-900',
      'Code White': 'bg-gray-300',
      'Code Orange': 'bg-orange-500',
      'Code Yellow': 'bg-yellow-500',
      'Code Green': 'bg-green-500',
      'Code Gold': 'bg-yellow-400',
      'Code Violet': 'bg-purple-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'quizzes':
        return <Quizzes />;
      case 'flashcards':
        return <Flashcards />;
      case 'references':
        return <References />;
      case 'profile':
        return <Profile onLogout={logout} />;
      case 'calendar':
        return <CalendarView />;
      case 'tracker':
        return <AcademicTracker />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'} font-mono`}>
      {/* Welcome Letter */}
      {showWelcomeLetter && (
        <WelcomeLetter 
          onClose={() => setShowWelcomeLetter(false)}
          onGetStarted={handleWelcomeGetStarted}
        />
      )}

      {/* Sticky Header */}
      <header className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Stethoscope className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    R-PAGER
                  </h1>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Dr. Raghav Kiran
                  </p>
                </div>
              </div>
              
              {/* Code Status Indicator */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(codeStatus)}`}></div>
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {codeStatus}
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Home },
                { id: 'quizzes', label: 'Quizzes', icon: Brain },
                { id: 'flashcards', label: 'Flashcards', icon: FlashCard },
                { id: 'references', label: 'Refs', icon: BookOpen },
                { id: 'tracker', label: 'Tracker', icon: FileText },
                { id: 'calendar', label: 'Calendar', icon: Calendar },
                { id: 'profile', label: 'Profile', icon: User }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === id
                      ? 'bg-blue-600 text-white'
                      : theme === 'dark'
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </div>
                </button>
              ))}
            </nav>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className={`px-3 py-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="dashboard">Dashboard</option>
                <option value="quizzes">Quizzes</option>
                <option value="flashcards">Flashcards</option>
                <option value="references">References</option>
                <option value="tracker">Tracker</option>
                <option value="calendar">Calendar</option>
                <option value="profile">Profile</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Kai Chat Assistant */}
      <KaiChat 
        isVisible={showKai}
        onToggle={() => setShowKai(!showKai)}
        onClose={() => setShowKai(false)}
      />

      {/* Kai Toggle Button */}
      {!showKai && (
        <button
          onClick={() => setShowKai(true)}
          className="fixed bottom-4 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center z-40"
        >
          <Brain className="h-6 w-6" />
        </button>
      )}

      {/* Sticky Footer */}
      <footer className={`sticky bottom-0 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t px-4 py-3`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            "Built for med school. But built more for the human who's getting through it."
          </p>
          <div className="flex items-center space-x-4">
            <Activity className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Session Active
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;