import { CalendarEvent, MoodEntry, JournalEntry, PDFFile } from '../types';

const STORAGE_KEYS = {
  EVENTS: 'page-r-events',
  MOODS: 'page-r-moods',
  JOURNAL: 'page-r-journal',
  PDFS: 'page-r-pdfs',
  FLASHCARDS: 'page-r-flashcards',
  STATS: 'page-r-stats'
};

export const storage = {
  // Calendar Events
  getEvents: (): CalendarEvent[] => {
    const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return data ? JSON.parse(data) : [];
  },
  
  saveEvents: (events: CalendarEvent[]) => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  },
  
  addEvent: (event: CalendarEvent) => {
    const events = storage.getEvents();
    events.push(event);
    storage.saveEvents(events);
  },
  
  deleteEvent: (id: string) => {
    const events = storage.getEvents().filter(e => e.id !== id);
    storage.saveEvents(events);
  },

  // Mood Entries
  getMoods: (): MoodEntry[] => {
    const data = localStorage.getItem(STORAGE_KEYS.MOODS);
    return data ? JSON.parse(data) : [];
  },
  
  saveMoods: (moods: MoodEntry[]) => {
    localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(moods));
  },
  
  addMood: (mood: MoodEntry) => {
    const moods = storage.getMoods();
    moods.push(mood);
    storage.saveMoods(moods);
  },

  // Journal Entries
  getJournalEntries: (): JournalEntry[] => {
    const data = localStorage.getItem(STORAGE_KEYS.JOURNAL);
    return data ? JSON.parse(data).map((entry: any) => ({
      ...entry,
      date: new Date(entry.date)
    })) : [];
  },
  
  saveJournalEntries: (entries: JournalEntry[]) => {
    localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(entries));
  },
  
  addJournalEntry: (entry: JournalEntry) => {
    const entries = storage.getJournalEntries();
    entries.push(entry);
    storage.saveJournalEntries(entries);
  },
  
  deleteJournalEntry: (id: string) => {
    const entries = storage.getJournalEntries().filter(e => e.id !== id);
    storage.saveJournalEntries(entries);
  },

  // PDF Files
  getPDFs: (): PDFFile[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PDFS);
    return data ? JSON.parse(data) : [];
  },
  
  savePDFs: (pdfs: PDFFile[]) => {
    localStorage.setItem(STORAGE_KEYS.PDFS, JSON.stringify(pdfs));
  },
  
  addPDF: (pdf: PDFFile) => {
    const pdfs = storage.getPDFs();
    pdfs.push(pdf);
    storage.savePDFs(pdfs);
  },
  
  deletePDF: (id: string) => {
    const pdfs = storage.getPDFs().filter(p => p.id !== id);
    storage.savePDFs(pdfs);
  }
};