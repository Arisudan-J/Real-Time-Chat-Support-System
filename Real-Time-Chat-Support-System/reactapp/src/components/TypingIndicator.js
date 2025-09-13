import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-end space-x-2">
        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white text-sm font-semibold">A</span>
        </div>
        <div className="bg-white/15 backdrop-blur-lg rounded-2xl px-4 py-3 border border-white/20 shadow-lg">
          <div className="flex space-x-1 items-center">
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
        
        {/* Typing indicator tail */}
        <div className="absolute left-8 top-4 transform -translate-x-1">
          <div className="w-3 h-3 transform rotate-45 bg-white/15 backdrop-blur-lg border-l border-t border-white/20"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;