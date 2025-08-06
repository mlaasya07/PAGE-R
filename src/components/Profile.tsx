import React, { useState } from 'react';
import { User, Settings, Moon, Sun, LogOut, BarChart3, Clock, Target, Award } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useCodeStatus } from '../hooks/useCodeStatus';

interface ProfileProps {
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const { codeStatus, setCodeStatus } = useCodeStatus();
  const [aiAssistantName, setAiAssistantName] = useState('Kai');
  const [showSettings, setShowSettings] = useState(false);

  const cardClass = `${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`;

  const stats = [
    { label: 'Total Flashcards', value: '735', icon: Target, color: 'text-blue-600' },
    { label: 'Quiz Accuracy', value: '84%', icon: BarChart3, color: 'text-green-600' },
    { label: 'Study Time', value: '127h', icon: Clock, color: 'text-purple-600' },
    { label: 'Streak', value: '7 days', icon: Award, color: 'text-yellow-600' }
  ];

  const subjectProgress = [
    { subject: 'Pathology', cards: 245, accuracy: 87, timeSpent: 45 },
    { subject: 'Pharmacology', cards: 189, accuracy: 82, timeSpent: 38 },
    { subject: 'Microbiology', cards: 167, accuracy: 79, timeSpent: 32 },
    { subject: 'Surgery', cards: 134, accuracy: 91, timeSpent: 28 }
  ];

  const codeStatusOptions = [
    { value: 'Code Blue', label: 'Code Blue - Burnout Risk', color: 'bg-blue-500' },
    { value: 'Code Red', label: 'Code Red - Focus Peak', color: 'bg-red-500' },
    { value: 'Code Black', label: 'Code Black - Overloaded', color: 'bg-gray-900' },
    { value: 'Code White', label: 'Code White - Brain Fog', color: 'bg-gray-300' },
    { value: 'Code Orange', label: 'Code Orange - Repetition Fatigue', color: 'bg-orange-500' },
    { value: 'Code Yellow', label: 'Code Yellow - Exam Imminent', color: 'bg-yellow-500' },
    { value: 'Code Green', label: 'Code Green - Balanced Flow', color: 'bg-green-500' },
    { value: 'Code Gold', label: 'Code Gold - Confidence Zone', color: 'bg-yellow-400' },
    { value: 'Code Violet', label: 'Code Violet - Emotional Strain', color: 'bg-purple-500' }
  ];

  const codeHistory = [
    { date: '2024-12-25', code: 'Code Green', duration: '8h' },
    { date: '2024-12-24', code: 'Code Yellow', duration: '6h' },
    { date: '2024-12-23', code: 'Code Red', duration: '4h' },
    { date: '2024-12-22', code: 'Code Blue', duration: '12h' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
            <User className={`h-8 w-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
          </div>
          <div>
            <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Dr. Raghav Kiran
            </h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              3rd Year MBBS • Apollo Medical College
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg ${
              theme === 'dark' 
                ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Settings className="h-5 w-5" />
          </button>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className={cardClass}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Settings
          </h3>
          <div className="space-y-6">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Theme
                </label>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Switch between light and dark mode
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-yellow-400' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>

            {/* AI Assistant Name */}
            <div className="flex items-center justify-between">
              <div>
                <label className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  AI Assistant Name
                </label>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Customize your study assistant's name
                </p>
              </div>
              <input
                type="text"
                value={aiAssistantName}
                onChange={(e) => setAiAssistantName(e.target.value)}
                className={`px-3 py-1 rounded-md border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            {/* Code Status Override */}
            <div>
              <label className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Current Code Status
              </label>
              <p className={`text-xs mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Override your current mental/academic state
              </p>
              <select
                value={codeStatus}
                onChange={(e) => setCodeStatus(e.target.value)}
                className={`w-full px-3 py-2 rounded-md border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {codeStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={cardClass}>
              <div className="flex items-center">
                <Icon className={`h-8 w-8 ${stat.color} mr-3`} />
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subject Progress */}
      <div className={cardClass}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Subject Progress
        </h3>
        <div className="space-y-4">
          {subjectProgress.map((subject) => (
            <div key={subject.subject} className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {subject.subject}
                </h4>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {subject.cards} cards
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Accuracy
                  </p>
                  <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {subject.accuracy}%
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Time Spent
                  </p>
                  <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {subject.timeSpent}h
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Code History */}
      <div className={cardClass}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Code History Timeline
        </h3>
        <div className="space-y-3">
          {codeHistory.map((entry, index) => {
            const statusOption = codeStatusOptions.find(opt => opt.value === entry.code);
            return (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${statusOption?.color}`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {entry.code}
                    </span>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {entry.date}
                    </span>
                  </div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Duration: {entry.duration}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile;