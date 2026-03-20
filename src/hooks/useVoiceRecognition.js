import { useState, useEffect, useRef, useCallback } from 'react';

export const useVoiceRecognition = (onTranscript) => {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const callbackRef = useRef(onTranscript);

  // Keep callback ref updated to avoid stale closures
  useEffect(() => {
    callbackRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      if (recognitionRef.current) {
        recognitionRef.current.isActuallyRunning = true;
      }
    };
    
    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          const final = result[0].transcript.trim();
          setConfidence(result[0].confidence);
          if (callbackRef.current) {
            callbackRef.current(final, result[0].confidence);
          }
          setInterimTranscript(''); // Clear interim on final
        } else {
          interim += result[0].transcript;
        }
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (e) => {
      console.error('Speech error:', e.error);
      let errorMsg = e.error;
      if (e.error === 'not-allowed') errorMsg = 'Microphone access denied. Please check site permissions.';
      if (e.error === 'no-speech') errorMsg = 'No speech detected. Is the microphone working?';
      if (e.error === 'audio-capture') errorMsg = 'Audio capture failed. Check your Bluetooth connection or default mic.';
      
      setError(errorMsg);
      setIsListening(false);
      if (recognitionRef.current) {
        recognitionRef.current.isActuallyRunning = false;
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
      if (recognitionRef.current) {
        recognitionRef.current.isActuallyRunning = false;
        // Auto-restart if session is still supposed to be active (and no terminal error)
        if (recognitionRef.current.isSessionActive && !['not-allowed', 'audio-capture'].includes(error)) {
          try { 
            recognitionRef.current.start(); 
          } catch (err) {
            console.warn('Auto-restart failed:', err);
          }
        }
      }
    };

    recognitionRef.current = recognition;
    recognitionRef.current.isSessionActive = false;
    recognitionRef.current.isActuallyRunning = false; // Initialize the new state

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.isSessionActive = false;
        recognitionRef.current.isActuallyRunning = false;
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    if (recognitionRef.current.isActuallyRunning) {
      console.log('[Voice] Already running, skipping start.');
      return;
    }
    
    setError(null);
    recognitionRef.current.isSessionActive = true;
    
    const tryStart = (retryCount = 0) => {
      try {
        recognitionRef.current.start();
        console.log('[Voice] Started successfully');
      } catch (e) {
        if (e.name === 'InvalidStateError' && retryCount < 5) {
          console.warn(`[Voice] Engine busy, retrying start (${retryCount + 1}/5)...`);
          setTimeout(() => tryStart(retryCount + 1), 200);
        } else {
          console.error('[Voice] Start failed:', e);
        }
      }
    };

    tryStart();
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.isSessionActive = false;
    
    if (!recognitionRef.current.isActuallyRunning) {
      console.log('[Voice] Already stopped, skipping stop call.');
      return;
    }

    try {
      recognitionRef.current.stop();
      console.log('[Voice] Stop triggered');
    } catch (e) {
      console.error('[Voice] Stop failed:', e);
    }
  }, []);

  return { isListening, interimTranscript, confidence, error, startListening, stopListening };
};
