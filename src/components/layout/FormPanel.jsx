import React from 'react';
import { motion } from 'framer-motion';
import { FormField } from '../form/FormField';
import { ProgressBar } from '../form/ProgressBar';
import { Wifi, WifiOff, Send } from 'lucide-react';

export const FormPanel = ({ 
  formData, 
  onChange, 
  wsStatus, 
  currentField, 
  onSubmit, 
  isComplete 
}) => {
  return (
    <div className="lg:w-[450px] bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-bottom bg-gray-50/50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-800 text-lg">Application Progress</h2>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            wsStatus === 'connected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {wsStatus === 'connected' ? <Wifi size={14} /> : <WifiOff size={14} />}
            {wsStatus.toUpperCase()}
          </div>
        </div>
        <ProgressBar progress={(Object.keys(formData).length / 10) * 100} />
      </div>

      {/* Fields */}
      <div className="flex-1 p-6 overflow-y-auto space-y-5">
        <FormField 
          label="Full Name" 
          value={formData.name} 
          isCurrent={currentField === 'name'} 
          isFilled={!!formData.name}
          onChange={(val) => onChange('name', val)}
          placeholder="e.g. John Doe"
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField 
            label="Email" 
            value={formData.email} 
            isCurrent={currentField === 'email'} 
            isFilled={!!formData.email}
            onChange={(val) => onChange('email', val)}
            placeholder="john@example.com"
          />
          <FormField 
            label="Phone" 
            value={formData.phone} 
            isCurrent={currentField === 'phone'} 
            isFilled={!!formData.phone}
            onChange={(val) => onChange('phone', val)}
            placeholder="+91..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField 
            label="Position" 
            value={formData.currentPosition} 
            isCurrent={currentField === 'currentPosition'} 
            isFilled={!!formData.currentPosition}
            onChange={(val) => onChange('currentPosition', val)}
          />
          <FormField 
            label="Experience (Yrs)" 
            type="number"
            value={formData.experience} 
            isCurrent={currentField === 'experience'} 
            isFilled={formData.experience !== undefined}
            onChange={(val) => onChange('experience', val)}
          />
        </div>
        <FormField 
          label="Skills" 
          value={Array.isArray(formData.skills) ? formData.skills.join(', ') : formData.skills} 
          isCurrent={currentField === 'skills'} 
          isFilled={formData.skills && formData.skills.length > 0}
          onChange={(val) => onChange('skills', val.split(',').map(s => s.trim()))}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField 
            label="Education" 
            value={formData.education} 
            isCurrent={currentField === 'education'} 
            isFilled={!!formData.education}
            onChange={(val) => onChange('education', val)}
          />
           <FormField 
            label="Desired Role" 
            value={formData.desiredPosition} 
            isCurrent={currentField === 'desiredPosition'} 
            isFilled={!!formData.desiredPosition}
            onChange={(val) => onChange('desiredPosition', val)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField 
            label="Exp. Salary" 
            value={formData.salary} 
            isCurrent={currentField === 'salary'} 
            isFilled={!!formData.salary}
            onChange={(val) => onChange('salary', val)}
          />
          <FormField 
            label="Notice Period" 
            value={formData.noticePeriod} 
            isCurrent={currentField === 'noticePeriod'} 
            isFilled={!!formData.noticePeriod}
            onChange={(val) => onChange('noticePeriod', val)}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 bg-gray-50 border-t">
        <motion.button
          onClick={onSubmit}
          disabled={!isComplete}
          whileHover={{ scale: isComplete ? 1.02 : 1 }}
          whileTap={{ scale: isComplete ? 0.98 : 1 }}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
            isComplete 
              ? 'bg-indigo-600 text-white shadow-lg' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Send size={18} />
          Submit Application
        </motion.button>
      </div>
    </div>
  );
};
