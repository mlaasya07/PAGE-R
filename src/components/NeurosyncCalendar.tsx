import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, AlertTriangle, Clock, Target, X, Upload } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { storage } from '../utils/storage';
import { CalendarEvent } from '../types';
import { v4 as uuidv4 } from 'uuid';

const NeurosyncCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>(() => storage.getEvents());
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    type: 'exam',
    date: '',
    time: '',
    notes: '',
    tags: [],
    attachments: []
  });

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.time) {
      const event: CalendarEvent = {
        id: uuidv4(),
        title: newEvent.title,
        type: newEvent.type as 'exam' | 'community-visit' | 'reference' | 'birthday',
        examType: newEvent.examType,
        difficulty: newEvent.difficulty,
        date: newEvent.date,
        time: newEvent.time,
        notes: newEvent.notes,
        tags: newEvent.tags || [],
        attachments: newEvent.attachments || []
      };
      
      storage.addEvent(event);
      setEvents([...storage.getEvents()]);
      setNewEvent({
        title: '',
        type: 'exam',
        date: '',
        time: '',
        notes: '',
        tags: [],
        attachments: []
      });
      setShowAddEvent(false);
    }
  };

  const handleDeleteEvent = (id: string) => {
    storage.deleteEvent(id);
    setEvents(storage.getEvents());
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setNewEvent({
        ...newEvent,
        attachments: [...(newEvent.attachments || []), ...fileArray]
      });
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getStressLevel = () => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate > now && eventDate <= nextWeek;
    });
    
    const examEvents = upcomingEvents.filter(event => event.type === 'exam');
    const hardExams = examEvents.filter(event => event.difficulty === 'hard');
    
    if (hardExams.length > 0 || examEvents.length > 3) return 'high';
    if (examEvents.length > 1 || upcomingEvents.length > 2) return 'medium';
    if (upcomingEvents.length > 0) return 'low';
    return 'normal';
  };

  const getNextExamDays = () => {
    const now = new Date();
    const upcomingExams = events
      .filter(event => event.type === 'exam' && new Date(event.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (upcomingExams.length === 0) return null;
    
    const nextExam = upcomingExams[0];
    const days = Math.ceil((new Date(nextExam.date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return { days, title: nextExam.title };
  };

  const getStressMessage = (level: string) => {
    const nextExam = getNextExamDays();
    
    switch (level) {
      case 'high':
        return nextExam 
          ? `Critical! ${nextExam.title} in ${nextExam.days} days. Time to panic... responsibly.`
          : 'Multiple exams approaching! Your stress levels are through the roof.';
      case 'medium':
        return nextExam
          ? `${nextExam.title} approaching in ${nextExam.days} days. Time to buckle down.`
          : 'Some events coming up. Stay focused and organized.';
      case 'low':
        return nextExam
          ? `${nextExam.title} in ${nextExam.days} days. You have time to prepare properly.`
          : 'Light schedule ahead. Perfect time for consistent study.';
      default:
        return 'All systems normal. You can breathe easy and plan ahead.';
    }
  };

  const getStressColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-400 border-red-400';
      case 'medium': return 'text-amber-400 border-amber-400';
      case 'low': return 'text-green-400 border-green-400';
      default: return 'text-blue-400 border-blue-400';
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const hasEvent = events.some(event => 
        new Date(event.date).toDateString() === date.toDateString()
      );
      const isBirthday = date.getMonth() === 7 && date.getDate() === 11; // August 11th
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();

      days.push(
        <motion.div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`p-2 cursor-pointer border transition-all duration-200 ${
            isSelected 
              ? 'border-amber-400 bg-amber-400 bg-opacity-20' 
              : isBirthday
              ? 'border-red-400 bg-red-400 bg-opacity-20'
              : isToday
              ? 'border-green-400 bg-green-400 bg-opacity-10'
              : hasEvent
              ? 'border-red-400 bg-red-400 bg-opacity-10'
              : 'border-gray-600 hover:border-green-400'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="text-center">
            <div className={`text-sm ${
              isToday ? 'font-pixel text-green-400' : 
              isBirthday ? 'font-pixel text-red-400' : ''
            }`}>
              {day}
            </div>
            {isBirthday && (
              <div className="text-xs text-red-400 mt-1">🎂</div>
            )}
            {hasEvent && (
              <div className="w-2 h-2 bg-red-400 rounded-full mx-auto mt-1"></div>
            )}
          </div>
        </motion.div>
      );
    }

    return days;
  };

  const getSelectedDateEvents = () => {
    const dateEvents = events.filter(event => 
      new Date(event.date).toDateString() === selectedDate.toDateString()
    );
    
    // Check if selected date is birthday
    const isBirthday = selectedDate.getMonth() === 7 && selectedDate.getDate() === 11;
    if (isBirthday) {
      const age = new Date().getFullYear() - 2005;
      dateEvents.push({
        id: 'birthday-' + selectedDate.getFullYear(),
        title: `Dr. Raghav's ${age}th Birthday 🎂`,
        type: 'birthday',
        date: selectedDate.toISOString().split('T')[0],
        time: '00:00',
        notes: 'Happy Birthday! Time to celebrate another year of medical wisdom.',
        tags: ['birthday', 'celebration'],
        attachments: []
      });
    }
    
    return dateEvents;
  };

  const kaiCalendarComments = [
    "You've booked 5 hours of study and 0.5 hours of breakdown. Shall I rebalance?",
    "Your schedule looks busier than an ER on a Friday night.",
    "I see you've planned study time. Your future self will thank you.",
    "That exam is approaching fast. Time to switch from 'I'll study tomorrow' to 'I'll study now'."
  ];

  return (
    <div className="min-h-screen bg-black text-green-400 font-terminal">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-pixel mb-4 terminal-glow">NEUROSYNC CALENDAR</h1>
          <p className="text-lg opacity-75">Temporal coordination matrix</p>
        </motion.div>

        {/* Stress Level Indicator */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`mb-8 border p-4 ${getStressColor(getStressLevel())}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <AlertTriangle className="w-6 h-6" />
              <div>
                <div className="font-pixel">STRESS LEVEL: {getStressLevel().toUpperCase()}</div>
                <div className="text-sm opacity-75">
                  {getStressMessage(getStressLevel())}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-75">Next Exam</div>
              <div className="font-pixel">
                {(() => {
                  const nextExam = getNextExamDays();
                  return nextExam ? `${nextExam.days} DAYS` : 'NONE';
                })()}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="border border-green-400 p-6">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  className="border border-green-400 px-3 py-1 hover:bg-green-400 hover:text-black transition-colors"
                >
                  ←
                </button>
                <h2 className="text-xl font-pixel">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()}
                </h2>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className="border border-green-400 px-3 py-1 hover:bg-green-400 hover:text-black transition-colors"
                >
                  →
                </button>
              </div>

              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                  <div key={day} className="p-2 text-center text-sm opacity-75 font-pixel">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {renderCalendar()}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Date Events */}
            <div className="border border-amber-400 p-4">
              <h3 className="font-pixel mb-4 text-amber-400">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                }).toUpperCase()}
              </h3>
              
              {getSelectedDateEvents().length > 0 ? (
                <div className="space-y-3">
                  {getSelectedDateEvents().map(event => (
                    <div key={event.id} className={`border p-3 ${
                      event.type === 'birthday' ? 'border-red-400 bg-red-400 bg-opacity-20' :
                      event.type === 'exam' ? 'border-red-400 bg-red-400 bg-opacity-10' :
                      'border-green-400'
                    }`}>
                      <div className="font-pixel text-sm">{event.title}</div>
                      <div className="text-xs opacity-75 mt-1">{event.notes}</div>
                      <div className="text-xs opacity-50 mt-1">{event.time}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm opacity-75">
                  {selectedDate.getMonth() === 7 && selectedDate.getDate() === 11 
                    ? "It's your birthday! 🎂" 
                    : "No events scheduled"}
                </div>
              )}
              
              <button
                onClick={() => setShowAddEvent(true)}
                className="w-full mt-4 border border-amber-400 py-2 hover:bg-amber-400 hover:text-black transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>ADD EVENT</span>
              </button>
              
              {/* Event List for Selected Date */}
              {getSelectedDateEvents().length > 0 && (
                <div className="mt-4 space-y-2">
                  {getSelectedDateEvents().map(event => (
                    <div key={event.id} className="flex items-center justify-between text-xs">
                      <span>{event.title}</span>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="border border-blue-400 p-4">
              <h3 className="font-pixel mb-4 text-blue-400">QUICK STATS</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Upcoming Exams:</span>
                  <span className="font-pixel text-red-400">
                    {events.filter(e => e.type === 'exam' && new Date(e.date) > new Date()).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Events:</span>
                  <span className="font-pixel text-green-400">{events.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">This Month:</span>
                  <span className="font-pixel text-blue-400">
                    {events.filter(e => {
                      const eventDate = new Date(e.date);
                      const now = new Date();
                      return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
                    }).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Kai's Wisdom */}
            <div className="border border-purple-400 p-4">
              <h3 className="font-pixel mb-3 text-purple-400">KAI'S SCHEDULE WISDOM</h3>
              <p className="text-sm opacity-75">
                {events.length === 0 
                  ? "Your calendar is emptier than a medical student's wallet. Time to add some events!"
                  : "Your schedule is looking organized. That's more than most humans can say."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Upcoming Events */}
          <div>
            <h2 className="text-xl font-pixel mb-6">UPCOMING EVENTS</h2>
            <div className="space-y-4">
              {events
                .filter(event => new Date(event.date) >= new Date())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 5)
                .map(event => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border p-4 ${
                      event.type === 'exam' ? 'border-red-400' :
                      event.type === 'birthday' ? 'border-amber-400' :
                      'border-green-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-pixel text-sm">{event.title}</div>
                      <div className="text-xs opacity-75">
                        {Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                      </div>
                    </div>
                    <div className="text-xs opacity-75 mb-2">{event.notes}</div>
                    <div className="text-xs">
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                      {' at '}{event.time}
                    </div>
                  </motion.div>
                ))}
              
              {events.filter(event => new Date(event.date) >= new Date()).length === 0 && (
                <div className="border border-gray-600 p-4 text-center">
                  <div className="text-sm opacity-75">No upcoming events</div>
                  <div className="text-xs opacity-50 mt-2">
                    <span className="text-blue-400">KAI:</span> Your calendar is emptier than a medical student's wallet.
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* All Events List */}
          <div>
            <h2 className="text-xl font-pixel mb-6">ALL EVENTS</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {events
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(event => (
                  <div key={event.id} className="border border-gray-600 p-3 flex items-center justify-between">
                    <div>
                      <div className="font-pixel text-sm">{event.title}</div>
                      <div className="text-xs opacity-75">
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })} at {event.time}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              
              {events.length === 0 && (
                <div className="border border-gray-600 p-4 text-center">
                  <div className="text-sm opacity-75">No events created yet</div>
                  <div className="text-xs opacity-50 mt-2">
                    <span className="text-blue-400">KAI:</span> Time to add some structure to your life!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Legacy Upcoming Events Section - Removed */}
        <div className="hidden mt-12">
          <h2 className="text-xl font-pixel mb-6">UPCOMING EVENTS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events
              .filter(event => new Date(event.date) >= new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map(event => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-green-400 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-pixel text-sm">{event.title}</div>
                    <div className="text-xs opacity-75">
                      {Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                    </div>
                  </div>
                  <div className="text-xs opacity-75 mb-2">{event.notes}</div>
                  <div className="text-xs">
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                    {' at '}{event.time}
                  </div>
                </motion.div>
              ))}
          </div>
        </div>

        {/* Add Event Modal */}
        {showAddEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-black border border-blue-400 p-6 max-w-md w-full mx-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-pixel text-blue-400">ADD NEW EVENT</h3>
                <button
                  onClick={() => setShowAddEvent(false)}
                  className="text-blue-400 hover:text-red-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Title:</label>
                  <input
                    type="text"
                    value={newEvent.title || ''}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full bg-transparent border border-green-400 px-3 py-2 text-green-400 focus:outline-none focus:border-amber-400"
                    placeholder="Event title..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Type:</label>
                    <select
                      value={newEvent.type || 'exam'}
                      onChange={(e) => setNewEvent({...newEvent, type: e.target.value as 'exam' | 'community-visit' | 'reference' | 'birthday'})}
                      className="w-full bg-black border border-green-400 px-3 py-2 text-green-400 focus:outline-none focus:border-amber-400"
                    >
                      <option value="exam">Exam</option>
                      <option value="community-visit">Community Visit</option>
                      <option value="reference">Reference</option>
                      <option value="birthday">Birthday</option>
                    </select>
                  </div>

                  {newEvent.type === 'exam' && (
                    <div>
                      <label className="block text-sm mb-2">Exam Type:</label>
                      <select
                        value={newEvent.examType || 'final'}
                        onChange={(e) => setNewEvent({...newEvent, examType: e.target.value as 'final' | 'pre-final' | 'mock' | 'lab'})}
                        className="w-full bg-black border border-green-400 px-3 py-2 text-green-400 focus:outline-none focus:border-amber-400"
                      >
                        <option value="final">Final</option>
                        <option value="pre-final">Pre-Final</option>
                        <option value="mock">Mock</option>
                        <option value="lab">Lab</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Date:</label>
                    <input
                      type="date"
                      value={newEvent.date || ''}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      className="w-full bg-black border border-green-400 px-3 py-2 text-green-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Time:</label>
                    <input
                      type="time"
                      value={newEvent.time || ''}
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      className="w-full bg-black border border-green-400 px-3 py-2 text-green-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {newEvent.type === 'exam' && (
                  <div>
                    <label className="block text-sm mb-2">Difficulty:</label>
                    <select
                      value={newEvent.difficulty || 'medium'}
                      onChange={(e) => setNewEvent({...newEvent, difficulty: e.target.value as 'easy' | 'medium' | 'hard'})}
                      className="w-full bg-black border border-green-400 px-3 py-2 text-green-400 focus:outline-none focus:border-amber-400"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm mb-2">Notes:</label>
                  <textarea
                    value={newEvent.notes || ''}
                    onChange={(e) => setNewEvent({...newEvent, notes: e.target.value})}
                    className="w-full bg-transparent border border-green-400 p-3 text-green-400 focus:outline-none focus:border-amber-400"
                    rows={3}
                    placeholder="Additional notes..."
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Attachments:</label>
                  <div className="border border-dashed border-green-400 p-4 text-center">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Upload Files</span>
                    </label>
                    {newEvent.attachments && newEvent.attachments.length > 0 && (
                      <div className="mt-2 text-xs opacity-75">
                        {newEvent.attachments.length} file(s) selected
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleAddEvent}
                    className="flex-1 bg-blue-400 text-black py-2 px-4 hover:bg-blue-300 transition-colors"
                  >
                    ADD EVENT
                  </button>
                  <button
                    onClick={() => setShowAddEvent(false)}
                    className="flex-1 border border-red-400 py-2 px-4 text-red-400 hover:bg-red-400 hover:text-black transition-colors"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default NeurosyncCalendar;