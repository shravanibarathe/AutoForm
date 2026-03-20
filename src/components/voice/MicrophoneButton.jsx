import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

export const MicrophoneButton = ({ isListening, onClick, confidence, error }) => {
  return (
    <div className="relative group">
      {/* Glow Effect */}
      {isListening && (
        <motion.div
          className="absolute inset-0 bg-red-400 rounded-full blur-xl opacity-40"
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}
      
      <motion.button
        onClick={onClick}
        className={`relative w-24 h-24 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          error
            ? 'bg-gradient-to-br from-red-600 to-red-800'
            : isListening 
              ? 'bg-gradient-to-br from-red-500 to-pink-600' 
              : 'bg-gradient-to-br from-indigo-500 to-purple-600'
        }`}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
      >
        {error ? (
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 0.5 }}>
            <MicOff size={40} className="text-white" />
          </motion.div>
        ) : isListening ? (
          <MicOff size={40} className="text-white" />
        ) : (
          <Mic size={40} className="text-white" />
        )}
      </motion.button>
      
      {/* Confidence Label */}
      {isListening && confidence > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Confidence</span>
            <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
               <motion.div 
                className="h-full bg-green-500"
                animate={{ width: `${confidence * 100}%` }}
               />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
