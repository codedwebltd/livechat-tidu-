import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import webSocketService from '../services/webSocketService';

const API_URL = "https://adminer.palestinesrelief.org/api";

// Global cache for conversations - persists between renders and component mounts
const messagesCache = {};

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
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isBackgroundFetching, setIsBackgroundFetching] = useState(false);
  const [typing, setTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorTimeout, setErrorTimeout] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isReopening, setIsReopening] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState(null);

  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const lastMessageTimeRef = useRef(null);
  const isActiveRef = useRef(true); // Track if component is active/visible
  
  // Show error toast message that auto-dismisses
  const showError = (message) => {
    // Clear any existing error timeout
    if (errorTimeout) {
      clearTimeout(errorTimeout);
    }
    
    // Set the error message
    setErrorMessage(message);
    
    // Auto dismiss after 5 seconds
    const timeout = setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
    
    setErrorTimeout(timeout);
  };
  
  // Clear the error message manually
  const clearError = () => {
    if (errorTimeout) {
      clearTimeout(errorTimeout);
    }
    setErrorMessage(null);
  };
  
  // Add a system message to the chat
  const addSystemMessage = (content) => {
    const systemMessage = {
      id: 'system-' + Date.now(),
      conversation_id: conversation?.id,
      type: 'system',
      content: content,
      created_at: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, systemMessage]);
  };
  
useEffect(() => {
  // Set active on mount
  isActiveRef.current = true;
  
  // Add scroll event listener to detect user scrolling
  const messagesContainer = document.querySelector('.flex-1.overflow-y-auto');
  
  const handleScroll = () => {
    // User is scrolling - pause polling
    setIsUserScrolling(true);
    
    // Clear any existing timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    
    // Set a new timeout to resume polling after user stops scrolling
    const timeout = setTimeout(() => {
      setIsUserScrolling(false);
      console.log('User stopped scrolling, polling resumed');
    }, 8000); // 8 seconds pause after last scroll
    
    setScrollTimeout(timeout);
  };
  
  if (messagesContainer) {
    messagesContainer.addEventListener('scroll', handleScroll);
  }
  
  // Cleanup on unmount
  return () => {
    isActiveRef.current = false;
    
    // Clean up scroll listener
    if (messagesContainer) {
      messagesContainer.removeEventListener('scroll', handleScroll);
    }
    
    // Clean up all timeouts
    if (errorTimeout) {
      clearTimeout(errorTimeout);
    }
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
  };
}, []);
  
  useEffect(() => {
    // Adjust textarea height when component mounts
    adjustTextareaHeight();
  }, []);
  
  useEffect(() => {
    // Adjust textarea height when message changes
    adjustTextareaHeight();
    
    // Send typing indicator when user is typing
    if (conversation?.id && message.trim()) {
      webSocketService.sendTypingIndicator(conversation.id, true);
    }
    
    // Clear typing indicator after 3 seconds of inactivity
    const typingTimeout = setTimeout(() => {
      if (conversation?.id && message.trim() === '') {
        webSocketService.sendTypingIndicator(conversation.id, false);
      }
    }, 3000);
    
    return () => clearTimeout(typingTimeout);
  }, [message, conversation]);

  // Effect to handle conversation changes and WebSocket setup
