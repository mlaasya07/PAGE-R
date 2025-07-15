import React, { useState } from 'react';
import { Clock, Target, Zap, Play, BarChart3, Filter, BookOpen } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const Quizzes: React.FC = () => {
  const { theme } = useTheme();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedYear, setSelectedYear] = useState('current');
  const [quizHistory, setQuizHistory] = useState<any[]>([]);

  const cardClass = `${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`;

  const quizModes = [
    {
      id: 'practice',
      name: 'Practice Mode',
      icon: Target,
      description: 'Untimed, soft recall with explanations',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'timed',
      name: 'Timed Mode',
      icon: Clock,
      description: 'Simulates real MCQ pacing',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      id: 'fire',
      name: 'Fire Round',
      icon: Zap,
      description: '20 seconds per question max',
      color: 'bg-red-600 hover:bg-red-700'
    }
  ];

  const subjects = [
    'All Subjects',
    'Pathology',
    'Pharmacology',
    'Microbiology',
    'Surgery',
    'Medicine',
    'Forensics',
    'Community Medicine'
  ];

  const academicYears = [
    { value: 'current', label: 'Current Year (3rd)' },
    { value: 'year1', label: 'Year 1 - Anatomy, Physiology' },
    { value: 'year2', label: 'Year 2 - Pathology, Microbiology' },
    { value: 'year4', label: 'Year 4 - Medicine, Surgery' },
    { value: 'mixed', label: 'Mixed Years (NEET PG Style)' }
  ];

  if (quizHistory.length === 0) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Quizzes
          </h2>
          <div className="flex items-center space-x-4">
            <Filter className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {academicYears.map((year) => (
                <option key={year.value} value={year.value}>
                  {year.label}
                </option>
              ))}
            </select>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject.toLowerCase().replace(' ', '-')}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quiz Modes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quizModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <div key={mode.id} className={cardClass}>
                <div className="text-center space-y-4">
                  <div className={`w-16 h-16 mx-auto rounded-full ${mode.color} flex items-center justify-center`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {mode.name}
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {mode.description}
                  </p>
                  <button 
                    onClick={() => setSelectedMode(mode.id)}
                    className={`w-full ${mode.color} text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2`}
                  >
                    <Play className="h-4 w-4" />
                    <span>Start Quiz</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <BookOpen className={`h-16 w-16 mx-auto ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              No quiz history yet
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} max-w-md mx-auto`}>
              Start by taking your first quiz above. You can choose from different modes and academic years to match your study needs.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Quizzes
        </h2>
        <div className="flex items-center space-x-4">
          <Filter className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className={`px-3 py-2 rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            {academicYears.map((year) => (
              <option key={year.value} value={year.value}>
                {year.label}
              </option>
            ))}
          </select>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className={`px-3 py-2 rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            {subjects.map((subject) => (
              <option key={subject} value={subject.toLowerCase().replace(' ', '-')}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quiz Modes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quizModes.map((mode) => {
          const Icon = mode.icon;
          return (
            <div key={mode.id} className={cardClass}>
              <div className="text-center space-y-4">
                <div className={`w-16 h-16 mx-auto rounded-full ${mode.color} flex items-center justify-center`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {mode.name}
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {mode.description}
                </p>
                <button 
                  onClick={() => setSelectedMode(mode.id)}
                  className={`w-full ${mode.color} text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2`}
                >
                  <Play className="h-4 w-4" />
                  <span>Start Quiz</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Quizzes</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{quizHistory.length}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Average Score</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {quizHistory.length > 0 ? Math.round(quizHistory.reduce((sum, q) => sum + q.score, 0) / quizHistory.length) : 0}%
              </p>
            </div>
            <Target className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Best Streak</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>0</p>
            </div>
            <Zap className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Time Saved</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>0m</p>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Recent Quizzes */}
      <div className={cardClass}>
        <div className="text-center py-8">
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            No quiz history yet. Take your first quiz to see results here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Quizzes;