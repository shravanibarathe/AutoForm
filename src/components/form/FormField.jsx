import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export const FormField = ({ label, value, isCurrent, isFilled, onChange, type = "text", ...props }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isCurrent && inputRef.current) {
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isCurrent]);

  return (
    <motion.div
      layout
      className={`relative p-4 rounded-xl transition-all duration-500 border ${
        isCurrent 
          ? 'bg-indigo-50/50 border-indigo-200 ring-4 ring-indigo-50 shadow-sm' 
          : 'bg-white border-transparent'
      }`}
    >
      <div className="flex justify-between items-center mb-1.5">
        <label className={`text-xs font-bold uppercase tracking-wider transition-colors ${
          isCurrent ? 'text-indigo-600' : 'text-gray-400'
        }`}>
          {label}
        </label>
        <AnimatePresence>
          {isFilled && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <CheckCircle2 size={16} className="text-green-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <input
        ref={inputRef}
        type={type}
        value={value || ''}
        readOnly // Prevent manual input for this voice-first demo, but can be removed
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-transparent text-sm font-medium focus:outline-none transition-colors border-b-2 py-1 ${
          isCurrent ? 'border-indigo-400 text-indigo-900' : 'border-gray-100 text-gray-700'
        } ${isFilled && !isCurrent ? 'text-green-700' : ''}`}
        {...props}
      />

      {isCurrent && (
        <motion.div 
          layoutId="active-indicator"
          className="absolute left-0 bottom-0 w-1 h-1/2 bg-indigo-600 rounded-r-full"
        />
      )}
    </motion.div>
  );
};
