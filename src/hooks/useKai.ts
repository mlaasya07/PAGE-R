import { useState, useCallback, useRef } from 'react';
import { localKai } from '../api/kai';
import { whisperAPI } from '../api/whisper';
import { useCodeStatus } from './useCodeStatus';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isVoice?: boolean;
}

export const useKai = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const { codeStatus } = useCodeStatus();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const sendMessage = useCallback(async (text: string, isVoice = false) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
      isVoice
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await localKai.sendMessage({
        message: text,
        codeStatus,
        context: getCurrentContext()
      });

      const kaiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, kaiMessage]);
    } catch (error) {
      console.error('Kai response error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Something's off with my local connection. Check if Ollama is running?",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [codeStatus]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await transcribeAndSend(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
      alert('Microphone access denied or not available');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const transcribeAndSend = useCallback(async (audioBlob: Blob) => {
    setIsTranscribing(true);
    try {
      const transcription = await whisperAPI.transcribeAudio(audioBlob);
      if (transcription) {
        await sendMessage(transcription, true);
      }
    } catch (error) {
      console.error('Transcription error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "Voice transcription failed. Make sure whisper.cpp is running locally.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTranscribing(false);
    }
  }, [sendMessage]);

  const getCurrentContext = useCallback(() => {
    const currentPage = window.location.pathname;
    const pageContext = {
      '/': 'Dashboard',
      '/quizzes': 'Quizzes',
      '/flashcards': 'Flashcards',
      '/references': 'References',
      '/tracker': 'Academic Tracker',
      '/calendar': 'Calendar',
      '/profile': 'Profile'
    };
    
    return pageContext[currentPage as keyof typeof pageContext] || 'Unknown page';
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([]);
    localKai.clearHistory();
  }, []);

  return {
    messages,
    isLoading,
    isRecording,
    isTranscribing,
    sendMessage,
    startRecording,
    stopRecording,
    clearHistory
  };
};