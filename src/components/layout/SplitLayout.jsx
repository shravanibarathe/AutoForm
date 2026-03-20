import React from 'react';

export const SplitLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 lg:p-8">
      <div className="max-w-[1400px] mx-auto h-[calc(100vh-4rem)] flex flex-col lg:flex-row gap-6">
        {children}
      </div>
    </div>
  );
};
