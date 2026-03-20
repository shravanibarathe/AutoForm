import { useState, useCallback } from 'react';
import ollama from '../services/ollamaService';

export const useConversationFlow = () => {
  const [currentField, setCurrentField] = useState('name');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [askedFields, setAskedFields] = useState(new Set());
  const [isGenerating, setIsGenerating] = useState(false);

  const questions = {
    name: "Hi! I'm your recruitment assistant. What's your full name?",
    email: "Great! What's your email address?",
    phone: "And your phone number?",
    currentPosition: "What's your current job position?",
    experience: "How many years of experience do you have?",
    skills: "Tell me about your technical skills.",
    education: "What's your educational qualification?",
    desiredPosition: "Which position are you applying for?",
    salary: "What's your expected salary in LPA?",
    noticePeriod: "What's your notice period?",
    confirm: "Perfect! Let me confirm all your details before submission."
  };

  const fieldOrder = [
    'name', 'email', 'phone', 'currentPosition', 
    'experience', 'skills', 'education', 
    'desiredPosition', 'salary', 'noticePeriod'
  ];

  const addMessage = useCallback((role, text) => {
    setConversationHistory(prev => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return [...prev, { role, text, id, timestamp: Date.now() }];
    });
  }, []);

  const generateAIResponse = async (field, filledFields) => {
    setIsGenerating(true);
    const systemPrompt = `You are a professional recruitment assistant. Collect data for a job application.
    Current target: ${field}.
    Data collected so far: ${JSON.stringify(filledFields)}.
    RULES:
    1. ONLY output the question/response. 
    2. DO NOT say "Here is a question" or "I am asking".
    3. Be brief (max 10 words).
    4. Speak in English (India) style.`;

    const prompt = `Ask for the user's ${field}. If they just provided other info, acknowledge it with "Got it" or "Noted".`;
    
    const response = await ollama.generateResponse(prompt, systemPrompt);
    setIsGenerating(false);
    
    if (response) {
      addMessage('assistant', response);
    } else {
      // Fallback to static question
      addMessage('assistant', questions[field]);
    }
  };

  const askNextQuestion = useCallback(async (filledFields) => {
    for (let field of fieldOrder) {
      if (!filledFields[field]) {
        setCurrentField(field);
        setAskedFields(prev => new Set([...prev, field]));
        return field;
      }
    }
    
    if (Object.keys(filledFields).length >= fieldOrder.length) {
      setCurrentField('confirm');
      return 'confirm';
    }
    
    return null;
  }, [askedFields]);

  const resetConversation = useCallback(() => {
    setConversationHistory([]);
    setAskedFields(new Set());
    setCurrentField('name');
  }, []);

  return {
    currentField,
    conversationHistory,
    isGenerating,
    setIsGenerating, // Expose this
    askNextQuestion,
    addMessage,
    resetConversation,
    setCurrentField, // Expose this
    setAskedFields   // Expose this
  };
};
