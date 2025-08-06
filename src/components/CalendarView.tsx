import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, AlertTriangle, CheckCircle, Filter, Edit, Trash2, FileText, Users, BookOpen } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'exam' | 'community-visit' | 'reference';
  examType?: 'final' | 'pre-final' | 'mock' | 'lab';
  difficulty?: 'easy' | 'medium' | 'hard';
  date: string;
  time: string;
  notes?: string;
  tags?: string[];
  attachments?: File[];
}

const CalendarView: React.FC = () => {
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'exam' as CalendarEvent['type'],
    examType: 'final' as CalendarEvent['examType'],
    difficulty: 'medium' as CalendarEvent['difficulty'],
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    notes: '',
    tags: ''
  });

  const cardClass = `${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`;

  useEffect(() => {
    const savedEvents = localStorage.getItem('calendar-events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  const saveEvents = (newEvents: CalendarEvent[]) => {
    setEvents(newEvents);
    localStorage.setItem('calendar-events', JSON.stringify(newEvents));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEvent: CalendarEvent = {
      id: editingEvent?.id || Date.now().toString(),
      title: formData.title,
      type: formData.type,
      examType: formData.type === 'exam' ? formData.examType : undefined,
      difficulty: formData.type === 'exam' ? formData.difficulty : undefined,
      date: formData.date,
      time: formData.time,
      notes: formData.notes || undefined,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : undefined
    };

    if (editingEvent) {
      saveEvents(events.map(e => e.id === editingEvent.id ? newEvent : e));
    } else {
      saveEvents([...events, newEvent]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'exam',
      examType: 'final',
      difficulty: 'medium',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      notes: '',
      tags: ''
    });
    setShowAddEvent(false);
    setEditingEvent(null);
  };

  const handleEdit = (event: CalendarEvent) => {
    setFormData({
      title: event.title,
      type: event.type,
      examType: event.examType || 'final',
      difficulty: event.difficulty || 'medium',
      date: event.date,
      time: event.time,
      notes: event.notes || '',
      tags: event.tags?.join(', ') || ''
    });
    setEditingEvent(event);
    setShowAddEvent(true);
  };

  const handleDelete = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      saveEvents(events.filter(e => e.id !== eventId));
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDate = (date: Date, day: number) => {
    if (!day) return [];
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const getDaysUntilEvent = (eventDate: string) => {
    const today = new Date();
    const event = new Date(eventDate);
    const diffTime = event.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getEventTypeIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'exam': return '📝';
      case 'community-visit': return '🏥';
      case 'reference': return '📚';
      default: return '📅';
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(selectedDate);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <div className="space-y-4">
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

        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div key={day} className={`p-2 text-center text-sm font-medium ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {day}
            </div>
          ))}
          
          {days.map((day, index) => {
            const dayEvents = day ? getEventsForDate(selectedDate, day) : [];
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
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className={`w-full h-1 rounded-full ${getDifficultyColor(event.difficulty)}`}
                          title={`${getEventTypeIcon(event.type)} ${event.title}`}
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

  if (events.length === 0 && !showAddEvent) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Calendar
          </h2>
          <button
            onClick={() => setShowAddEvent(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Event</span>
          </button>
        </div>

        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <Calendar className={`h-16 w-16 mx-auto ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              No events scheduled yet
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} max-w-md mx-auto`}>
              Start by adding your first exam, community visit, or important reference to keep track of your academic schedule.
            </p>
            <button
              onClick={() => setShowAddEvent(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Event
            </button>
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
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Add/Edit Event Form */}
      {showAddEvent && (
        <div className={cardClass}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {editingEvent ? 'Edit Event' : 'Add New Event'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className={`w-full px-3 py-2 rounded-md border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="e.g., Pathology Final Exam"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as CalendarEvent['type']})}
                  className={`w-full px-3 py-2 rounded-md border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="exam">📝 Exam</option>
                  <option value="community-visit">🏥 Community Visit</option>
                  <option value="reference">📚 Important Reference</option>
                </select>
              </div>
            </div>

            {formData.type === 'exam' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Exam Type
                  </label>
                  <select
                    value={formData.examType}
                    onChange={(e) => setFormData({...formData, examType: e.target.value as CalendarEvent['examType']})}
                    className={`w-full px-3 py-2 rounded-md border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="final">Final</option>
                    <option value="pre-final">Pre-final</option>
                    <option value="mock">Mock</option>
                    <option value="lab">Lab</option>
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value as CalendarEvent['difficulty']})}
                    className={`w-full px-3 py-2 rounded-md border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className={`w-full px-3 py-2 rounded-md border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Time
                </label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className={`w-full px-3 py-2 rounded-md border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                className={`w-full px-3 py-2 rounded-md border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="e.g., Pathology, CVS, Important"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className={`w-full px-3 py-2 rounded-md border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                rows={3}
                placeholder="Additional notes or reminders..."
              />
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingEvent ? 'Update Event' : 'Add Event'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className={`px-6 py-2 rounded-lg border ${
                  theme === 'dark' 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Quick Stats */}
      {events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className={cardClass}>
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Hard Exams</p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {events.filter(e => e.difficulty === 'hard').length}
                </p>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>This Week</p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {events.filter(e => getDaysUntilEvent(e.date) <= 7 && getDaysUntilEvent(e.date) >= 0).length}
                </p>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Community Visits</p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {events.filter(e => e.type === 'community-visit').length}
                </p>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Events</p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {events.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className={cardClass}>
        {renderMonthView()}
      </div>

      {/* Upcoming Events */}
      {events.length > 0 && (
        <div className={cardClass}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Upcoming Events
          </h3>
          <div className="space-y-4">
            {events
              .filter(event => getDaysUntilEvent(event.date) >= 0)
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 5)
              .map((event) => {
                const daysUntil = getDaysUntilEvent(event.date);
                return (
                  <div key={event.id} className={`p-4 rounded-lg border ${
                    theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getEventTypeIcon(event.type)}</span>
                        <div>
                          <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {event.title}
                          </h4>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {event.date} at {event.time}
                            {event.type === 'exam' && event.examType && ` • ${event.examType}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          daysUntil <= 3 ? 'bg-red-100 text-red-800' :
                          daysUntil <= 7 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {daysUntil === 0 ? 'Today' : `${daysUntil} days`}
                        </span>
                        {event.difficulty && (
                          <div className={`w-3 h-3 rounded-full ${getDifficultyColor(event.difficulty)}`}></div>
                        )}
                        <button
                          onClick={() => handleEdit(event)}
                          className={`p-1 rounded ${
                            theme === 'dark' 
                              ? 'text-gray-400 hover:text-white hover:bg-gray-600' 
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                          }`}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className={`p-1 rounded ${
                            theme === 'dark' 
                              ? 'text-gray-400 hover:text-red-400 hover:bg-gray-600' 
                              : 'text-gray-600 hover:text-red-600 hover:bg-gray-200'
                          }`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {event.notes && (
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {event.notes}
                      </p>
                    )}
                    
                    {event.tags && (
                      <div className="flex items-center space-x-2 mt-2">
                        {event.tags.map((tag, index) => (
                          <span key={index} className={`px-2 py-1 rounded-full text-xs ${
                            theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;