import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Upload, FileText, BarChart3, Target } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface TestScore {
  id: string;
  subject: string;
  topics: string[];
  testType: string;
  obtainedMarks: number;
  maxMarks: number;
  percentage: number;
  performance: 'Excellent' | 'Good' | 'Needs Improvement' | 'Critical';
  date: string;
  notes?: string;
  uploadedAnswers?: File[];
}

const AcademicTracker: React.FC = () => {
  const { theme } = useTheme();
  const [scores, setScores] = useState<TestScore[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    topics: '',
    testType: '',
    obtainedMarks: '',
    maxMarks: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const cardClass = `${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`;

  const calculatePerformance = (percentage: number): TestScore['performance'] => {
    if (percentage >= 85) return 'Excellent';
    if (percentage >= 70) return 'Good';
    if (percentage >= 50) return 'Needs Improvement';
    return 'Critical';
  };

  const getPerformanceColor = (performance: TestScore['performance']) => {
    switch (performance) {
      case 'Excellent': return 'text-green-600 bg-green-100';
      case 'Good': return 'text-blue-600 bg-blue-100';
      case 'Needs Improvement': return 'text-yellow-600 bg-yellow-100';
      case 'Critical': return 'text-red-600 bg-red-100';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const obtainedMarks = parseFloat(formData.obtainedMarks);
    const maxMarks = parseFloat(formData.maxMarks);
    const percentage = (obtainedMarks / maxMarks) * 100;
    
    const newScore: TestScore = {
      id: Date.now().toString(),
      subject: formData.subject,
      topics: formData.topics.split(',').map(t => t.trim()),
      testType: formData.testType,
      obtainedMarks,
      maxMarks,
      percentage,
      performance: calculatePerformance(percentage),
      date: formData.date,
      notes: formData.notes || undefined
    };

    setScores([newScore, ...scores]);
    setShowAddForm(false);
    setFormData({
      subject: '',
      topics: '',
      testType: '',
      obtainedMarks: '',
      maxMarks: '',
      notes: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const getWeakSubjects = () => {
    const subjectPerformance = scores.reduce((acc, score) => {
      if (!acc[score.subject]) {
        acc[score.subject] = { total: 0, count: 0, scores: [] };
      }
      acc[score.subject].total += score.percentage;
      acc[score.subject].count += 1;
      acc[score.subject].scores.push(score.percentage);
      return acc;
    }, {} as Record<string, { total: number; count: number; scores: number[] }>);

    return Object.entries(subjectPerformance)
      .map(([subject, data]) => ({
        subject,
        average: data.total / data.count,
        trend: data.scores.length > 1 ? 
          data.scores[data.scores.length - 1] - data.scores[data.scores.length - 2] : 0
      }))
      .filter(item => item.average < 70)
      .sort((a, b) => a.average - b.average);
  };

  const generateFeedback = () => {
    const weakSubjects = getWeakSubjects();
    const criticalScores = scores.filter(s => s.performance === 'Critical');
    
    const feedback = [];
    
    if (criticalScores.length > 0) {
      feedback.push(`Critical attention needed in ${criticalScores[0].subject} - consider focused revision sessions.`);
    }
    
    if (weakSubjects.length > 0) {
      const subject = weakSubjects[0];
      if (subject.trend < 0) {
        feedback.push(`${subject.subject} performance is declining. Review recent topics and practice more MCQs.`);
      } else {
        feedback.push(`${subject.subject} needs improvement. Focus on understanding core concepts.`);
      }
    }

    return feedback;
  };

  if (scores.length === 0 && !showAddForm) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Academic Tracker
          </h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Test Score</span>
          </button>
        </div>

        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <BarChart3 className={`h-16 w-16 mx-auto ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              No records yet
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} max-w-md mx-auto`}>
              Start by adding your first test score to track your academic progress and identify areas for improvement.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Test Score
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
          Academic Tracker
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Test Score</span>
        </button>
      </div>

      {/* Add Score Form */}
      {showAddForm && (
        <div className={cardClass}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Add Test Score
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className={`w-full px-3 py-2 rounded-md border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="e.g., Pathology"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Test Type
                </label>
                <select
                  required
                  value={formData.testType}
                  onChange={(e) => setFormData({...formData, testType: e.target.value})}
                  className={`w-full px-3 py-2 rounded-md border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Select type</option>
                  <option value="Unit Test">Unit Test</option>
                  <option value="Final">Final</option>
                  <option value="Mock">Mock</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Practical">Practical</option>
                </select>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Topics (comma-separated)
              </label>
              <input
                type="text"
                required
                value={formData.topics}
                onChange={(e) => setFormData({...formData, topics: e.target.value})}
                className={`w-full px-3 py-2 rounded-md border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="e.g., Cell Injury, Inflammation, Neoplasia"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Obtained Marks
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.5"
                  value={formData.obtainedMarks}
                  onChange={(e) => setFormData({...formData, obtainedMarks: e.target.value})}
                  className={`w-full px-3 py-2 rounded-md border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Maximum Marks
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.5"
                  value={formData.maxMarks}
                  onChange={(e) => setFormData({...formData, maxMarks: e.target.value})}
                  className={`w-full px-3 py-2 rounded-md border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
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
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Notes (optional)
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
                placeholder="e.g., Ran out of time, Forgot labeling, Missed one question"
              />
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Score
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
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

      {/* Performance Overview */}
      {scores.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className={cardClass}>
              <div className="flex items-center">
                <Target className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Average Score
                  </p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {(scores.reduce((sum, s) => sum + s.percentage, 0) / scores.length).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className={cardClass}>
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Excellent
                  </p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {scores.filter(s => s.performance === 'Excellent').length}
                  </p>
                </div>
              </div>
            </div>

            <div className={cardClass}>
              <div className="flex items-center">
                <TrendingDown className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Need Improvement
                  </p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {scores.filter(s => s.performance === 'Needs Improvement').length}
                  </p>
                </div>
              </div>
            </div>

            <div className={cardClass}>
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Critical
                  </p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {scores.filter(s => s.performance === 'Critical').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          {generateFeedback().length > 0 && (
            <div className={`${cardClass} border-l-4 border-blue-500`}>
              <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Targeted Feedback
              </h3>
              <div className="space-y-2">
                {generateFeedback().map((feedback, index) => (
                  <p key={index} className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    • {feedback}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Recent Scores */}
          <div className={cardClass}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Recent Test Scores
            </h3>
            <div className="space-y-4">
              {scores.slice(0, 5).map((score) => (
                <div key={score.id} className={`p-4 rounded-lg border ${
                  theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {score.subject} - {score.testType}
                      </h4>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {score.topics.join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(score.performance)}`}>
                        {score.performance}
                      </div>
                      <p className={`text-lg font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {score.obtainedMarks}/{score.maxMarks} ({score.percentage.toFixed(1)}%)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                      {new Date(score.date).toLocaleDateString()}
                    </span>
                    {score.notes && (
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        "{score.notes}"
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AcademicTracker;