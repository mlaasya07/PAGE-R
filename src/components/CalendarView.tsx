import React, { useState } from 'react';
import { Calendar, Plus, Clock, AlertTriangle, CheckCircle, Filter } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const CalendarView: React.FC = () => {
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const cardClass = `${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`;

  const exams = [
    {
      id: 1,
      title: 'Surgery MCQ',
      date: '2024-12-28',
      time: '09:00',
      type: 'MCQ',
      difficulty: 'Critical',
      syllabus: 'Bailey & Love chapters 1-15',
      color: 'bg-red-500'
    },
    {
      id: 2,
      title: 'Pathology Viva',
      date: '2024-12-30',
      time: '14:00',
      type: 'Viva',
      difficulty: 'Medium',
      syllabus: 'Robbins chapters 1-10',
      color: 'bg-yellow-500'
    },
    {
      id: 3,
      title: 'Pharmacology Quiz',
      date: '2025-01-05',
      time: '10:00',
      type: 'Quiz',
      difficulty: 'Easy',
      syllabus: 'Katzung chapters 1-8',
      color: 'bg-green-500'
    },
    {
      id: 4,
      title: 'Microbiology Practical',
      date: '2025-01-10',
      time: '11:00',
      type: 'Practical',
      difficulty: 'Medium',
      syllabus: 'Lab manual sections 1-5',
      color: 'bg-purple-500'
    }
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getExamsForDate = (date: Date, day: number) => {
    if (!day) return [];
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return exams.filter(exam => exam.date === dateStr);
  };

  const getDaysUntilExam = (examDate: string) => {
    const today = new Date();
    const exam = new Date(examDate);
    const diffTime = exam.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(selectedDate);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <div className="space-y-4">
        {/* Month Header */}
        <div className="flex items-center justify-between">
          <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
              className={`px-3 py-1 rounded-md ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              ‹
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className={`px-3 py-1 rounded-md ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
              className={`px-3 py-1 rounded-md ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              ›
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Week day headers */}
          {weekDays.map((day) => (
            <div key={day} className={`p-2 text-center text-sm font-medium ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {days.map((day, index) => {
            const dayExams = day ? getExamsForDate(selectedDate, day) : [];
            const isToday = day && 
              selectedDate.getMonth() === new Date().getMonth() && 
              selectedDate.getFullYear() === new Date().getFullYear() && 
              day === new Date().getDate();
            
            return (
              <div
                key={index}
                className={`min-h-[80px] p-2 border rounded-lg ${
                  theme === 'dark' 
                    ? 'border-gray-700 hover:border-gray-600' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${day ? 'cursor-pointer' : ''} ${
                  isToday ? 'bg-blue-100 border-blue-300' : ''
                }`}
              >
                {day && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${
                      isToday ? 'text-blue-600' : theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayExams.map((exam) => (
                        <div
                          key={exam.id}
                          className={`w-full h-1 rounded-full ${exam.color}`}
                          title={exam.title}
                        ></div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Calendar
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            {['month', 'week', 'day'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as 'month' | 'week' | 'day')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === mode
                    ? 'bg-blue-600 text-white'
                    : theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAddEvent(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Exam</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={cardClass}>
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Critical</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>1</p>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>This Week</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>2</p>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Prepared</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>3</p>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>4</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className={cardClass}>
        {renderMonthView()}
      </div>

      {/* Upcoming Exams */}
      <div className={cardClass}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Upcoming Exams
        </h3>
        <div className="space-y-4">
          {exams.map((exam) => {
            const daysUntil = getDaysUntilExam(exam.date);
            return (
              <div key={exam.id} className={`p-4 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${exam.color}`}></div>
                    <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {exam.title}
                    </h4>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    daysUntil <= 3 ? 'bg-red-100 text-red-800' :
                    daysUntil <= 7 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {daysUntil > 0 ? `${daysUntil} days` : 'Today'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {exam.date} at {exam.time} • {exam.type}
                    </p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                      {exam.syllabus}
                    </p>
                  </div>
                  <button className={`text-sm px-3 py-1 rounded-md ${
                    theme === 'dark' 
                      ? 'text-blue-400 hover:bg-blue-900/20' 
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}>
                    Study Plan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;