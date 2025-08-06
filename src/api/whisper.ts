// Whisper.cpp integration for voice transcription
interface WhisperResponse {
  text: string;
  confidence?: number;
}

export class WhisperAPI {
  private whisperEndpoint = 'http://localhost:8080'; // Default whisper.cpp server port

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');
      formData.append('model', 'base'); // or 'small', 'medium', 'large'
      formData.append('language', 'en');
      formData.append('response_format', 'json');

      const response = await fetch(`${this.whisperEndpoint}/inference`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Whisper API error: ${response.status}`);
      }

      const data: WhisperResponse = await response.json();
      return data.text.trim();
    } catch (error) {
      console.error('Whisper transcription error:', error);
      throw new Error('Voice transcription failed. Make sure whisper.cpp server is running on localhost:8080');
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.whisperEndpoint}/health`, {
        method: 'GET',
        timeout: 2000
      } as RequestInit);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const whisperAPI = new WhisperAPI();