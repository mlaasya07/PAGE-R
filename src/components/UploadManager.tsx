import React, { useState, useRef } from 'react';
import { Upload, File, X, FileText, Image, BookOpen, Users, Search } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  category: 'books' | 'references' | 'research' | 'general';
  subject?: string;
  uploadDate: string;
  file: File;
  tags?: string[];
}

interface UploadManagerProps {
  onFilesUploaded?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  category?: 'books' | 'references' | 'research' | 'general';
}

const UploadManager: React.FC<UploadManagerProps> = ({ 
  onFilesUploaded, 
  maxFiles = 5, 
  category = 'general' 
}) => {
  const { theme } = useTheme();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [tags, setTags] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const subjects = [
    'Anatomy', 'Physiology', 'Biochemistry', 'Pathology', 'Pharmacology',
    'Microbiology', 'Forensic Medicine', 'Community Medicine', 'Medicine',
    'Surgery', 'Obstetrics & Gynecology', 'Pediatrics', 'Psychiatry',
    'Ophthalmology', 'ENT', 'Orthopedics', 'Anesthesia', 'Radiology'
  ];

  const acceptedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/png',
    'image/jpeg',
    'image/jpg'
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    if (uploadedFiles.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed per session`);
      return;
    }

    const validFiles = files.filter(file => 
      acceptedTypes.includes(file.type) && file.size <= 50 * 1024 * 1024 // 50MB limit
    );

    if (validFiles.length !== files.length) {
      alert('Some files were skipped. Only PDF, DOCX, PPTX, PNG, and JPG files under 50MB are allowed.');
    }

    const newUploadedFiles: UploadedFile[] = validFiles.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      category: selectedCategory,
      subject: selectedSubject || undefined,
      uploadDate: new Date().toISOString(),
      file,
      tags: tags ? tags.split(',').map(t => t.trim()) : undefined
    }));

    const updatedFiles = [...uploadedFiles, ...newUploadedFiles];
    setUploadedFiles(updatedFiles);
    
    if (onFilesUploaded) {
      onFilesUploaded(updatedFiles);
    }

    // Save to localStorage for persistence
    const fileData = updatedFiles.map(f => ({
      ...f,
      file: undefined // Don't store the actual file object
    }));
    localStorage.setItem('uploaded-files', JSON.stringify(fileData));
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter(f => f.id !== fileId);
    setUploadedFiles(updatedFiles);
    
    if (onFilesUploaded) {
      onFilesUploaded(updatedFiles);
    }

    const fileData = updatedFiles.map(f => ({
      ...f,
      file: undefined
    }));
    localStorage.setItem('uploaded-files', JSON.stringify(fileData));
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
    if (type.includes('word')) return <FileText className="h-8 w-8 text-blue-500" />;
    if (type.includes('presentation')) return <FileText className="h-8 w-8 text-orange-500" />;
    if (type.includes('image')) return <Image className="h-8 w-8 text-green-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'books': return <BookOpen className="h-4 w-4" />;
      case 'references': return <FileText className="h-4 w-4" />;
      case 'research': return <Search className="h-4 w-4" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className={`w-full px-3 py-2 rounded-md border ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="books">📚 Books & PDFs</option>
            <option value="references">📄 References</option>
            <option value="research">🔬 Research Papers</option>
            <option value="general">📁 General</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Subject (Optional)
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className={`w-full px-3 py-2 rounded-md border ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">Select subject...</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Tags (Optional)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., Important, Exam, Review"
            className={`w-full px-3 py-2 rounded-md border ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : theme === 'dark'
            ? 'border-gray-600 hover:border-gray-500'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <Upload className={`h-12 w-12 mx-auto mb-4 ${
          isDragging ? 'text-blue-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`} />
        
        <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {isDragging ? 'Drop files here' : 'Upload your study materials'}
        </h3>
        
        <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Drag and drop files here, or click to browse
        </p>
        
        <p className={`text-xs mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
          Supports: PDF, DOCX, PPTX, PNG, JPG (max 50MB each, {maxFiles} files per session)
        </p>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Choose Files
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.pptx,.png,.jpg,.jpeg"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
          {uploadedFiles.length}/{maxFiles} files uploaded
        </p>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Uploaded Files ({uploadedFiles.length})
          </h4>
          
          {uploadedFiles.map((file) => (
            <div key={file.id} className={`p-4 rounded-lg border ${
              theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div>
                    <h5 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {file.name}
                    </h5>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        {formatFileSize(file.size)}
                      </span>
                      <span className="text-gray-400">•</span>
                      <div className="flex items-center space-x-1">
                        {getCategoryIcon(file.category)}
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                          {file.category}
                        </span>
                      </div>
                      {file.subject && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                            {file.subject}
                          </span>
                        </>
                      )}
                    </div>
                    {file.tags && (
                      <div className="flex items-center space-x-1 mt-1">
                        {file.tags.map((tag, index) => (
                          <span key={index} className={`px-2 py-1 rounded-full text-xs ${
                            theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => removeFile(file.id)}
                  className={`p-2 rounded-full ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-red-400 hover:bg-gray-600' 
                      : 'text-gray-600 hover:text-red-600 hover:bg-gray-200'
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadManager;