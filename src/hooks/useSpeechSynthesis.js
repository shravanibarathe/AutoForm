import { useCallback, useRef, useState } from 'react';

export const useSpeechSynthesis = () => {
  const synthRef = useRef(window.speechSynthesis);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text, onEnd) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'en-IN';

    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => 
      (v.lang === 'en-IN' || v.name.includes('India')) && 
      (v.name.includes('Google') || v.name.includes('Female'))
    ) || voices.find(v => v.lang === 'en-IN') || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    };
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return { speak, stop, isSpeaking };
};
