import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ConversationPanel } from './components/layout/ConversationPanel';
import { FormPanel } from './components/layout/FormPanel';
import { SplitLayout } from './components/layout/SplitLayout';
import { useVoiceRecognition } from './hooks/useVoiceRecognition';
import { useConversationFlow } from './hooks/useConversationFlow';
import { useWebSocket } from './hooks/useWebSocket';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import brainService from './services/brainService';

function App() {
  const [formData, setFormData] = useState({});
  const formDataRef = useRef({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Sync ref with state
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  const { 
    currentField, 
    conversationHistory, 
    isGenerating,
    setIsGenerating,
    askNextQuestion, 
    addMessage,
    resetConversation
  } = useConversationFlow();
  
  const { wsStatus, sendMessage } = useWebSocket('wss://echo.websocket.org');
  
  // 1. Define Submit (No dependencies on voice/brain)
  const sendFormUpdate = useCallback((data) => {
    sendMessage(JSON.stringify({ type: 'update', data }));
  }, [sendMessage]);

  const handleSubmit = useCallback((finalData = formDataRef.current) => {
    addMessage('assistant', '📤 Submitting your application...');
    sendMessage(JSON.stringify({ type: 'submit', data: finalData }));
    
    setTimeout(() => {
      addMessage('assistant', '✅ Application submitted successfully!');
      alert("Application Submitted Successfully!");
    }, 1000);
  }, [addMessage, sendMessage]);

  const processTranscript = useCallback(async (text, confidence) => {
    if (!text || text.trim().length < 2) return;

    console.log(`[Transcript] Text: "${text}", Confidence: ${confidence.toFixed(2)}`);
    addMessage('user', text);
    setIsGenerating(true);
    
    try {
      const result = await brainService.processTurn(text, formDataRef.current, currentField);
      
      if (result) {
        if (result.extracted && Object.keys(result.extracted).length > 0) {
          const newData = { ...formDataRef.current, ...result.extracted };
          setFormData(newData);
          sendFormUpdate(result.extracted);
        }
        
        if (result.reply) {
          addMessage('assistant', result.reply);
        }
        
        if (result.shouldSubmit) {
          handleSubmit();
        } else {
          await askNextQuestion(formDataRef.current);
        }
      }
    } catch (e) {
      console.error('[App] Brain error:', e);
      addMessage('assistant', "I'm having a bit of trouble processing that. Could you say it again?");
    } finally {
      setIsGenerating(false);
    }
  }, [currentField, addMessage, handleSubmit, sendFormUpdate, setIsGenerating, askNextQuestion]);

  // 3. Setup Voice (Depends on processTranscript)
  const { isListening, interimTranscript, confidence, error, startListening, stopListening } = 
    useVoiceRecognition(processTranscript);

  const { speak, stop: stopSpeaking } = useSpeechSynthesis();

  // 4. Handle Voice/AI Coordination
  useEffect(() => {
    const lastMessage = conversationHistory[conversationHistory.length - 1];
    if (lastMessage && lastMessage.role === 'assistant') {
      const cleanText = lastMessage.text.replace(/[\u2700-\u27bf]|[\u2190-\u21ff]|[\u2600-\u26ff]|[\u2b05-\u2b05]|[\u2b07-\u2b07]|[\u2b06-\u2b06]|[\u2b05-\u2b05]|[\u2b07-\u2b07]|[\u2b06-\u2b06]|[\u2190-\u21ff]/g, '');
      
      stopListening();
      speak(cleanText, () => {
        console.log('[Coordination] Assistant finished speaking, restarting listener...');
        startListening();
      });
    }
  }, [conversationHistory, speak, startListening, stopListening]); // Removed isGenerating from deps to avoid early triggers

  useEffect(() => {
    if (isGenerating) {
      stopListening();
      // Safety timeout: reset generating state after 15 seconds if stuck
      const timeout = setTimeout(() => {
        setIsGenerating(false);
      }, 15000);
      return () => clearTimeout(timeout);
    }
  }, [isGenerating, stopListening, setIsGenerating]);

  // 4b. Watch for Voice Errors
  useEffect(() => {
    if (error) {
      addMessage('assistant', `⚠️ ${error}`);
    }
  }, [error, addMessage]);

  // 5. App Startup
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      addMessage('assistant', "Hi! I'm your recruitment assistant. Let's get started. What's your full name?");
    }
  }, [isInitialized, addMessage]);

  const handleReset = () => {
    setFormData({});
    resetConversation();
    setIsInitialized(false);
  };

  return (
    <SplitLayout>
        <ConversationPanel 
          conversationHistory={conversationHistory}
          isListening={isListening}
          isGenerating={isGenerating}
          confidence={confidence}
          error={error}
          interimTranscript={interimTranscript}
          onToggleMic={isListening ? stopListening : startListening}
          onReset={handleReset}
          onStopSpeaking={stopSpeaking}
        />
        
        <FormPanel 
          formData={formData}
          onChange={(field, val) => setFormData(prev => ({ ...prev, [field]: val }))}
          wsStatus={wsStatus}
          currentField={currentField}
          onSubmit={handleSubmit}
          isComplete={Object.keys(formData).length >= 10}
        />
    </SplitLayout>
  );
}

export default App;
