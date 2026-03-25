import { useCallback, useRef, useState } from 'react';
import cartesia from '../services/cartesiaService';

export const useSpeechSynthesis = () => {
  const audioRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Stop any currently playing audio
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback(async (text, onEnd) => {
    if (!text) return;

    // Stop previous if still playing
    stop();

    setIsSpeaking(true);
    console.log('[TTS] Fetching humanized voice from Cartesia...');
    
    try {
      const audioBlob = await cartesia.textToSpeech(text);
      if (!audioBlob) {
        console.error('[TTS] Failed to get audio from Cartesia. Falling back to browser voice.');
        // Fallback to browser voice logic if needed? 
        // For now just stop.
        setIsSpeaking(false);
        return;
      }

      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
        if (onEnd) onEnd();
      };

      audio.onerror = (e) => {
        console.error('[TTS] Audio playback error:', e);
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
      };

      await audio.play();
    } catch (e) {
      console.error('[TTS] Playback/Fetch Error:', e);
      setIsSpeaking(false);
    }
  }, [stop]);

  return { speak, stop, isSpeaking };
};
