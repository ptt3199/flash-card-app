import { useState, useCallback } from 'react';

export function useSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported] = useState(() => {
    return 'speechSynthesis' in window;
  });

  const speak = useCallback(async (text: string, audioUrl?: string) => {
    if (isPlaying) return;

    setIsPlaying(true);

    try {
      // Try to play audio URL first if available
      if (audioUrl) {
        await playAudioUrl(audioUrl);
        return;
      }

      // Fallback to Speech Synthesis API
      if (isSupported && text) {
        await speakWithSynthesis(text);
      }
    } catch (error) {
      console.error('Speech playback error:', error);
    } finally {
      setIsPlaying(false);
    }
  }, [isPlaying, isSupported]);

  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }, [isSupported]);

  return {
    speak,
    stop,
    isPlaying,
    isSupported,
  };
}

// Helper function to play audio from URL
function playAudioUrl(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    
    audio.onended = () => resolve();
    audio.onerror = () => reject(new Error('Audio playback failed'));
    
    audio.play().catch(reject);
  });
}

// Helper function to use Speech Synthesis API
function speakWithSynthesis(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Try to use English voice
    const voices = speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => 
      voice.lang.startsWith('en') && voice.name.includes('English')
    ) || voices.find(voice => voice.lang.startsWith('en'));
    
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

    speechSynthesis.speak(utterance);
  });
} 