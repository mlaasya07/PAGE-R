import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, Target, Award, Brain } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const StudyStats: React.FC = () => {
  const [studyData, setStudyData] = useState(() => {
    const saved = localStorage.getItem('page-r-study-stats');
    return saved ? JSON.parse(saved) : {
      totalHours: 0,
      flashcardsCompleted: 0,
      averageAccuracy: 0,
      currentStreak: 0,
      weeklyData: [
        { day: 'MON', hours: 0, flashcards: 0, accuracy: 0 },
        { day: 'TUE', hours: 0, flashcards: 0, accuracy: 0 },
        { day: 'WED', hours: 0, flashcards: 0, accuracy: 0 },
        { day: 'THU', hours: 0, flashcards: 0, accuracy: 0 },
        { day: 'FRI', hours: 0, flashcards: 0, accuracy: 0 },
        { day: 'SAT', hours: 0, flashcards: 0, accuracy: 0 },
        { day: 'SUN', hours: 0, flashcards: 0, accuracy: 0 }
      ],
      achievements: [],
      heatmapData: Array.from({ length: 365 }, () => Math.random() * 8)
    };
  });

  const [unlockedAchievements, setUnlockedAchievements] = useState<number[]>([]);

  const achievements = [
    { id: 1, title: 'FIRST STEPS', description: 'Complete your first flashcard', requirement: 'flashcards', value: 1 },
    { id: 2, title: 'GETTING STARTED', description: 'Study for 1 hour total', requirement: 'hours', value: 1 },
    { id: 3, title: 'DEDICATED LEARNER', description: 'Complete 10 flashcards', requirement: 'flashcards', value: 10 },
    { id: 4, title: 'STUDY WARRIOR', description: 'Study for 5 hours total', requirement: 'hours', value: 5 },
    { id: 5, title: 'ACCURACY EXPERT', description: 'Achieve 80% accuracy', requirement: 'accuracy', value: 80 },
    { id: 6, title: 'FLASHCARD MASTER', description: 'Complete 50 flashcards', requirement: 'flashcards', value: 50 },
    { id: 7, title: 'MARATHON STUDENT', description: 'Study for 10 hours total', requirement: 'hours', value: 10 },
    { id: 8, title: 'STREAK STARTER', description: 'Maintain a 3-day streak', requirement: 'streak', value: 3 },
    { id: 9, title: 'PERFECTIONIST', description: 'Achieve 90% accuracy', requirement: 'accuracy', value: 90 },
    { id: 10, title: 'CENTURY CLUB', description: 'Complete 100 flashcards', requirement: 'flashcards', value: 100 },
    { id: 11, title: 'DEDICATION INCARNATE', description: 'Study for 25 hours total', requirement: 'hours', value: 25 },
    { id: 12, title: 'WEEK WARRIOR', description: 'Maintain a 7-day streak', requirement: 'streak', value: 7 },
    { id: 13, title: 'PRECISION MACHINE', description: 'Achieve 95% accuracy', requirement: 'accuracy', value: 95 },
    { id: 14, title: 'FLASHCARD LEGEND', description: 'Complete 250 flashcards', requirement: 'flashcards', value: 250 },
    { id: 15, title: 'STUDY MARATHON', description: 'Study for 50 hours total', requirement: 'hours', value: 50 },
    { id: 16, title: 'FORTNIGHT FIGHTER', description: 'Maintain a 14-day streak', requirement: 'streak', value: 14 },
    { id: 17, title: 'NEAR PERFECTION', description: 'Achieve 98% accuracy', requirement: 'accuracy', value: 98 },
    { id: 18, title: 'HALF THOUSAND', description: 'Complete 500 flashcards', requirement: 'flashcards', value: 500 },
    { id: 19, title: 'CENTURY STUDIER', description: 'Study for 100 hours total', requirement: 'hours', value: 100 },
    { id: 20, title: 'MONTH MASTER', description: 'Maintain a 30-day streak', requirement: 'streak', value: 30 },
    { id: 21, title: 'ANATOMY ACE', description: 'Master anatomy flashcards', requirement: 'category', value: 'anatomy' },
    { id: 22, title: 'PHYSIOLOGY PHENOM', description: 'Master physiology flashcards', requirement: 'category', value: 'physiology' },
    { id: 23, title: 'PATHOLOGY PRO', description: 'Master pathology flashcards', requirement: 'category', value: 'pathology' },
    { id: 24, title: 'PHARMACOLOGY PHARAOH', description: 'Master pharmacology flashcards', requirement: 'category', value: 'pharmacology' },
    { id: 25, title: 'MEDICINE MAVEN', description: 'Master medicine flashcards', requirement: 'category', value: 'medicine' },
    { id: 26, title: 'SURGERY SAGE', description: 'Master surgery flashcards', requirement: 'category', value: 'surgery' },
    { id: 27, title: 'EARLY BIRD', description: 'Study before 6 AM', requirement: 'time', value: 'early' },
    { id: 28, title: 'NIGHT OWL', description: 'Study after 11 PM', requirement: 'time', value: 'late' },
    { id: 29, title: 'WEEKEND WARRIOR', description: 'Study on both weekend days', requirement: 'weekend', value: true },
    { id: 30, title: 'CONSISTENCY KING', description: 'Study every day for a week', requirement: 'consistency', value: 7 },
    { id: 31, title: 'SPEED DEMON', description: 'Complete 20 flashcards in one session', requirement: 'session', value: 20 },
    { id: 32, title: 'ENDURANCE EXPERT', description: 'Study for 3 hours in one day', requirement: 'daily_hours', value: 3 },
    { id: 33, title: 'REVIEW MASTER', description: 'Review 100 old flashcards', requirement: 'reviews', value: 100 },
    { id: 34, title: 'CREATOR CHAMPION', description: 'Create 25 custom flashcards', requirement: 'created', value: 25 },
    { id: 35, title: 'DIFFICULTY DESTROYER', description: 'Master hard difficulty cards', requirement: 'difficulty', value: 'hard' },
    { id: 36, title: 'BALANCED SCHOLAR', description: 'Study all subjects equally', requirement: 'balance', value: true },
    { id: 37, title: 'COMEBACK KID', description: 'Improve accuracy by 20%', requirement: 'improvement', value: 20 },
    { id: 38, title: 'MILESTONE MARKER', description: 'Reach 1000 total flashcards', requirement: 'flashcards', value: 1000 },
    { id: 39, title: 'TIME TRAVELER', description: 'Study for 200 hours total', requirement: 'hours', value: 200 },
    { id: 40, title: 'STREAK SUPREME', description: 'Maintain a 60-day streak', requirement: 'streak', value: 60 },
    { id: 41, title: 'PERFECTIONIST PLUS', description: 'Achieve 99% accuracy', requirement: 'accuracy', value: 99 },
    { id: 42, title: 'ULTIMATE ACHIEVER', description: 'Achieve perfect 100% accuracy', requirement: 'accuracy', value: 100 },
    { id: 43, title: 'FLASHCARD DEITY', description: 'Complete 2000 flashcards', requirement: 'flashcards', value: 2000 },
    { id: 44, title: 'STUDY LEGEND', description: 'Study for 500 hours total', requirement: 'hours', value: 500 },
    { id: 45, title: 'ETERNAL STUDENT', description: 'Maintain a 100-day streak', requirement: 'streak', value: 100 },
    { id: 46, title: 'MORNING GLORY', description: 'Study 30 mornings in a row', requirement: 'morning_streak', value: 30 },
    { id: 47, title: 'MIDNIGHT SCHOLAR', description: 'Study past midnight 10 times', requirement: 'midnight', value: 10 },
    { id: 48, title: 'HOLIDAY HERO', description: 'Study on a holiday', requirement: 'holiday', value: true },
    { id: 49, title: 'BIRTHDAY STUDIER', description: 'Study on your birthday', requirement: 'birthday', value: true },
    { id: 50, title: 'EXAM CRUSHER', description: 'Study the day before an exam', requirement: 'pre_exam', value: true },
    { id: 51, title: 'MULTI-TASKER', description: 'Study while doing another activity', requirement: 'multitask', value: true },
    { id: 52, title: 'LOCATION HOPPER', description: 'Study in 5 different locations', requirement: 'locations', value: 5 },
    { id: 53, title: 'DEVICE MASTER', description: 'Study on multiple devices', requirement: 'devices', value: 3 },
    { id: 54, title: 'SOCIAL STUDIER', description: 'Study with friends 5 times', requirement: 'social', value: 5 },
    { id: 55, title: 'SOLO SCHOLAR', description: 'Study alone for 50 hours', requirement: 'solo_hours', value: 50 },
    { id: 56, title: 'MUSIC LOVER', description: 'Study with music 20 times', requirement: 'music', value: 20 },
    { id: 57, title: 'SILENT STUDENT', description: 'Study in silence for 25 hours', requirement: 'silent_hours', value: 25 },
    { id: 58, title: 'COFFEE COMPANION', description: 'Study with coffee 30 times', requirement: 'coffee', value: 30 },
    { id: 59, title: 'HEALTHY STUDIER', description: 'Study with healthy snacks 15 times', requirement: 'healthy_snacks', value: 15 },
    { id: 60, title: 'BREAK TAKER', description: 'Take proper breaks during study', requirement: 'breaks', value: 20 },
    { id: 61, title: 'POMODORO PRO', description: 'Use Pomodoro technique 25 times', requirement: 'pomodoro', value: 25 },
    { id: 62, title: 'GOAL SETTER', description: 'Set and achieve 10 study goals', requirement: 'goals', value: 10 },
    { id: 63, title: 'PROGRESS TRACKER', description: 'Track progress for 30 days', requirement: 'tracking', value: 30 },
    { id: 64, title: 'REFLECTION MASTER', description: 'Write 20 study reflections', requirement: 'reflections', value: 20 },
    { id: 65, title: 'IMPROVEMENT SEEKER', description: 'Identify and fix 10 weak areas', requirement: 'improvements', value: 10 },
    { id: 66, title: 'RESOURCE COLLECTOR', description: 'Use 15 different study resources', requirement: 'resources', value: 15 },
    { id: 67, title: 'NOTE TAKER', description: 'Take notes during 50 study sessions', requirement: 'notes', value: 50 },
    { id: 68, title: 'SUMMARY WRITER', description: 'Write 25 topic summaries', requirement: 'summaries', value: 25 },
    { id: 69, title: 'QUESTION ASKER', description: 'Ask 100 study questions', requirement: 'questions', value: 100 },
    { id: 70, title: 'ANSWER SEEKER', description: 'Find answers to 100 questions', requirement: 'answers', value: 100 },
    { id: 71, title: 'CONCEPT MAPPER', description: 'Create 10 concept maps', requirement: 'concept_maps', value: 10 },
    { id: 72, title: 'DIAGRAM DRAWER', description: 'Draw 50 study diagrams', requirement: 'diagrams', value: 50 },
    { id: 73, title: 'MEMORY PALACE', description: 'Use memory techniques 20 times', requirement: 'memory_techniques', value: 20 },
    { id: 74, title: 'SPACED REPETITION', description: 'Use spaced repetition for 30 days', requirement: 'spaced_repetition', value: 30 },
    { id: 75, title: 'ACTIVE RECALL', description: 'Practice active recall 100 times', requirement: 'active_recall', value: 100 },
    { id: 76, title: 'INTERLEAVING EXPERT', description: 'Practice interleaving 25 times', requirement: 'interleaving', value: 25 },
    { id: 77, title: 'ELABORATION MASTER', description: 'Use elaboration technique 30 times', requirement: 'elaboration', value: 30 },
    { id: 78, title: 'DUAL CODING', description: 'Use visual and verbal learning 20 times', requirement: 'dual_coding', value: 20 },
    { id: 79, title: 'METACOGNITION MAVEN', description: 'Practice metacognition 40 times', requirement: 'metacognition', value: 40 },
    { id: 80, title: 'SELF-TESTING SAGE', description: 'Self-test 200 times', requirement: 'self_testing', value: 200 },
    { id: 81, title: 'FEEDBACK SEEKER', description: 'Seek feedback 25 times', requirement: 'feedback', value: 25 },
    { id: 82, title: 'MISTAKE LEARNER', description: 'Learn from 50 mistakes', requirement: 'mistakes', value: 50 },
    { id: 83, title: 'PERSISTENCE CHAMPION', description: 'Continue studying after failures', requirement: 'persistence', value: 10 },
    { id: 84, title: 'GROWTH MINDSET', description: 'Show growth mindset 30 times', requirement: 'growth_mindset', value: 30 },
    { id: 85, title: 'CURIOSITY CATALYST', description: 'Show curiosity 50 times', requirement: 'curiosity', value: 50 },
    { id: 86, title: 'DEEP LEARNER', description: 'Engage in deep learning 25 times', requirement: 'deep_learning', value: 25 },
    { id: 87, title: 'SURFACE AVOIDER', description: 'Avoid surface learning habits', requirement: 'avoid_surface', value: true },
    { id: 88, title: 'STRATEGIC STUDIER', description: 'Use study strategies effectively', requirement: 'strategic', value: 20 },
    { id: 89, title: 'ADAPTIVE LEARNER', description: 'Adapt study methods 15 times', requirement: 'adaptive', value: 15 },
    { id: 90, title: 'EFFICIENT OPTIMIZER', description: 'Optimize study efficiency', requirement: 'efficiency', value: 10 },
    { id: 91, title: 'TIME MANAGER', description: 'Manage study time effectively', requirement: 'time_management', value: 30 },
    { id: 92, title: 'PRIORITY SETTER', description: 'Set study priorities correctly', requirement: 'priorities', value: 20 },
    { id: 93, title: 'DISTRACTION FIGHTER', description: 'Overcome distractions 40 times', requirement: 'distractions', value: 40 },
    { id: 94, title: 'FOCUS MASTER', description: 'Maintain focus for long periods', requirement: 'focus', value: 25 },
    { id: 95, title: 'CONCENTRATION KING', description: 'Show deep concentration 30 times', requirement: 'concentration', value: 30 },
    { id: 96, title: 'ATTENTION EXPERT', description: 'Master attention control', requirement: 'attention', value: 35 },
    { id: 97, title: 'MINDFULNESS MONK', description: 'Practice mindful studying', requirement: 'mindfulness', value: 20 },
    { id: 98, title: 'STRESS MANAGER', description: 'Manage study stress effectively', requirement: 'stress_management', value: 15 },
    { id: 99, title: 'WELLNESS WARRIOR', description: 'Maintain wellness while studying', requirement: 'wellness', value: 25 },
    { id: 100, title: 'ULTIMATE SCHOLAR', description: 'Master all aspects of studying', requirement: 'ultimate', value: true }
  ];

  useEffect(() => {
    // Check for newly unlocked achievements
    const newlyUnlocked: number[] = [];
    
    achievements.forEach(achievement => {
      if (!unlockedAchievements.includes(achievement.id)) {
        let unlocked = false;
        
        switch (achievement.requirement) {
          case 'flashcards':
            unlocked = studyData.flashcardsCompleted >= achievement.value;
            break;
          case 'hours':
            unlocked = studyData.totalHours >= achievement.value;
            break;
          case 'accuracy':
            unlocked = studyData.averageAccuracy >= achievement.value;
            break;
          case 'streak':
            unlocked = studyData.currentStreak >= achievement.value;
            break;
          default:
            unlocked = false;
        }
        
        if (unlocked) {
          newlyUnlocked.push(achievement.id);
        }
      }
    });
    
    if (newlyUnlocked.length > 0) {
      setUnlockedAchievements(prev => [...prev, ...newlyUnlocked]);
    }
  }, [studyData, unlockedAchievements]);

  const subjectProgress = [
    { name: 'ANATOMY', progress: Math.round(Math.random() * 100), color: 'text-green-400' },
    { name: 'PHYSIOLOGY', progress: Math.round(Math.random() * 100), color: 'text-blue-400' },
    { name: 'PATHOLOGY', progress: Math.round(Math.random() * 100), color: 'text-red-400' },
    { name: 'PHARMACOLOGY', progress: Math.round(Math.random() * 100), color: 'text-purple-400' },
    { name: 'MEDICINE', progress: Math.round(Math.random() * 100), color: 'text-amber-400' },
    { name: 'SURGERY', progress: Math.round(Math.random() * 100), color: 'text-pink-400' }
  ];

  const renderASCIIChart = (data: number[], maxHeight: number = 10) => {
    const max = Math.max(...data, 1);
    const normalized = data.map(val => Math.round((val / max) * maxHeight));
    
    const chart = [];
    for (let row = maxHeight; row >= 0; row--) {
      let line = '';
      for (let col = 0; col < normalized.length; col++) {
        line += normalized[col] >= row ? '▓' : ' ';
        line += '  '; // Add spacing between bars
      }
      chart.push(line);
    }
    return chart;
  };

  const generateHeatmapData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const intensity = Math.random();
      data.push({
        date: date.toISOString().split('T')[0],
        intensity,
        hours: Math.round(intensity * 8)
      });
    }
    return data;
  };

  const heatmapData = generateHeatmapData();

  const kaiComments = [
    "Your stats are looking pretty empty. Time to get started!",
    "Zero progress is still progress... right? Right?",
    "I see you're taking the 'slow and steady' approach to an extreme.",
    "These numbers need some work. But hey, at least you're here!"
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
          <h1 className="text-3xl font-pixel mb-4 terminal-glow">STUDY STATS</h1>
          <p className="text-lg opacity-75">Performance analytics dashboard</p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border border-green-400 p-4 text-center"
          >
            <Clock className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <div className="text-2xl font-pixel">{studyData.totalHours}h</div>
            <div className="text-sm opacity-75">TOTAL STUDY TIME</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="border border-amber-400 p-4 text-center"
          >
            <Brain className="w-8 h-8 mx-auto mb-2 text-amber-400" />
            <div className="text-2xl font-pixel text-amber-400">{studyData.flashcardsCompleted}</div>
            <div className="text-sm opacity-75">FLASHCARDS COMPLETED</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border border-blue-400 p-4 text-center"
          >
            <Target className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-pixel text-blue-400">{studyData.averageAccuracy}%</div>
            <div className="text-sm opacity-75">AVERAGE ACCURACY</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="border border-purple-400 p-4 text-center"
          >
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-pixel text-purple-400">{studyData.currentStreak}</div>
            <div className="text-sm opacity-75">DAY STREAK</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Weekly Activity Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="border border-green-400 p-6"
          >
            <h2 className="text-xl font-pixel mb-6 text-green-400">WEEKLY ACTIVITY</h2>
            
            {/* ASCII Chart */}
            <div className="mb-6">
              <div className="text-sm opacity-75 mb-2">STUDY HOURS:</div>
              <pre className="text-xs leading-tight overflow-x-auto">
                {renderASCIIChart(studyData.weeklyData.map(d => d.hours)).map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
                <div className="mt-2">M  T  W  T  F  S  S</div>
              </pre>
            </div>

            {/* Detailed Stats */}
            <div className="space-y-2">
              {studyData.weeklyData.map((day, index) => (
                <div key={day.day} className="flex justify-between text-sm">
                  <span className="w-8">{day.day}</span>
                  <span className="flex-1 text-right">{day.hours}h | {day.flashcards} cards | {day.accuracy}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Subject Progress */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="border border-amber-400 p-6"
          >
            <h2 className="text-xl font-pixel mb-6 text-amber-400">SUBJECT PROGRESS</h2>
            
            <div className="space-y-4">
              {subjectProgress.map((subject, index) => (
                <motion.div
                  key={subject.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex justify-between mb-2">
                    <span className={`font-pixel text-sm ${subject.color}`}>
                      {subject.name}
                    </span>
                    <span className="text-sm">{subject.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2">
                    <motion.div
                      className={`h-2 ${subject.color.replace('text-', 'bg-')}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 text-xs opacity-50">
              <span className="text-blue-400">KAI:</span> {kaiComments[Math.floor(Math.random() * kaiComments.length)]}
            </div>
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-xl font-pixel mb-6">ACHIEVEMENTS ({unlockedAchievements.length}/100)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
            {achievements.map((achievement, index) => {
              const isUnlocked = unlockedAchievements.includes(achievement.id);
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.01 }}
                  className={`border p-3 ${
                    isUnlocked 
                      ? 'border-amber-400 text-amber-400' 
                      : 'border-gray-600 text-gray-600'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <Award className={`w-5 h-5 mr-2 ${
                      isUnlocked ? 'text-amber-400' : 'text-gray-600'
                    }`} />
                    <span className="font-pixel text-xs">{achievement.title}</span>
                  </div>
                  <p className="text-xs opacity-75">{achievement.description}</p>
                  {isUnlocked && (
                    <div className="text-xs mt-2 text-green-400">✓ UNLOCKED</div>
                  )}
                </motion.div>
              );
            })}
          </div>
          
          <div className="text-center mt-6 text-sm opacity-50">
            {unlockedAchievements.length === 0 
              ? "Start studying to unlock achievements!" 
              : `${100 - unlockedAchievements.length} achievements remaining!`}
          </div>
        </motion.div>

        {/* Study Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-blue-400 p-6"
        >
          <h2 className="text-xl font-pixel mb-6 text-blue-400">STUDY HEATMAP</h2>
          <div className="overflow-x-auto">
            <div className="inline-block border border-blue-400 p-4 min-w-full">
              <div className="text-sm opacity-75 mb-4">LAST 365 DAYS</div>
              <div className="grid grid-cols-53 gap-1 mb-4">
                {heatmapData.map((day, i) => {
                  const intensity = day.intensity;
                  return (
                    <div
                      key={i}
                      className={`w-3 h-3 ${
                        intensity > 0.7 ? 'bg-green-400' :
                        intensity > 0.4 ? 'bg-amber-400' :
                        intensity > 0.2 ? 'bg-blue-400' :
                        'bg-gray-800'
                      }`}
                      title={`${day.date}: ${day.hours} hours`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-xs opacity-50">
                <span>Less</span>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gray-800"></div>
                  <div className="w-3 h-3 bg-blue-400"></div>
                  <div className="w-3 h-3 bg-amber-400"></div>
                  <div className="w-3 h-3 bg-green-400"></div>
                </div>
                <span>More</span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default StudyStats;