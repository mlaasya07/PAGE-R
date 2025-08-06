import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, ExternalLink, Upload, Search, Star, Filter, Eye, Trash2, Edit } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import UploadManager from './UploadManager';

interface Reference {
  id: string;
  title: string;
  author?: string;
  category: string;
  type: 'PDF' | 'Link' | 'Document';
  bookmarked: boolean;
  lastOpened?: string;
  progress?: number;
  url?: string;
  file?: File;
  tags?: string[];
  dateAdded: string;
  notes?: string;
}

const References: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('books');
  const [searchTerm, setSearchTerm] = useState('');
  const [references, setReferences] = useState<Reference[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [editingRef, setEditingRef] = useState<Reference | null>(null);
  const [showAddLink, setShowAddLink] = useState(false);

  const [linkForm, setLinkForm] = useState({
    title: '',
    author: '',
    url: '',
    category: '',
    tags: '',
    notes: ''
  });

  const cardClass = `${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`;

  useEffect(() => {
    const savedRefs = localStorage.getItem('references');
    if (savedRefs) {
      setReferences(JSON.parse(savedRefs));
    }
  }, []);

  const saveReferences = (newRefs: Reference[]) => {
    setReferences(newRefs);
    localStorage.setItem('references', JSON.stringify(newRefs));
  };

  const handleFilesUploaded = (uploadedFiles: any[]) => {
    const newReferences: Reference[] = uploadedFiles.map(file => ({
      id: file.id,
      title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
      category: file.subject || 'General',
      type: 'PDF' as const,
      bookmarked: false,
      dateAdded: file.uploadDate,
      file: file.file,
      tags: file.tags
    }));

    saveReferences([...references, ...newReferences]);
    setShowUpload(false);
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newReference: Reference = {
      id: Date.now().toString(),
      title: linkForm.title,
      author: linkForm.author || undefined,
      category: linkForm.category || 'General',
      type: 'Link',
      bookmarked: false,
      url: linkForm.url,
      dateAdded: new Date().toISOString(),
      tags: linkForm.tags ? linkForm.tags.split(',').map(t => t.trim()) : undefined,
      notes: linkForm.notes || undefined
    };

    saveReferences([...references, newReference]);
    setLinkForm({ title: '', author: '', url: '', category: '', tags: '', notes: '' });
    setShowAddLink(false);
  };

  const toggleBookmark = (refId: string) => {
    saveReferences(references.map(ref => 
      ref.id === refId ? { ...ref, bookmarked: !ref.bookmarked } : ref
    ));
  };

  const deleteReference = (refId: string) => {
    if (confirm('Are you sure you want to delete this reference?')) {
      saveReferences(references.filter(ref => ref.id !== refId));
    }
  };

  const openReference = (ref: Reference) => {
    if (ref.type === 'Link' && ref.url) {
      window.open(ref.url, '_blank');
    } else if (ref.type === 'PDF' && ref.file) {
      const url = URL.createObjectURL(ref.file);
      window.open(url, '_blank');
    }
    
    // Update last opened
    saveReferences(references.map(r => 
      r.id === ref.id ? { ...r, lastOpened: new Date().toISOString() } : r
    ));
  };

  const filteredReferences = references.filter(ref => {
    const matchesSearch = ref.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ref.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ref.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'books' && ref.type === 'PDF') ||
                      (activeTab === 'links' && ref.type === 'Link') ||
                      (activeTab === 'bookmarked' && ref.bookmarked);
    
    return matchesSearch && matchesTab;
  });

  if (references.length === 0 && !showUpload && !showAddLink) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            References
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAddLink(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Add Link</span>
            </button>
            <button
              onClick={() => setShowUpload(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Files</span>
            </button>
          </div>
        </div>

        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <BookOpen className={`h-16 w-16 mx-auto ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              No references added yet
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} max-w-md mx-auto`}>
              Start building your reference library by uploading PDFs, adding links to research papers, or importing your study materials.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setShowUpload(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload Your First Document
              </button>
              <button
                onClick={() => setShowAddLink(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Reference Link
              </button>
            </div>
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
          <button
            onClick={() => setShowAddLink(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Add Link</span>
          </button>
          <button
            onClick={() => setShowUpload(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* Upload Manager */}
      {showUpload && (
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Upload References
            </h3>
            <button
              onClick={() => setShowUpload(false)}
              className={`text-gray-500 hover:text-gray-700 ${theme === 'dark' ? 'hover:text-gray-300' : ''}`}
            >
              Cancel
            </button>
          </div>
          <UploadManager 
            onFilesUploaded={handleFilesUploaded}
            category="references"
            maxFiles={10}
          />
        </div>
      )}

      {/* Add Link Form */}
      {showAddLink && (
        <div className={cardClass}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Add Reference Link
          </h3>
          <form onSubmit={handleAddLink} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={linkForm.title}
                  onChange={(e) => setLinkForm({...linkForm, title: e.target.value})}
                  className={`w-full px-3 py-2 rounded-md border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="e.g., COVID-19 Treatment Guidelines"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Author/Source
                </label>
                <input
                  type="text"
                  value={linkForm.author}
                  onChange={(e) => setLinkForm({...linkForm, author: e.target.value})}
                  className={`w-full px-3 py-2 rounded-md border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="e.g., WHO, NEJM, PubMed"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                URL *
              </label>
              <input
                type="url"
                required
                value={linkForm.url}
                onChange={(e) => setLinkForm({...linkForm, url: e.target.value})}
                className={`w-full px-3 py-2 rounded-md border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Category
                </label>
                <input
                  type="text"
                  value={linkForm.category}
                  onChange={(e) => setLinkForm({...linkForm, category: e.target.value})}
                  className={`w-full px-3 py-2 rounded-md border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="e.g., Medicine, Surgery, Guidelines"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={linkForm.tags}
                  onChange={(e) => setLinkForm({...linkForm, tags: e.target.value})}
                  className={`w-full px-3 py-2 rounded-md border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="e.g., Important, Review, Exam"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Notes
              </label>
              <textarea
                value={linkForm.notes}
                onChange={(e) => setLinkForm({...linkForm, notes: e.target.value})}
                className={`w-full px-3 py-2 rounded-md border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                rows={3}
                placeholder="Additional notes about this reference..."
              />
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Reference
              </button>
              <button
                type="button"
                onClick={() => setShowAddLink(false)}
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

      {/* Tab Navigation */}
      <div className="flex space-x-1">
        {[
          { id: 'all', label: 'All References', icon: BookOpen },
          { id: 'books', label: 'Books & PDFs', icon: FileText },
          { id: 'links', label: 'Links', icon: ExternalLink },
          { id: 'bookmarked', label: 'Bookmarked', icon: Star }
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

      {/* References List */}
      <div className={cardClass}>
        {filteredReferences.length === 0 ? (
          <div className="text-center py-8">
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {searchTerm ? 'No references match your search.' : 'No references in this category yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReferences.map((ref) => (
              <div key={ref.id} className={`p-4 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {ref.title}
                      </h3>
                      {ref.bookmarked && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    {ref.author && (
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {ref.author} • {ref.category}
                      </p>
                    )}
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                      Added: {new Date(ref.dateAdded).toLocaleDateString()}
                      {ref.lastOpened && ` • Last opened: ${new Date(ref.lastOpened).toLocaleDateString()}`}
                    </p>
                    {ref.tags && (
                      <div className="flex items-center space-x-2 mt-2">
                        {ref.tags.map((tag, index) => (
                          <span key={index} className={`px-2 py-1 rounded-full text-xs ${
                            theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      ref.type === 'PDF' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {ref.type}
                    </span>
                    <button
                      onClick={() => openReference(ref)}
                      className={`p-2 rounded ${
                        theme === 'dark' 
                          ? 'text-gray-400 hover:text-white hover:bg-gray-600' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                      }`}
                      title="Open reference"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toggleBookmark(ref.id)}
                      className={`p-2 rounded ${
                        ref.bookmarked 
                          ? 'text-yellow-500 hover:text-yellow-600' 
                          : theme === 'dark' 
                          ? 'text-gray-400 hover:text-yellow-500 hover:bg-gray-600' 
                          : 'text-gray-600 hover:text-yellow-500 hover:bg-gray-200'
                      }`}
                      title={ref.bookmarked ? 'Remove bookmark' : 'Add bookmark'}
                    >
                      <Star className={`h-4 w-4 ${ref.bookmarked ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => deleteReference(ref.id)}
                      className={`p-2 rounded ${
                        theme === 'dark' 
                          ? 'text-gray-400 hover:text-red-400 hover:bg-gray-600' 
                          : 'text-gray-600 hover:text-red-600 hover:bg-gray-200'
                      }`}
                      title="Delete reference"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {ref.notes && (
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {ref.notes}
                  </p>
                )}
                
                {ref.progress && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        Progress
                      </span>
                      <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                        {ref.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${ref.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default References;