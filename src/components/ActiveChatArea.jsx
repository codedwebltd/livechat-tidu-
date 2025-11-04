import React, { useState, useRef, useEffect } from 'react';

const ActiveChatArea = ({ 
  conversation, 
  onBack, 
  onJoin, 
  onSendMessage,
  onShowUserInfo,
  getAvatarBg
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);
  
  useEffect(() => {
    // Adjust textarea height when component mounts
    adjustTextareaHeight();
  }, []);
  
  useEffect(() => {
    // Adjust textarea height when message changes
    adjustTextareaHeight();
  }, [message]);
  
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      // Set the height to scrollHeight to accommodate all text
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  if (!conversation) return null;
  
  const isPending = conversation.state === 'pending';
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(conversation.id, message);
      setMessage('');
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };
  
  const handleKeyDown = (e) => {
    // Submit on Enter (without Shift key)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        handleSendMessage(e);
      }
    }
  };

  // Get the avatar background color class
  const avatarBgClass = getAvatarBg ? getAvatarBg(conversation.avatarColor) : '';

  return (
    <div 
      className="flex-1 flex flex-col h-full"
      style={{ 
        background: isPending 
          ? 'white' 
          : 'linear-gradient(to bottom, #e8ddd3 0%, #d4c4b0 100%)' 
      }}
    >
      {/* Chat Header */}
      <div className="px-4 md:px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <i className="fas fa-arrow-left text-gray-700 text-lg"></i>
          </button>
          <div className="relative cursor-pointer" onClick={onShowUserInfo}>
            <div className={`w-10 h-10 rounded-full ${avatarBgClass} flex items-center justify-center text-white font-bold shadow-sm`}>
              {conversation.initial}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <button 
              onClick={onShowUserInfo}
              className="font-semibold text-gray-900 hover:text-blue-600 transition text-left"
            >
              {conversation.name}
            </button>
            {isPending ? (
              <p className="text-xs text-gray-500">8:40 PM</p>
            ) : (
              <p className="text-xs text-green-600 font-medium">typing...</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={onShowUserInfo}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title="View customer info"
          >
            <i className="fas fa-info-circle text-gray-600 text-lg"></i>
          </button>
          <button className="px-3 md:px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm transition">
            <i className="fas fa-check mr-1"></i><span className="hidden sm:inline">Solve</span>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
        {/* Date Separator */}
        <div className="flex items-center justify-center">
          <span className={`${
            isPending 
              ? 'bg-gray-200 text-gray-600' 
              : 'bg-white/80 backdrop-blur-sm text-gray-700 shadow-sm'
          } text-xs px-3 py-1 rounded-lg`}>
            {isPending ? 'Oct 15, 2025' : 'Yesterday'}
          </span>
        </div>
        
        {isPending ? (
          // Pending Chat Message
          <div className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-full ${avatarBgClass} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-sm`}>
              {conversation.initial}
            </div>
            <div>
              <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2.5 inline-block max-w-md shadow-sm">
                <p className="text-sm whitespace-pre-wrap break-words">{conversation.lastMessage}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">8:40 PM</p>
            </div>
          </div>
        ) : (
          // Active Chat Messages
          <>
            {/* Visitor Message 1 */}
            <div className="flex items-start space-x-2">
              <div className={`w-8 h-8 rounded-full ${avatarBgClass} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-sm`}>
                {conversation.initial}
              </div>
              <div className="max-w-[70%]">
                <div className="bg-white rounded-2xl rounded-bl-none px-4 py-2.5 shadow-sm">
                  <p className="text-sm whitespace-pre-wrap break-words">Hi! I'm interested in your services.</p>
                </div>
                <p className="text-xs text-gray-600 mt-1 ml-1">10:30 AM</p>
              </div>
            </div>

            {/* Visitor Message 2 */}
            <div className="flex items-start space-x-2">
              <div className={`w-8 h-8 rounded-full ${avatarBgClass} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-sm`}>
                {conversation.initial}
              </div>
              <div className="max-w-[70%]">
                <div className="bg-white rounded-2xl rounded-bl-none px-4 py-2.5 shadow-sm">
                  <p className="text-sm whitespace-pre-wrap break-words">{conversation.lastMessage}</p>
                </div>
                <p className="text-xs text-gray-600 mt-1 ml-1">10:31 AM</p>
              </div>
            </div>

            {/* Agent Message 1 */}
            <div className="flex items-end justify-end">
              <div className="max-w-[70%]">
                <div className="bg-blue-500 text-white rounded-2xl rounded-br-none px-4 py-2.5 shadow-sm">
                  <p className="text-sm whitespace-pre-wrap break-words">Hello! Thanks for reaching out! 👋</p>
                </div>
                <div className="flex items-center justify-end space-x-1 mt-1 mr-1">
                  <p className="text-xs text-gray-600">10:32 AM</p>
                  <i className="fas fa-check-double text-blue-500 text-xs"></i>
                </div>
              </div>
            </div>

            {/* Agent Message 2 - Example with line breaks */}
            <div className="flex items-end justify-end">
              <div className="max-w-[70%]">
                <div className="bg-blue-500 text-white rounded-2xl rounded-br-none px-4 py-2.5 shadow-sm">
                  <p className="text-sm whitespace-pre-wrap break-words">I'd be happy to help you get started. What type of services are you interested in?

1. Standard plan
2. Premium plan
3. Enterprise solution</p>
                </div>
                <div className="flex items-center justify-end space-x-1 mt-1 mr-1">
                  <p className="text-xs text-gray-600">10:32 AM</p>
                  <i className="fas fa-check-double text-blue-500 text-xs"></i>
                </div>
              </div>
            </div>

            {/* Typing indicator */}
            <div className="flex items-start space-x-2">
              <div className={`w-8 h-8 rounded-full ${avatarBgClass} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-sm`}>
                {conversation.initial}
              </div>
              <div className="bg-white rounded-2xl rounded-bl-none px-4 py-2.5 shadow-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Input Area */}
      {isPending ? (
        // Pending Chat Actions
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-center space-x-3">
              <button 
                onClick={() => onJoin(conversation.id)} 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition"
              >
                Join conversation
              </button>
              <button className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg font-medium text-sm transition">
                Add note
              </button>
            </div>
            <p className="text-center text-sm text-gray-500">or press <kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">⏎</kbd> to start typing</p>
          </div>
        </div>
      ) : (
        // Active Chat Input with auto-growing textarea
        <form onSubmit={handleSendMessage} className="bg-white border-t border-gray-200 p-3 md:p-4">
          <div className="flex items-end space-x-2">
            <button type="button" className="p-2 text-gray-500 hover:text-gray-700 transition flex-shrink-0">
              <i className="fas fa-paperclip text-xl"></i>
            </button>
            <button type="button" className="p-2 text-gray-500 hover:text-gray-700 transition flex-shrink-0">
              <i className="fas fa-smile text-xl"></i>
            </button>
            
            {/* Auto-growing textarea */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleMessageChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows="1"
              className="flex-1 px-4 py-3 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-32 overflow-y-auto"
            />
            
            <button 
              type="submit"
              className={`p-3 ${message.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'} text-white rounded-full transition shadow-sm flex-shrink-0`}
              disabled={!message.trim()}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ActiveChatArea;