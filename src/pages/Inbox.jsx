import React, { useState, useEffect, useRef } from 'react';
import { useConversations } from '../hooks/useConversations';
import ActiveChatArea from '../components/ActiveChatArea';
import CustomerInfo from '../components/CustomerInfo';
import pusherService from '../services/PusherService';

const Inbox = () => {
  const { 
    conversations, 
    loading, 
    error,
    pagination,
    updateConversationState,
    sendMessage,
    searchConversations,
    filterByStatus,
    goToPage,
    refreshConversations
  } = useConversations();
  
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [view, setView] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('open');
  const [tabLoading, setTabLoading] = useState(false);
  const [localConversations, setLocalConversations] = useState(conversations);
  const [typingConversations, setTypingConversations] = useState({});
  
  const subscribedIdsRef = useRef(new Set());
  
  useEffect(() => {
    setLocalConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    console.log('🚀 Initializing Pusher for Inbox');
    pusherService.initialize();
    
    const widgetChannel = pusherService.pusher.subscribe('widget');
    
    widgetChannel.bind('new-conversation', (data) => {
      console.log('🆕 NEW conversation created:', data);
      refreshConversations();
    });
    
    return () => {
      pusherService.pusher.unsubscribe('widget');
      pusherService.cleanup();
      subscribedIdsRef.current.clear();
    };
  }, []);

  // 🔥 FIXED: Subscribe to conversations whenever the list changes
  useEffect(() => {
    if (localConversations.length === 0) return;
    
    console.log(`📡 INBOX: Checking subscriptions for ${localConversations.length} conversations`);
    
    localConversations.forEach(conv => {
      // Skip if already subscribed
      if (subscribedIdsRef.current.has(conv.id)) {
        console.log(`⏭️ INBOX: Already subscribed to conversation ${conv.id}`);
        return;
      }
      
      console.log(`📡 INBOX: NEW subscription to conversation ${conv.id}`);
      subscribedIdsRef.current.add(conv.id);
      
      pusherService.subscribeToConversation(conv.id, {
        onNewMessage: (message) => {
          console.log(`💬 INBOX: New message in conversation ${conv.id}`, message);
          
          setLocalConversations(prev => prev.map(c => {
            if (c.id === conv.id) {
              return {
                ...c,
                lastMessage: message.content || message.file_name || 'New message',
                lastMessageTime: formatTimestamp(message.created_at),
                hasNewMessages: message.sender_type !== 'agent',
                isRead: message.sender_type === 'agent'
              };
            }
            return c;
          }));
        },
        onTyping: (data) => {
          console.log(`📝 INBOX: Typing in conversation ${conv.id}`, data);
          
          setTypingConversations(prev => ({
            ...prev,
            [conv.id]: data.is_typing
          }));
        }
      });
    });
    
    // Cleanup - unsubscribe from conversations no longer in list
    return () => {
      const currentIds = new Set(localConversations.map(c => c.id));
      subscribedIdsRef.current.forEach(id => {
        if (!currentIds.has(id)) {
          console.log(`🔌 INBOX: Unsubscribing from removed conversation ${id}`);
          pusherService.unsubscribeFromConversation(id);
          subscribedIdsRef.current.delete(id);
        }
      });
    };
  }, [localConversations]); // 🔥 FIXED: Depend on the ACTUAL array, not just length
  
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 30) return `${Math.floor(diffDay / 30)}mo`;
    if (diffDay > 0) return `${diffDay}d`;
    if (diffHour > 0) return `${diffHour}h`;
    if (diffMin > 0) return `${diffMin}m`;
    return 'now';
  };

  const handleCloseConversation = async (id) => {
    try {
      await updateConversationState(id, 'closed');
      window.location.reload();
    } catch (error) {
      console.error('Failed to close conversation:', error);
    }
  };
  
  const activeConversation = localConversations.find(conv => conv.id === activeConversationId);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectConversation = (id) => {
    setActiveConversationId(id);
    setView(isMobile ? 'chat' : 'chat');
  };

  const handleCloseChat = () => {
    setView(isMobile ? 'list' : 'list');
    if (!isMobile) setActiveConversationId(null);
  };

  const handleShowUserInfo = () => setView('info');
  const handleBackToChat = () => setView('chat');

  const handleJoinChat = async (id) => {
    try {
      await updateConversationState(id, 'active');
      window.location.href = window.location.href;
    } catch (error) {
      console.error('Failed to join/reopen conversation:', error);
    }
  };

  const handleSendMessage = async (conversationId, text) => {
    await sendMessage(conversationId, text);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setTabLoading(true);
    searchConversations(searchQuery);
    setTimeout(() => setTabLoading(false), 500);
  };

  const handleFilterChange = (status) => {
    if (status === activeFilter) return;
    setTabLoading(true);
    setActiveFilter(status);
    filterByStatus(status);
    setTimeout(() => setTabLoading(false), 500);
  };

  const handleManualRefresh = () => {
    setTabLoading(true);
    refreshConversations().then(() => {
      setTimeout(() => setTabLoading(false), 300);
    });
  };

  const getAvatarBg = (color) => {
    const colorMap = {
      'yellow': 'bg-yellow-500', 'blue': 'bg-blue-500', 'green': 'bg-green-500',
      'red': 'bg-red-500', 'purple': 'bg-purple-500', 'indigo': 'bg-indigo-500',
      'pink': 'bg-pink-500', 'gray': 'bg-gray-500'
    };
    return colorMap[color] || 'bg-blue-500';
  };

  return (
    <div className="h-[calc(100vh-73px)] flex overflow-hidden bg-gray-50">
      <div className={`${(isMobile && (view === 'chat' || view === 'info')) ? 'hidden' : 'w-full md:w-96'} border-r border-gray-200`}>
        <div className="flex flex-col h-full bg-white">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-gray-900">Inbox</h2>
              <button 
                onClick={handleManualRefresh}
                className="p-2 transition rounded-lg hover:bg-gray-100"
                title="Refresh"
                disabled={loading || tabLoading}
              >
                <i className={`fas fa-sync-alt text-gray-600 ${(loading || tabLoading) ? 'animate-spin' : ''}`}></i>
              </button>
            </div>
            
            <form onSubmit={handleSearch} className="relative">
              <i className="absolute text-gray-400 -translate-y-1/2 fas fa-search left-3 top-1/2"></i>
              <input 
                type="text" 
                placeholder="Search in Inbox..." 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleFilterChange('open')}
                disabled={loading || tabLoading}
                className={`px-3 py-1.5 ${activeFilter === 'open' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-lg text-sm font-medium transition`}
              >
                Open
              </button>
              <button 
                onClick={() => handleFilterChange('closed')}
                disabled={loading || tabLoading}
                className={`px-3 py-1.5 ${activeFilter === 'closed' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-lg text-sm font-medium transition`}
              >
                Closed
              </button>
              <button 
                onClick={() => handleFilterChange('archived')}
                disabled={loading || tabLoading}
                className={`px-3 py-1.5 ${activeFilter === 'archived' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-lg text-sm font-medium transition`}
              >
                Archived
              </button>
              
              {tabLoading && (
                <div className="flex-shrink-0 ml-2">
                  <div className="w-5 h-5 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading && localConversations.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-8 h-8 border-b-2 border-blue-500 rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-600">
                <p>{error}</p>
                <button onClick={refreshConversations} className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-lg">
                  Try Again
                </button>
              </div>
            ) : localConversations.length === 0 ? (
              <div className="flex flex-col items-center p-4 py-10 text-center text-gray-600">
                <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
                  <i className="text-xl text-gray-400 fas fa-inbox"></i>
                </div>
                <p>No {activeFilter} conversations found</p>
              </div>
            ) : (
              localConversations.map((conversation) => (
                <div 
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation.id)}
                  className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-all duration-150 ${
                    activeConversationId === conversation.id 
                      ? 'bg-blue-50 border-l-4 border-l-blue-600' 
                      : 'border-l-4 border-l-transparent'
                  } ${!conversation.isRead && conversation.hasNewMessages ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full ${getAvatarBg(conversation.avatarColor)} flex items-center justify-center text-white font-bold shadow-sm`}>
                        {conversation.initial}
                      </div>
                      {conversation.state === 'active' && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {conversation.name}
                          {!conversation.isRead && conversation.hasNewMessages && (
                            <span className="inline-block w-2 h-2 ml-2 bg-blue-600 rounded-full"></span>
                          )}
                        </h3>
                        <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                      </div>
                      <p className="mb-1 text-xs text-gray-500">{conversation.type}</p>
                      {typingConversations[conversation.id] ? (
                        <p className="text-sm font-medium text-green-600">typing...</p>
                      ) : (
                        <p className="text-sm text-gray-700 truncate">{conversation.lastMessage}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center py-4 border-t border-gray-200">
                <button 
                  onClick={() => goToPage(pagination.currentPage - 1)}
                  disabled={pagination.currentPage <= 1 || loading || tabLoading}
                  className="px-3 py-1 border border-gray-300 rounded-l-lg disabled:opacity-50"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <span className="px-4 py-1 text-sm text-gray-700">
                  {pagination.currentPage} / {pagination.totalPages}
                </span>
                <button 
                  onClick={() => goToPage(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages || loading || tabLoading}
                  className="px-3 py-1 border border-gray-300 rounded-r-lg disabled:opacity-50"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {activeConversation && (view === 'chat') && (
        <div className={`${isMobile ? 'w-full' : 'flex-1'}`}>
          <ActiveChatArea 
            conversation={activeConversation}
            onJoin={handleJoinChat}
            onBack={handleCloseChat}
            onSendMessage={handleSendMessage}
            onShowUserInfo={handleShowUserInfo}
            onCloseConversation={handleCloseConversation}
            getAvatarBg={getAvatarBg}
          />
        </div>
      )}

      {activeConversation && (view === 'info') && (
        <div className={`${isMobile ? 'w-full' : 'flex-1'}`}>
          <CustomerInfo 
            conversation={activeConversation} 
            onBack={handleBackToChat}
            getAvatarBg={getAvatarBg}
          />
        </div>
      )}
      
      {(!activeConversation || activeConversationId === null) && !isMobile && (
        <div className="flex items-center justify-center flex-1 bg-gray-50">
          <div className="text-center">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full">
              <i className="text-2xl text-gray-400 fas fa-inbox"></i>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-700">Select a conversation</h3>
            <p className="max-w-sm px-4 text-gray-500">Choose a conversation from the list to view messages and respond to your customers</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox;