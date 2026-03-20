import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MicrophoneButton } from '../voice/MicrophoneButton';
import { Bot, User } from 'lucide-react';

export const ConversationPanel = ({ 
  conversationHistory, 
  isListening, 
  isGenerating,
  confidence, 
  error,
  interimTranscript, 
  onToggleMic,
  onReset,
  onStopSpeaking
}) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversationHistory, interimTranscript]);

  return (
    <div className="flex-1 flex flex-col bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden relative">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white/50">
        <h2 className="text-xl font-bold text-gray-800">Conversation</h2>
        <div className="flex gap-2">
          <button 
            onClick={onStopSpeaking}
            className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-lg text-sm font-semibold transition-colors"
          >
            Mute AI
          </button>
          <button 
            onClick={onReset}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-sm font-semibold transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Scrollable History */}
      <div 
        ref={scrollRef}
        className="flex-1 p-6 overflow-y-auto space-y-4 scroll-smooth"
      >
        <AnimatePresence>
          {conversationHistory.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`flex items-start gap-2 max-w-[85%] ${msg.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'assistant' ? 'bg-indigo-600' : 'bg-purple-600'
                }`}>
                  {msg.role === 'assistant' ? <Bot size={18} className="text-white" /> : <User size={18} className="text-white" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'assistant' 
                    ? 'bg-indigo-50 text-indigo-900 rounded-tl-none' 
                    : 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                }`}>
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-2xl rounded-tl-none border border-indigo-100">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
              <span className="text-xs text-indigo-400 ml-1 font-medium">Assistant is thinking...</span>
            </div>
          </motion.div>
        )}
        {isListening && interimTranscript && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-end pr-10"
          >
            <div className="bg-indigo-50 text-indigo-400 text-xs italic p-3 rounded-2xl rounded-tr-none border border-indigo-100 shadow-sm transition-all">
              {interimTranscript}...
            </div>
          </motion.div>
        )}
      </div>

      {/* Mic Area */}
      <div className="p-8 bg-gradient-to-t from-white to-transparent flex flex-col items-center gap-4">
        <MicrophoneButton 
          isListening={isListening} 
          onClick={onToggleMic} 
          confidence={confidence}
        />
        <div className="text-xs font-medium">
          {error ? (
            <span className="text-red-500 animate-pulse">⚠️ {error}</span>
          ) : isListening ? (
            <span className="text-indigo-600 animate-pulse">Listening to your voice...</span>
          ) : (
            <span className="text-gray-400">Click microphone to speak</span>
          )}
        </div>
      </div>
    </div>
  );
};
