import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import webSocketService from '../services/webSocketService';

const API_URL = "https://adminer.palestinesrelief.org/api";

// Create a cache object outside component to persist between renders
const messagesCache = {};

const ActiveChatArea = ({ 
  conversation, 
  onBack, 
  onJoin, 
  onSendMessage,
  onShowUserInfo,
  getAvatarBg
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [silentRefresh, setSilentRefresh] = useState(false);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    // Adjust textarea height when component mounts
    adjustTextareaHeight();
  }, []);
  
  useEffect(() => {
    // Adjust textarea height when message changes
    adjustTextareaHeight();
    
    // Send typing indicator when user is typing
    if (conversation && conversation.id && message.trim()) {
      webSocketService.sendTypingIndicator(conversation.id, true);
    }
  }, [message, conversation]);

  // Fetch messages when conversation changes and set up WebSocket
  useEffect(() => {
    if (!conversation || !conversation.id) return;
    
    // Fetch messages initially
    fetchMessages(conversation.id);
    
    // Set up WebSocket connection
    const channel = webSocketService.subscribeToConversation(conversation.id, {
      onNewMessage: (data) => {
        // Only add messages from the other party
        if (data.sender_type !== 'agent') {
          // If we're already showing this message (by ID), don't add it again
          if (!messages.some(m => m.id === data.id)) {
            setMessages(prevMessages => [...prevMessages, data]);
          }
        }
      },
      onTyping: (data) => {
        // Set typing indicator if it's from the visitor
        if (data.visitor_id !== 'agent') {
          setTyping(data.is_typing);
        }
      }
    });
    
    // Clean up WebSocket connection
    return () => {
      webSocketService.unsubscribeFromConversation(conversation.id);
    };
  }, [conversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      // Set the height to scrollHeight to accommodate all text
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fetch messages for the conversation
  const fetchMessages = async (conversationId, silent = false) => {
    try {
      if (!silent) setLoading(true);
      if (silent) setSilentRefresh(true);
      
      const response = await axios.get(`${API_URL}/conversations/${conversationId}`);
      
      if (response.data.status === 'success') {
        // Filter out any temporary messages that we added optimistically
        const newMessages = response.data.messages || [];
        
        // If we have temp messages, we need to be careful not to lose them
        if (messages.some(m => m.temp)) {
          // Merge the messages, keeping temp ones if they don't exist on the server
          const mergedMessages = [...newMessages];
          
          // Add temp messages that aren't in the response
          messages.filter(m => m.temp).forEach(tempMsg => {
            const exists = newMessages.some(m => 
              m.content === tempMsg.content && 
              Math.abs(new Date(m.created_at) - new Date(tempMsg.created_at)) < 60000
            );
            
            if (!exists) {
              mergedMessages.push(tempMsg);
            }
          });
          
          setMessages(mergedMessages);
        } else {
          setMessages(newMessages);
        }
        
        // Cache messages for faster loading next time
        messagesCache[conversationId] = newMessages;
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      if (!silent) setLoading(false);
      if (silent) setSilentRefresh(false);
    }
  };

  if (!conversation) return null;
  
  const isPending = conversation.state === 'pending';
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Optimistically add message to UI
      const tempMessage = {
        id: 'temp-' + Date.now(),
        conversation_id: conversation.id,
        type: 'text',
        sender_type: 'agent',
        content: message,
        created_at: new Date().toISOString(),
        is_delivered: false,
        temp: true // Flag to identify temporary messages
      };
      
      setMessages(prev => [...prev, tempMessage]);
      
      // Clear input field
      const sentMessage = message;
      setMessage('');
      
      // Clear typing indicator
      webSocketService.sendTypingIndicator(conversation.id, false);
      
      // Call parent handler (which will make the API call)
      await onSendMessage(conversation.id, sentMessage);
      
      // Silent refresh after a delay to get the real message from the server
      setTimeout(() => {
        fetchMessages(conversation.id, true);
      }, 1000);
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

  // Format timestamp to readable time
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach(message => {
      const date = new Date(message.created_at);
      const dateStr = date.toDateString();
      
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      
      groups[dateStr].push(message);
    });
    
    return groups;
  };
  
  // Format date for separators
  const formatDateSeparator = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric' 
      });
    }
  };

  // Get the avatar background color class
  const avatarBgClass = getAvatarBg ? getAvatarBg(conversation.avatarColor) : '';

  // Group messages by date
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div 
      className="flex-1 flex flex-col h-full"
      style={{ 
        background: 'linear-gradient(to bottom, #e8ddd3 0%, #d4c4b0 100%)'
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
            {typing && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>
          <div>
            <button 
              onClick={onShowUserInfo}
              className="font-semibold text-gray-900 hover:text-blue-600 transition text-left"
            >
              {conversation.name}
            </button>
            {typing ? (
              <p className="text-xs text-green-600 font-medium">typing...</p>
            ) : (
              <p className="text-xs text-gray-500">{formatMessageTime(conversation.lastMessageTime)}</p>
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
          <button 
            onClick={() => onJoin(conversation.id)}
            className="px-3 md:px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm transition"
          >
            <i className="fas fa-check mr-1"></i><span className="hidden sm:inline">Solve</span>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-comments text-gray-400 text-2xl"></i>
            </div>
            <p className="text-gray-600 text-center">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          // Show messages grouped by date
          Object.keys(groupedMessages).map(dateStr => (
            <div key={dateStr}>
              {/* Date Separator */}
              <div className="flex items-center justify-center mb-4">
                <span className="bg-white/80 backdrop-blur-sm text-gray-700 shadow-sm text-xs px-3 py-1 rounded-lg">
                  {formatDateSeparator(dateStr)}
                </span>
              </div>
              
              {/* Messages for this date */}
              <div className="space-y-3">
                {groupedMessages[dateStr].map(msg => (
                  <div 
                    key={msg.id} 
                    className={`flex items-start space-x-2 ${msg.sender_type === 'agent' ? 'justify-end' : ''}`}
                  >
                    {msg.sender_type !== 'agent' && (
                      <div className={`w-8 h-8 rounded-full ${avatarBgClass} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-sm`}>
                        {conversation.initial}
                      </div>
                    )}
                    
                    <div className={`max-w-[70%] ${msg.sender_type === 'agent' ? '' : 'ml-2'}`}>
                      {msg.type === 'system' ? (
                        // System message
                        <div className="bg-gray-100 text-gray-600 rounded-lg px-4 py-2 text-center text-xs italic">
                          {msg.content}
                        </div>
                      ) : msg.type === 'image' ? (
                        // Image message - set max width/height constraints
                        <div className={`rounded-2xl shadow-sm overflow-hidden ${
                          msg.sender_type === 'agent' 
                            ? 'bg-blue-500 rounded-br-none' 
                            : 'bg-white rounded-bl-none'
                        }`}>
                          <div className="max-h-60 overflow-hidden flex justify-center">
                            <img 
                              src={msg.file_url} 
                              alt="Image" 
                              className="object-contain max-w-full max-h-60" 
                              style={{maxWidth: '240px'}}
                              onClick={() => window.open(msg.file_url, '_blank')}
                            />
                          </div>
                          {msg.content && (
                            <div className={`px-3 py-1 text-xs ${
                              msg.sender_type === 'agent' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {msg.content}
                            </div>
                          )}
                        </div>
                      ) : msg.type === 'file' ? (
                        // File message
                        <div className={`rounded-2xl shadow-sm ${
                          msg.sender_type === 'agent' 
                            ? 'bg-blue-500 text-white rounded-br-none' 
                            : 'bg-white text-gray-700 rounded-bl-none'
                        } px-4 py-3`}>
                          <a 
                            href={msg.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center"
                          >
                            <i className="fas fa-file mr-2"></i>
                            <div>
                              <p className="text-sm font-medium">{msg.file_name || 'File'}</p>
                              <p className="text-xs opacity-70">
                                {msg.file_size ? `${Math.round(msg.file_size / 1024)} KB` : ''}
                              </p>
                            </div>
                          </a>
                        </div>
                      ) : (
                        // Text message
                        <div className={`${
                          msg.sender_type === 'agent' 
                            ? 'bg-blue-500 text-white rounded-2xl rounded-br-none' 
                            : 'bg-white text-gray-800 rounded-2xl rounded-bl-none'
                        } px-4 py-2.5 shadow-sm`}>
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                        </div>
                      )}
                      
                      <div className={`flex items-center mt-1 text-xs text-gray-500 ${
                        msg.sender_type === 'agent' ? 'justify-end' : 'justify-start ml-1'
                      }`}>
                        <span>{formatMessageTime(msg.created_at)}</span>
                        {msg.sender_type === 'agent' && (
                          <span className="ml-1">
                            {msg.is_read ? (
                              <i className="fas fa-check-double text-blue-500"></i>
                            ) : msg.is_delivered ? (
                              <i className="fas fa-check text-gray-400"></i>
                            ) : msg.temp ? (
                              <i className="fas fa-clock text-gray-400"></i>
                            ) : (
                              <i className="fas fa-check text-gray-400"></i>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
        
        {/* Typing indicator */}
        {typing && (
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
        )}
        
        {/* Silent refresh indicator */}
        {silentRefresh && (
          <div className="absolute bottom-20 right-4 w-5 h-5 opacity-30">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
          </div>
        )}
        
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
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