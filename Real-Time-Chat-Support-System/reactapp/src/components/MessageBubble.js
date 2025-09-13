import React from 'react';

const MessageBubble = ({ message, isOwn, showAvatar, user }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {!isOwn && showAvatar && (
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-white text-sm font-semibold">
              {message.senderName?.charAt(0).toUpperCase() || 'A'}
            </span>
          </div>
        )}
        {!isOwn && !showAvatar && <div className="w-8"></div>}
        
        <div className={`group relative ${isOwn ? 'ml-auto' : ''}`}>
          <div className={`rounded-2xl px-4 py-3 shadow-lg transform transition-all duration-200 hover:scale-105 ${
            isOwn 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-blue-500/25' 
              : 'bg-white/15 backdrop-blur-lg text-white border border-white/20 shadow-white/10'
          }`}>
            <p className="text-sm leading-relaxed">{message.content}</p>
            <div className="flex items-center justify-between mt-2">
              <p className={`text-xs ${isOwn ? 'text-blue-100' : 'text-gray-300'}`}>
                {formatTime(message.timestamp)}
              </p>
              {isOwn && (
                <div className="flex space-x-1">
                  <div className={`w-1 h-1 rounded-full ${message.delivered !== false ? 'bg-blue-200' : 'bg-blue-300'}`}></div>
                  <div className={`w-1 h-1 rounded-full ${message.isRead ? 'bg-blue-200' : 'bg-blue-300'}`}></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Message tail */}
          <div className={`absolute top-4 ${
            isOwn 
              ? 'right-0 transform translate-x-1' 
              : 'left-0 transform -translate-x-1'
          }`}>
            <div className={`w-3 h-3 transform rotate-45 ${
              isOwn 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                : 'bg-white/15 backdrop-blur-lg border-l border-t border-white/20'
            }`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;