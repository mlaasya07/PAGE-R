export interface CalendarEvent {
  id: string;
  title: string;
  type: 'exam' | 'community-visit' | 'reference' | 'birthday';
  examType?: 'final' | 'pre-final' | 'mock' | 'lab';
  difficulty?: 'easy' | 'medium' | 'hard';
  date: string;
  time: string;
  notes?: string;
  tags?: string[];
  attachments?: File[];
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: number;
  note?: string;
  timestamp: number;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  mood: string;
  isPrivate: boolean;
  timestamp: number;
}

export interface PDFFile {
  id: string;
  name: string;
  size: string;
  pages: number;
  progress: number;
  lastRead: string;
  uploadDate: string;
}