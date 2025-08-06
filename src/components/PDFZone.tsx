import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Eye, Download, Bookmark, X } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { storage } from '../utils/storage';
import { PDFFile } from '../types';
import { v4 as uuidv4 } from 'uuid';

const PDFZone: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<PDFFile[]>(() => storage.getPDFs());

  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type === 'application/pdf') {
          const newPDF: PDFFile = {
            id: uuidv4(),
            name: file.name,
            size: formatFileSize(file.size),
            pages: Math.floor(Math.random() * 1000) + 100, // Placeholder
            progress: 0,
            lastRead: 'Never',
            uploadDate: new Date().toISOString()
          };
          
          storage.addPDF(newPDF);
        }
      });
      setUploadedFiles(storage.getPDFs());
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDeletePDF = (id: string) => {
    storage.deletePDF(id);
    setUploadedFiles(storage.getPDFs());
  };

  const getKaiComment = (pages: number) => {
    if (pages > 1000) {
      return "Time of death: Social life.";
    } else if (pages > 500) {
      return "That's a chunky one. Better stock up on coffee.";
    } else {
      return "Manageable size. You might actually finish this one.";
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-terminal">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-pixel mb-4 terminal-glow">PDF ZONE</h1>
          <p className="text-lg opacity-75">Document processing unit</p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div
            className={`border-2 border-dashed p-12 text-center transition-all duration-300 ${
              dragOver 
                ? 'border-amber-400 bg-amber-400 bg-opacity-10' 
                : 'border-green-400 hover:border-amber-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-pixel mb-2">UPLOAD MEDICAL TEXTS</h3>
            <p className="text-base opacity-75 mb-4">
              Drag and drop your PDF files here, or click to browse
            </p>
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              id="pdf-upload"
            />
            <label htmlFor="pdf-upload" className="cursor-pointer">
              <div className="border border-green-400 px-6 py-2 hover:bg-green-400 hover:text-black transition-colors inline-block">
                SELECT FILES
              </div>
            </label>
            <div className="text-xs opacity-50 mt-4">
              Supported formats: PDF | Max size: 5GB per file
            </div>
          </div>
        </motion.div>

        {/* File List */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-pixel mb-4">YOUR MEDICAL LIBRARY</h2>
          
          {uploadedFiles.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-green-400 p-4 hover:border-amber-400 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <FileText className="w-8 h-8 text-blue-400" />
                  <div>
                    <h3 className="text-lg font-pixel">{file.name}</h3>
                    <div className="text-sm opacity-75">
                      {file.size} • {file.pages} pages • Last read: {file.lastRead}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm opacity-75">Progress</div>
                    <div className="text-lg font-pixel text-amber-400">{file.progress}%</div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="border border-blue-400 p-2 hover:bg-blue-400 hover:text-black transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="border border-purple-400 p-2 hover:bg-purple-400 hover:text-black transition-colors">
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button className="border border-green-400 p-2 hover:bg-green-400 hover:text-black transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeletePDF(file.id)}
                      className="border border-red-400 p-2 hover:bg-red-400 hover:text-black transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-800 h-2">
                  <div 
                    className="bg-amber-400 h-2 transition-all duration-300"
                    style={{ width: `${file.progress}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Kai Comment */}
              <div className="mt-2 text-xs opacity-50">
                <span className="text-blue-400">KAI:</span> {getKaiComment(file.pages)}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Reader Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="border border-green-400 p-6">
            <h3 className="text-lg font-pixel mb-3 text-green-400">CRT READER</h3>
            <p className="text-sm opacity-75 mb-4">
              Retro-styled PDF reader with terminal aesthetics and eye-friendly display options.
            </p>
            <ul className="text-xs space-y-1 opacity-50">
              <li>• Green phosphor mode</li>
              <li>• Adjustable scan lines</li>
              <li>• Night vision friendly</li>
            </ul>
          </div>
          
          <div className="border border-amber-400 p-6">
            <h3 className="text-lg font-pixel mb-3 text-amber-400">SMART HIGHLIGHTS</h3>
            <p className="text-sm opacity-75 mb-4">
              AI-powered highlighting that automatically converts important text to flashcards.
            </p>
            <ul className="text-xs space-y-1 opacity-50">
              <li>• Auto-extract key concepts</li>
              <li>• Tag system integration</li>
              <li>• Spaced repetition ready</li>
            </ul>
          </div>
          
          <div className="border border-blue-400 p-6">
            <h3 className="text-lg font-pixel mb-3 text-blue-400">PROGRESS TRACKING</h3>
            <p className="text-sm opacity-75 mb-4">
              Monitor your reading progress with detailed analytics and study time tracking.
            </p>
            <ul className="text-xs space-y-1 opacity-50">
              <li>• Reading speed analysis</li>
              <li>• Chapter completion</li>
              <li>• Study session logs</li>
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center space-x-4">
          <button className="flex items-center space-x-2 border border-green-400 px-6 py-3 hover:bg-green-400 hover:text-black transition-colors">
            <FileText className="w-5 h-5" />
            <span>OPEN READER</span>
          </button>
          <button className="flex items-center space-x-2 border border-amber-400 px-6 py-3 hover:bg-amber-400 hover:text-black transition-colors">
            <Bookmark className="w-5 h-5" />
            <span>VIEW BOOKMARKS</span>
          </button>
          <button className="flex items-center space-x-2 border border-blue-400 px-6 py-3 hover:bg-blue-400 hover:text-black transition-colors">
            <Download className="w-5 h-5" />
            <span>EXPORT NOTES</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">
          <div className="border border-green-400 p-4 text-center">
            <div className="text-2xl font-pixel">{uploadedFiles.length}</div>
            <div className="text-sm opacity-75">TOTAL BOOKS</div>
          </div>
          <div className="border border-amber-400 p-4 text-center">
            <div className="text-2xl font-pixel text-amber-400">
              {Math.round(uploadedFiles.reduce((acc, file) => acc + file.progress, 0) / uploadedFiles.length)}%
            </div>
            <div className="text-sm opacity-75">AVG PROGRESS</div>
          </div>
          <div className="border border-blue-400 p-4 text-center">
            <div className="text-2xl font-pixel text-blue-400">247</div>
            <div className="text-sm opacity-75">BOOKMARKS</div>
          </div>
          <div className="border border-purple-400 p-4 text-center">
            <div className="text-2xl font-pixel text-purple-400">89h</div>
            <div className="text-sm opacity-75">READING TIME</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PDFZone;