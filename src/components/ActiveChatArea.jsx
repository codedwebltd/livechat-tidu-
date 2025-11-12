import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import pusherService from '../services/PusherService';

const API_URL = "https://adminer.palestinesrelief.org/api";

// Global message cache for instant loading
const messageCache = {};

const ActiveChatArea = ({ 
  conversation, 
  onBack, 
  onJoin, 
  onSendMessage,
  onShowUserInfo,
  onCloseConversation,
  getAvatarBg
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false); // Background refresh indicator
  const [typing, setTyping] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isReopening, setIsReopening] = useState(false);

  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const callbackIdRef = useRef(null);
  const currentConversationIdRef = useRef(null);
  
  useEffect(() => {
    if (!conversation?.id) return;
    
    // Clear messages immediately when switching conversations
    if (currentConversationIdRef.current !== conversation.id) {
      console.log('🔄 Switching to new conversation, clearing old messages');
      setMessages([]);
      setIsInitialLoad(true);
      currentConversationIdRef.current = conversation.id;
    }
    
    // Check cache first for instant loading
    if (messageCache[conversation.id]) {
      console.log('⚡ Loading from cache instantly');
      setMessages(messageCache[conversation.id]);
      setIsInitialLoad(false);
      
      // Then refresh in background
      loadMessagesInBackground();
    } else {
      console.log('📥 No cache, loading fresh');
      loadMessages();
    }
    
    // Subscribe to Pusher
    callbackIdRef.current = pusherService.subscribeToConversation(conversation.id, {
      onNewMessage: handleNewMessage,
      onTyping: handleTyping,
      onError: (error) => {
        console.error('Pusher error:', error);
      }
    });
    
    return () => {
      if (callbackIdRef.current) {
        pusherService.unsubscribeFromConversation(conversation.id, callbackIdRef.current);
      }
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [conversation?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  // Initial load
  const loadMessages = async () => {
    try {
      setIsInitialLoad(true);
      
      const response = await axios.get(`${API_URL}/conversations/${conversation.id}`);
      
      if (response.data.status === 'success') {
        const newMessages = response.data.messages || [];
        console.log(`✅ Loaded ${newMessages.length} messages`);
        setMessages(newMessages);
        
        // Cache for next time
        messageCache[conversation.id] = newMessages;
      }
    } catch (error) {
      console.error('❌ Error loading messages:', error);
    } finally {
      setIsInitialLoad(false);
    }
  };

  // Background refresh (for cached data)
  const loadMessagesInBackground = async () => {
    try {
      setIsRefreshing(true);
      
      const response = await axios.get(`${API_URL}/conversations/${conversation.id}`);
      
      if (response.data.status === 'success') {
        const newMessages = response.data.messages || [];
        console.log(`🔄 Background refresh: ${newMessages.length} messages`);
        setMessages(newMessages);
        
        // Update cache
        messageCache[conversation.id] = newMessages;
      }
    } catch (error) {
      console.error('❌ Error refreshing messages:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleNewMessage = (data) => {
    console.log('💬 New message received:', data);
    
    setMessages(prev => {
      const exists = prev.some(m => m.id === data.id);
      if (exists) return prev;
      
      const updated = [...prev, data];
      
      // Update cache
      messageCache[conversation.id] = updated;
      
      return updated;
    });
  };

  const handleTyping = (data) => {
    if (data.sender_type === 'visitor') {
      setTyping(data.is_typing);
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      
      if (textareaRef.current.scrollHeight > 120) {
        textareaRef.current.style.height = '120px';
        textareaRef.current.style.overflowY = 'auto';
      } else {
        textareaRef.current.style.overflowY = 'hidden';
      }
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    const messageText = message.trim();
    setMessage('');
    pusherService.sendTypingIndicator(conversation.id, false);
    
    const tempMessage = {
      id: 'temp-' + Date.now(),
      conversation_id: conversation.id,
      type: 'text',
      sender_type: 'agent',
      content: messageText,
      created_at: new Date().toISOString(),
      temp: true
    };
    
    setMessages(prev => {
      const updated = [...prev, tempMessage];
      messageCache[conversation.id] = updated;
      return updated;
    });
    
    try {
      const response = await axios.post(
        `${API_URL}/conversations/${conversation.id}/messages`,
        { content: messageText }
      );
      
      if (response.data.status === 'success') {
        console.log('✅ Message sent');
        setMessages(prev => {
          const updated = prev.filter(m => m.id !== tempMessage.id);
          messageCache[conversation.id] = updated;
          return updated;
        });
      }
    } catch (error) {
      console.error('❌ Error sending:', error);
      setMessages(prev => 
        prev.map(m => m.id === tempMessage.id ? { ...m, failed: true } : m)
      );
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    
    if (e.target.value.trim()) {
      pusherService.sendTypingIndicator(conversation.id, true);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        pusherService.sendTypingIndicator(conversation.id, false);
      }, 3000);
    } else {
      pusherService.sendTypingIndicator(conversation.id, false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleCloseConversation = async () => {
    if (isClosing) return;
    setIsClosing(true);
    try {
      await onCloseConversation(conversation.id);
    } catch (error) {
      console.error('Error closing:', error);
    } finally {
      setIsClosing(false);
    }
  };

  const handleReopenConversation = async () => {
    if (isReopening) return;
    setIsReopening(true);
    try {
      await onJoin(conversation.id);
    } catch (error) {
      console.error('Error reopening:', error);
    } finally {
      setIsReopening(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const dateStr = new Date(message.created_at).toDateString();
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(message);
    });
    return groups;
  };

  const formatDateSeparator = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (!conversation) return null;
  
  const isPending = conversation.state === 'pending';
  const avatarBgClass = getAvatarBg ? getAvatarBg(conversation.avatarColor) : '';
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="relative flex flex-col flex-1 h-full" style={{ background: 'linear-gradient(to bottom, #e8ddd3 0%, #d4c4b0 100%)' }}>
      <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-200 md:px-6">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="p-2 transition rounded-lg hover:bg-gray-100">
            <i className="text-lg text-gray-700 fas fa-arrow-left"></i>
          </button>
          <div className="relative cursor-pointer" onClick={onShowUserInfo}>
            <div className={`w-10 h-10 rounded-full ${avatarBgClass} flex items-center justify-center text-white font-bold shadow-sm`}>
              {conversation.initial || 'V'}
            </div>
            {typing && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>}
          </div>
          <div>
            <button onClick={onShowUserInfo} className="font-semibold text-left text-gray-900 transition hover:text-blue-600">
              {conversation.name || 'Visitor'}
            </button>
            {typing ? (
              <p className="text-xs font-medium text-green-600">typing...</p>
            ) : (
              <p className="text-xs text-gray-500">{formatTime(conversation.lastMessageTime)}</p>
            )}
          </div>
          
          {/* Background refresh indicator */}
          {isRefreshing && (
            <div className="flex items-center ml-2 text-xs text-gray-500">
              <div className="w-3 h-3 mr-1 border-2 border-gray-400 rounded-full border-t-transparent animate-spin"></div>
              <span>Updating...</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button onClick={onShowUserInfo} className="p-2 transition rounded-lg hover:bg-gray-100">
            <i className="text-lg text-gray-600 fas fa-info-circle"></i>
          </button>
          <button onClick={handleCloseConversation} disabled={isClosing} className="relative px-3 py-2 text-sm font-medium text-white transition bg-red-500 rounded-lg md:px-4 hover:bg-red-600">
            {isClosing ? (
              <>
                <span className="opacity-0">Close</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                </div>
              </>
            ) : (
              <><i className="mr-1 fas fa-times"></i><span className="hidden sm:inline">Close</span></>
            )}
          </button>
          <button onClick={handleReopenConversation} disabled={isReopening} className="relative px-3 py-2 text-sm font-medium text-white transition bg-green-500 rounded-lg md:px-4 hover:bg-green-600">
            {isReopening ? (
              <>
                <span className="opacity-0">Reopen</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                </div>
              </>
            ) : (
              <><i className="mr-1 fas fa-sync-alt"></i><span className="hidden sm:inline">Reopen</span></>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-3 overflow-y-auto md:p-6">
        {isInitialLoad ? (
          <div className="flex items-center justify-center py-10">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 mb-3 border-b-2 border-blue-500 rounded-full animate-spin"></div>
              <p className="text-gray-600">Loading messages...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="flex items-center justify-center w-20 h-20 mb-4 bg-gray-200 rounded-full">
              <i className="text-2xl text-gray-400 fas fa-comments"></i>
            </div>
            <p className="text-center text-gray-600">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          Object.keys(groupedMessages).map(dateStr => (
            <div key={dateStr}>
              <div className="flex items-center justify-center mb-4">
                <span className="px-3 py-1 text-xs text-gray-700 rounded-lg shadow-sm bg-white/80 backdrop-blur-sm">
                  {formatDateSeparator(dateStr)}
                </span>
              </div>
              
              <div className="space-y-3">
                {groupedMessages[dateStr].map(msg => (
                  <div key={msg.id} className={`flex items-start space-x-2 ${msg.sender_type === 'agent' ? 'justify-end' : ''}`}>
                    {msg.sender_type !== 'agent' && msg.type !== 'system' && (
                      <div className={`w-8 h-8 rounded-full ${avatarBgClass} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-sm`}>
                        {conversation.initial || 'V'}
                      </div>
                    )}
                    
                    <div className="max-w-[70%]">
                      {msg.type === 'system' ? (
                        <div className="max-w-md px-4 py-2 mx-auto text-xs italic text-center text-gray-600 bg-gray-100 rounded-lg">{msg.content}</div>
                      ) : msg.type === 'image' ? (
                        <div className={`rounded-2xl shadow-sm overflow-hidden ${msg.sender_type === 'agent' ? 'bg-blue-500 rounded-br-none' : 'bg-white rounded-bl-none'}`}>
                          <img src={msg.file_url} alt="Image" className="object-contain max-w-full cursor-pointer max-h-60" style={{maxWidth: '240px'}} onClick={() => window.open(msg.file_url, '_blank')} />
                        </div>
                      ) : msg.type === 'file' ? (
                        <div className={`rounded-2xl shadow-sm ${msg.sender_type === 'agent' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-700 rounded-bl-none'} px-4 py-3`}>
                          <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                            <i className="mr-2 fas fa-file"></i>
                            <div>
                              <p className="text-sm font-medium">{msg.file_name || 'File'}</p>
                              <p className="text-xs opacity-70">{msg.file_size ? `${Math.round(msg.file_size / 1024)} KB` : ''}</p>
                            </div>
                          </a>
                        </div>
                      ) : (
                        <div className={`${msg.sender_type === 'agent' ? `bg-blue-500 text-white rounded-2xl rounded-br-none ${msg.failed ? 'opacity-50' : ''}` : 'bg-white text-gray-800 rounded-2xl rounded-bl-none'} px-4 py-2.5 shadow-sm`}>
                          <p className="text-sm break-words whitespace-pre-wrap">
                            {msg.content}
                            {msg.failed && <span className="ml-2 text-red-300"><i className="fas fa-exclamation-circle"></i></span>}
                          </p>
                        </div>
                      )}
                      
                      {msg.type !== 'system' && (
                        <div className={`flex items-center mt-1 text-xs text-gray-500 ${msg.sender_type === 'agent' ? 'justify-end' : 'justify-start ml-1'}`}>
                          <span>{formatTime(msg.created_at)}</span>
                          {msg.sender_type === 'agent' && !msg.temp && !msg.failed && (
                            <span className="ml-1">{msg.is_read ? <i className="text-blue-500 fas fa-check-double"></i> : <i className="text-gray-400 fas fa-check"></i>}</span>
                          )}
                          {msg.temp && <span className="ml-1"><i className="text-gray-400 fas fa-clock"></i></span>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
        
        {typing && (
          <div className="flex items-start space-x-2">
            <div className={`w-8 h-8 rounded-full ${avatarBgClass} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-sm`}>
              {conversation.initial || 'V'}
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
        
        <div ref={messagesEndRef} />
      </div>

      {isPending ? (
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center justify-center">
            <button onClick={handleReopenConversation} disabled={isReopening} className="relative px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700">
              {isReopening ? (
                <>
                  <span className="opacity-0">Join conversation</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  </div>
                </>
              ) : 'Join conversation'}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 md:p-4">
          <div className="flex items-end space-x-2">
            <textarea ref={textareaRef} value={message} onChange={handleMessageChange} onKeyDown={handleKeyDown} placeholder="Type your message..." rows="1" className="flex-1 px-4 py-3 overflow-y-auto text-sm bg-gray-100 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-32" />
            <button type="submit" className={`p-3 ${message.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'} text-white rounded-full transition shadow-sm flex-shrink-0`} disabled={!message.trim()}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ActiveChatArea;