useEffect(() => {
  if (!conversation?.id) return;
  
  // IMPORTANT: Always clear messages and show loading when conversation changes
  // This ensures we don't see the wrong conversation content while loading
  setMessages([]);
  setIsInitialLoading(true);
  
  // Clear any existing polling interval
  if (pollingIntervalRef.current) {
    clearInterval(pollingIntervalRef.current);
    pollingIntervalRef.current = null;
  }
  
  console.log('Conversation changed to:', conversation.id);
  
  // First load - check if we have cached messages
  if (messagesCache[conversation.id]) {
    console.log('Using cached messages while loading fresh data');
    // Set messages from cache
    setMessages(messagesCache[conversation.id]);
    setIsInitialLoading(false);
    
    // Still fetch fresh data in the background
    backgroundFetchMessages(conversation.id);
  } else {
    // No cache - do a regular fetch
    console.log('No cache found, loading messages from API');
    fetchMessages(conversation.id);
  }
  
  // Set up WebSocket connection
  const channel = webSocketService.subscribeToConversation(conversation.id, {
    onNewMessage: handleNewWebSocketMessage,
    onTyping: (data) => {
      // Set typing indicator if it's from the visitor
      if (data.sender_type !== 'agent' && data.sender_type !== 'self') {
        setTyping(data.is_typing);
      }
    },
    onError: (error) => {
      console.error('WebSocket error:', error);
      if (isActiveRef.current) {
        showError('Connection issue. Some messages may be delayed.');
      }
    }
  });
  
  // Start immediate polling
  console.log('Setting up polling for conversation:', conversation.id);
  pollingIntervalRef.current = setInterval(() => {
    // Only poll if user is not actively scrolling/reading
    if (isActiveRef.current && !isUserScrolling) {
      console.log('Polling triggered for new messages...');
      backgroundFetchMessages(conversation.id);
    } else if (isUserScrolling) {
      console.log('Polling paused - user is scrolling or reading');
    }
  }, 20000);

  
  // Clean up WebSocket and polling
  return () => {
    console.log('Cleaning up WebSocket and polling');
    webSocketService.unsubscribeFromConversation(conversation.id);
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };
}, [conversation?.id]);


  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
    
    // Update last message time reference for efficient polling
    if (messages.length > 0) {
      const sortedMessages = [...messages].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      lastMessageTimeRef.current = sortedMessages[0].created_at;
    }
  }, [messages]);
  
  // Handle new messages from WebSocket
  const handleNewWebSocketMessage = (data) => {
    // Only add messages that we don't already have
    if (!messages.some(m => m.id === data.id)) {
      setMessages(prevMessages => {
        // Remove any temporary messages that might have been added optimistically
        const withoutTemp = prevMessages.filter(m => 
          !(m.temp && m.content === data.content)
        );
        const newMessages = [...withoutTemp, data];
        
        // Update cache
        messagesCache[conversation.id] = newMessages;
        
        return newMessages;
      });
    }
  };
  
  const setupPolling = (conversationId) => {
    // Poll every 8 seconds as a backup for WebSocket, but only when component is active
    pollingIntervalRef.current = setInterval(() => {
      // Only do a background fetch if component is active and we're not already loading
      if (isActiveRef.current && !isInitialLoading && !isBackgroundFetching) {
        backgroundFetchMessages(conversationId);
      }
    }, 12000);
  };
  
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      // Set the height to scrollHeight to accommodate all text
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      // Cap height at a maximum of 120px
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

  // Fetch messages - used for initial load
  const fetchMessages = async (conversationId) => {
    try {
      setIsInitialLoading(true);
      
      const response = await axios.get(`${API_URL}/conversations/${conversationId}`);
      
      if (response.data.status === 'success') {
        const newMessages = response.data.messages || [];
        
        setMessages(newMessages);
        
        // Cache the messages for faster loading next time
        messagesCache[conversationId] = newMessages;
      } else {
        showError('Could not load messages. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      showError('Network error. Could not load messages.');
      
      // Add a system message to the chat
      addSystemMessage('Could not load messages. Please check your connection.');
    } finally {
      setIsInitialLoading(false);
    }
  };
  
  // Background fetch - silent refresh
const backgroundFetchMessages = async (conversationId) => {
  if (!conversationId) return;
  
  // Skip if user is actively scrolling/reading
  if (isUserScrolling) {
    console.log('Skipping background fetch - user is scrolling/reading');
    return;
  }
  
  console.log('Background fetch started for conversation:', conversationId);
  
  try {
    // Get the messages container
    const messagesContainer = document.querySelector('.flex-1.overflow-y-auto');
    
    // Check if user is at the bottom
    const isAtBottom = messagesContainer ? 
      (messagesContainer.scrollTop + messagesContainer.clientHeight >= 
       messagesContainer.scrollHeight - 50) : true;
    
    // Always show loading indicator
    setIsBackgroundFetching(true);
    
    const response = await axios.get(`${API_URL}/conversations/${conversationId}`);
    
    if (response.data.status === 'success') {
      const newMessages = response.data.messages || [];
      console.log(`Fetched ${newMessages.length} messages, current: ${messages.length}`);
      
      // Always process messages to ensure we catch status updates
      // Merge with existing messages, keeping temp ones
      const tempMessages = messages.filter(m => m.temp);
      const mergedMessages = [...newMessages, ...tempMessages];
      
      // Remove duplicates based on id
      const uniqueMessages = Array.from(
        new Map(mergedMessages.map(m => [m.id, m])).values()
      );
      
      // Update messages
      setMessages(uniqueMessages);
      
      // Update cache
      messagesCache[conversationId] = uniqueMessages;
      
      // ONLY auto-scroll to bottom if user was already at the bottom
      // and we're not in a scrolling/reading state
      if (isAtBottom && !isUserScrolling) {
        setTimeout(() => {
          if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }
        }, 100);
      }
    }
  } catch (error) {
    console.error('Error in background fetch:', error);
  } finally {
    // Ensure loading state is visible for at least 1 second
    setTimeout(() => {
      setIsBackgroundFetching(false);
    }, 1500);
  }
};
  
  // Handle closing a conversation with loading state
const handleCloseConversation = async (conversationId) => {
  if (isClosing) return; // Prevent double-clicks
  
  setIsClosing(true);
  
  try {
    // Check if onCloseConversation exists before calling it
    if (typeof onCloseConversation === 'function') {
      await onCloseConversation(conversationId);
      // Success will be handled by parent component
    } else {
      console.error('onCloseConversation is not defined');
      showError('Close functionality not available. Please refresh the page.');
    }
  } catch (error) {
    console.error('Error closing conversation:', error);
    showError('Failed to close conversation. Please try again.');
  } finally {
    setIsClosing(false);
  }
};

  
  // Handle reopening a conversation with loading state
  const handleReopenConversation = async (conversationId) => {
    if (isReopening) return; // Prevent double-clicks
    
    setIsReopening(true);
    
    try {
      await onJoin(conversationId);
      // Success will be handled by parent component
    } catch (error) {
      console.error('Error reopening conversation:', error);
      showError('Failed to reopen conversation. Please try again.');
    } finally {
      setIsReopening(false);
    }
  };

  if (!conversation) return null;
  
  const isPending = conversation.state === 'pending';
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Generate a temporary ID and timestamp
      const tempId = 'temp-' + Date.now();
      const tempTimestamp = new Date().toISOString();
      
      // Create optimistic temporary message
      const tempMessage = {
        id: tempId,
        conversation_id: conversation.id,
        type: 'text',
        sender_type: 'agent',
        content: message,
        created_at: tempTimestamp,
        is_delivered: false,
        is_read: false,
        temp: true
      };
      
      // Add to UI immediately
      setMessages(prev => [...prev, tempMessage]);
      
      // Update the cache with the optimistic message
      messagesCache[conversation.id] = [...(messagesCache[conversation.id] || []), tempMessage];
      
      // Clear input field
      const sentMessage = message;
      setMessage('');
      
      // Clear typing indicator
      webSocketService.sendTypingIndicator(conversation.id, false);
      
      try {
        // Call API to send the message
        const result = await onSendMessage(conversation.id, sentMessage);
        
        // After successful send, fetch messages in background to update the temp message
        // We use a timeout to give the server time to process the message
        setTimeout(() => {
          if (isActiveRef.current) {
            backgroundFetchMessages(conversation.id);
          }
        }, 1000);
      } catch (error) {
        console.error('Failed to send message:', error);
        
        // Mark the temp message as failed
        setMessages(prev => prev.map(m => 
          m.id === tempId 
            ? { ...m, sendFailed: true }
            : m
        ));
        
        // Show error toast
        showError('Message failed to send. Click the message to retry.');
      }
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
  
  // Handle retry for failed messages
  const handleRetryMessage = (tempId) => {
    // Find the failed message
    const failedMessage = messages.find(m => m.id === tempId);
    if (failedMessage) {
      // Remove the failed message
      setMessages(prev => prev.filter(m => m.id !== tempId));
      
      // Set the message content back in the input
      setMessage(failedMessage.content);
      
      // Focus the textarea
      textareaRef.current?.focus();
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
    
    // Sort messages within each group
    Object.keys(groups).forEach(date => {
      groups[date].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
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
      className="flex-1 flex flex-col h-full relative"
      style={{ 
        background: 'linear-gradient(to bottom, #e8ddd3 0%, #d4c4b0 100%)'
      }}
    >
      {/* Error Toast Message */}
      {errorMessage && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
          <i className="fas fa-exclamation-circle mr-2"></i>
          <span>{errorMessage}</span>
          <button 
            onClick={clearError}
            className="ml-3 text-white hover:text-red-100"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
      
      {/* Chat Header */}
      <div className="px-4 md:px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <i className="fas fa-arrow-left text-gray-700 text-lg"></i>
          </button>
          <div className="relative cursor-pointer" onClick={onShowUserInfo}>
            <div className={`w-10 h-10 rounded-full ${avatarBgClass} flex items-center justify-center text-white font-bold shadow-sm`}>
              {conversation.initial || 'V'}
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
              {conversation.name || 'Visitor'}
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
            onClick={() => handleCloseConversation(conversation.id)}
            disabled={isClosing}
            className="px-3 md:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition relative"
          >
            {isClosing ? (
              <>
                <span className="opacity-0">Close</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              </>
            ) : (
              <>
                <i className="fas fa-times mr-1"></i>
                <span className="hidden sm:inline">Close</span>
              </>
            )}
          </button>
          <button 
            onClick={() => handleReopenConversation(conversation.id)}
            disabled={isReopening}
            className="px-3 md:px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm transition relative"
          >
            {isReopening ? (
              <>
                <span className="opacity-0">Reopen</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              </>
            ) : (
              <>
                <i className="fas fa-sync-alt mr-1"></i>
                <span className="hidden sm:inline">Reopen</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 relative">
        {isInitialLoading && messages.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-3"></div>
              <p className="text-gray-600">Loading messages...</p>
            </div>
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
                    {msg.sender_type !== 'agent' && msg.type !== 'system' && (
                      <div className={`w-8 h-8 rounded-full ${avatarBgClass} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-sm`}>
                        {conversation.initial || 'V'}
                      </div>
                    )}
                    
                    <div className={`max-w-[70%] ${msg.sender_type === 'agent' ? '' : msg.type !== 'system' ? 'ml-2' : ''}`}>
                      {msg.type === 'system' ? (
                        // System message
                        <div className="bg-gray-100 text-gray-600 rounded-lg px-4 py-2 text-center text-xs italic mx-auto max-w-md">
                          {msg.content}
                        </div>
                      ) : msg.type === 'image' ? (
                        // Image message - set max width/height constraints
                        <div 
                          className={`rounded-2xl shadow-sm overflow-hidden ${
                            msg.sender_type === 'agent' 
                              ? 'bg-blue-500 rounded-br-none' 
                              : 'bg-white rounded-bl-none'
                          }`}
                        >
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
                        <div 
                          className={`${
                            msg.sender_type === 'agent' 
                              ? `bg-blue-500 text-white rounded-2xl rounded-br-none ${msg.sendFailed ? 'border-2 border-red-500' : ''}` 
                              : 'bg-white text-gray-800 rounded-2xl rounded-bl-none'
                          } px-4 py-2.5 shadow-sm ${msg.sendFailed ? 'cursor-pointer' : ''}`}
                          onClick={() => msg.sendFailed ? handleRetryMessage(msg.id) : null}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {msg.content}
                            {msg.sendFailed && (
                              <span className="ml-2 text-red-300">
                                <i className="fas fa-exclamation-circle"></i>
                              </span>
                            )}
                          </p>
                        </div>
                      )}
                      
                      {msg.type !== 'system' && (
                        <div className={`flex items-center mt-1 text-xs text-gray-500 ${
                          msg.sender_type === 'agent' ? 'justify-end' : 'justify-start ml-1'
                        }`}>
                          <span>{formatMessageTime(msg.created_at)}</span>
                          {msg.sender_type === 'agent' && (
                            <span className="ml-1">
                              {msg.sendFailed ? (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRetryMessage(msg.id);
                                  }} 
                                  title="Failed to send, click to retry"
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <i className="fas fa-exclamation-circle"></i>
                                </button>
                              ) : msg.is_read ? (
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
                      )}
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
        
        {/* Background loading indicator (small and visible inside the chat area) */}
        {isBackgroundFetching && (
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
              <span className="text-xs text-blue-600">Updating...</span>
            </div>
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
                onClick={() => handleReopenConversation(conversation.id)} 
                disabled={isReopening}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition relative"
              >
                {isReopening ? (
                  <>
                    <span className="opacity-0">Join conversation</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </>
                ) : (
                  <>Join conversation</>
                )}
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
            <button 
              type="button" 
              className="p-2 text-gray-500 hover:text-gray-700 transition flex-shrink-0"
              title="Attach file (coming soon)"
            >
              <i className="fas fa-paperclip text-xl"></i>
            </button>
            <button 
              type="button" 
              className="p-2 text-gray-500 hover:text-gray-700 transition flex-shrink-0"
              title="Emoji (coming soon)"
            >
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