import React, { useState } from 'react';
import { BookOpen, FileText, ExternalLink, Upload, Search, Star, Filter } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const References: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('books');
  const [searchTerm, setSearchTerm] = useState('');

  const cardClass = `${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`;

  const books = [
    {
      id: 1,
      title: 'Robbins Basic Pathology',
      author: 'Kumar, Abbas, Aster',
      category: 'Pathology',
      type: 'PDF',
      bookmarked: true,
      lastOpened: '2 days ago',
      progress: 68
    },
    {
      id: 2,
      title: 'Katzung & Trevor\'s Pharmacology',
      author: 'Katzung, Trevor',
      category: 'Pharmacology',
      type: 'PDF',
      bookmarked: false,
      lastOpened: '1 week ago',
      progress: 45
    },
    {
      id: 3,
      title: 'Bailey & Love\'s Surgery',
      author: 'Williams, Bulstrode',
      category: 'Surgery',
      type: 'Link',
      bookmarked: true,
      lastOpened: '3 days ago',
      progress: 23
    }
  ];

  const clinicalCases = [
    {
      id: 1,
      title: 'Acute Myocardial Infarction in Young Adult',
      source: 'NEJM',
      specialty: 'Cardiology',
      studied: true,
      difficulty: 'Hard',
      dateAdded: '1 week ago'
    },
    {
      id: 2,
      title: 'Chronic Kidney Disease with Complications',
      source: 'MSD Manual',
      specialty: 'Nephrology',
      studied: false,
      difficulty: 'Moderate',
      dateAdded: '3 days ago'
    },
    {
      id: 3,
      title: 'Diabetic Ketoacidosis Management',
      source: 'In2Med',
      specialty: 'Endocrinology',
      studied: true,
      difficulty: 'Moderate',
      dateAdded: '5 days ago'
    }
  ];

  const researchPapers = [
    {
      id: 1,
      title: 'COVID-19 Pathophysiology Updates',
      journal: 'Nature Medicine',
      year: '2024',
      impact: 'High',
      bookmarked: true,
      tags: ['COVID-19', 'Pathophysiology', 'Recent']
    },
    {
      id: 2,
      title: 'Antibiotic Resistance Mechanisms',
      journal: 'The Lancet',
      year: '2023',
      impact: 'High',
      bookmarked: false,
      tags: ['Microbiology', 'Resistance', 'Clinical']
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderBooks = () => (
    <div className="space-y-4">
      {books.map((book) => (
        <div key={book.id} className={`p-4 rounded-lg border ${
          theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {book.title}
                </h3>
                {book.bookmarked && (
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                )}
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {book.author} • {book.category}
              </p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Last opened: {book.lastOpened}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs ${
                book.type === 'PDF' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
              }`}>
                {book.type}
              </span>
              <ExternalLink className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Progress
              </span>
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {book.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${book.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderClinicalCases = () => (
    <div className="space-y-4">
      {clinicalCases.map((case_) => (
        <div key={case_.id} className={`p-4 rounded-lg border ${
          theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {case_.title}
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {case_.source} • {case_.specialty}
              </p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Added: {case_.dateAdded}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(case_.difficulty)}`}>
                {case_.difficulty}
              </span>
              <div className={`w-4 h-4 rounded border-2 ${
                case_.studied 
                  ? 'bg-green-500 border-green-500' 
                  : theme === 'dark' 
                  ? 'border-gray-600' 
                  : 'border-gray-300'
              }`}>
                {case_.studied && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <button className={`text-sm px-3 py-1 rounded-md ${
              theme === 'dark' 
                ? 'text-blue-400 hover:bg-blue-900/20' 
                : 'text-blue-600 hover:bg-blue-50'
            }`}>
              Read Case
            </button>
            {case_.studied && (
              <button className={`text-sm px-3 py-1 rounded-md ${
                theme === 'dark' 
                  ? 'text-green-400 hover:bg-green-900/20' 
                  : 'text-green-600 hover:bg-green-50'
              }`}>
                Quiz Me
              </button>
            )}
          </div>
        </div>
      ))}
      
      <div className={`p-6 rounded-lg border-2 border-dashed ${
        theme === 'dark' 
          ? 'border-gray-600 bg-gray-800/50' 
          : 'border-gray-300 bg-gray-50'
      } text-center`}>
        <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          5 cases studied. Ready for quiz generation!
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Generate Quiz from Cases
        </button>
      </div>
    </div>
  );

  const renderResearchPapers = () => (
    <div className="space-y-4">
      {researchPapers.map((paper) => (
        <div key={paper.id} className={`p-4 rounded-lg border ${
          theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {paper.title}
                </h3>
                {paper.bookmarked && (
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                )}
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {paper.journal} • {paper.year}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                {paper.tags.map((tag, index) => (
                  <span key={index} className={`px-2 py-1 rounded-full text-xs ${
                    theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs ${
                paper.impact === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {paper.impact} Impact
              </span>
              <ExternalLink className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          References
        </h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search references..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1">
        {[
          { id: 'books', label: 'Books & PDFs', icon: BookOpen },
          { id: 'cases', label: 'Clinical Cases', icon: FileText },
          { id: 'research', label: 'Research Papers', icon: ExternalLink }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              activeTab === id
                ? 'bg-blue-600 text-white'
                : theme === 'dark'
                ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={cardClass}>
        {activeTab === 'books' && renderBooks()}
        {activeTab === 'cases' && renderClinicalCases()}
        {activeTab === 'research' && renderResearchPapers()}
      </div>
    </div>
  );
};

export default References;