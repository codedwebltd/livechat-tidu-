import React, { useState, useEffect } from 'react';
import { useConversations } from '../hooks/useConversations';
import ActiveChatArea from '../components/ActiveChatArea';
import CustomerInfo from '../components/CustomerInfo';

const Inbox = () => {
  // Get conversation data from our hook with real API data
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
  
  // State for UI management
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [view, setView] = useState('list'); // 'list', 'chat', or 'info'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('open');
  const [tabLoading, setTabLoading] = useState(false);
  
  // Get the active conversation
  const activeConversation = conversations.find(conv => conv.id === activeConversationId);

  // Detect mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Refresh data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (view === 'list') {
        refreshConversations();
      }
    }, 8000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [refreshConversations, view]);

  // Select a conversation
  const handleSelectConversation = (id) => {
    setActiveConversationId(id);
    if (isMobile) {
      setView('chat');
    } else {
      setView('chat');
    }
  };

  // Close the active chat
  const handleCloseChat = () => {
    if (isMobile) {
      setView('list');
    } else {
      setActiveConversationId(null);
    }
  };

  // Show user info
  const handleShowUserInfo = () => {
    setView('info');
  };

  // Back to chat from info
  const handleBackToChat = () => {
    setView('chat');
  };

  // Join a pending chat
  const handleJoinChat = (id) => {
    updateConversationState(id, 'active');
  };

  // Send a message
  const handleSendMessage = async (conversationId, text) => {
    await sendMessage(conversationId, text);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setTabLoading(true);
    searchConversations(searchQuery);
    setTimeout(() => setTabLoading(false), 500);
  };

  // Handle filter change
  const handleFilterChange = (status) => {
    // Don't do anything if we're already on this filter
    if (status === activeFilter) return;
    
    // Set loading state
    setTabLoading(true);
    
    // Update UI
    setActiveFilter(status);
    
    // Apply filter
    filterByStatus(status);
    
    // Reset loading state after a delay
    // This ensures we show the spinner for at least a brief moment for better UX
    setTimeout(() => {
      setTabLoading(false);
    }, 500);
  };

  // Manual refresh
  const handleManualRefresh = () => {
    setTabLoading(true);
    refreshConversations().then(() => {
      setTimeout(() => {
        setTabLoading(false);
      }, 300);
    });
  };

  // Get avatar background color
  const getAvatarBg = (color) => {
    const colorMap = {
      'yellow': 'bg-yellow-500',
      'blue': 'bg-blue-500',
      'green': 'bg-green-500',
      'red': 'bg-red-500',
      'purple': 'bg-purple-500',
      'indigo': 'bg-indigo-500',
      'pink': 'bg-pink-500',
      'gray': 'bg-gray-500'
    };
    return colorMap[color] || 'bg-blue-500';
  };

  return (
    <div className="h-[calc(100vh-73px)] flex overflow-hidden bg-gray-50">
      {/* Conversations List */}
      <div className={`${(isMobile && (view === 'chat' || view === 'info')) ? 'hidden' : 'w-full md:w-96'} border-r border-gray-200`}>
        <div className="bg-white h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-gray-900">Inbox</h2>
              <button 
                onClick={handleManualRefresh}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title="Refresh"
                disabled={loading || tabLoading}
              >
                <i className={`fas fa-sync-alt text-gray-600 ${(loading || tabLoading) ? 'animate-spin' : ''}`}></i>
              </button>
            </div>
            
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                placeholder="Search in Inbox..." 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Filter Tabs */}
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
              
              {/* Tab loading spinner */}
              {tabLoading && (
                <div className="ml-2 flex-shrink-0">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {loading && conversations.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-600">
                <p>{error}</p>
                <button 
                  onClick={refreshConversations}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Try Again
                </button>
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-600 flex flex-col items-center py-10">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-inbox text-gray-400 text-xl"></i>
                </div>
                <p>No {activeFilter} conversations found</p>
              </div>
            ) : (
              conversations.map((conversation) => (
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
                      <div 
                        className={`w-12 h-12 rounded-full ${getAvatarBg(conversation.avatarColor)} flex items-center justify-center text-white font-bold shadow-sm`}
                      >
                        {conversation.initial}
                      </div>
                      {conversation.state === 'active' && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {conversation.name}
                          {!conversation.isRead && conversation.hasNewMessages && (
                            <span className="ml-2 w-2 h-2 inline-block bg-blue-600 rounded-full"></span>
                          )}
                        </h3>
                        <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{conversation.type}</p>
                      <p className="text-sm text-gray-700 truncate">{conversation.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {/* Pagination - show if needed */}
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
      
      {/* Active Chat Area */}
      {activeConversation && (view === 'chat') && (
        <div className={`${isMobile ? 'w-full' : 'flex-1'}`}>
          <ActiveChatArea 
            conversation={activeConversation}
            onJoin={handleJoinChat}
            onBack={handleCloseChat}
            onSendMessage={handleSendMessage}
            onShowUserInfo={handleShowUserInfo}
            getAvatarBg={getAvatarBg}
          />
        </div>
      )}

      {/* Customer Info Panel */}
      {activeConversation && (view === 'info') && (
        <div className={`${isMobile ? 'w-full' : 'flex-1'}`}>
          <CustomerInfo 
            conversation={activeConversation} 
            onBack={handleBackToChat}
            getAvatarBg={getAvatarBg}
          />
        </div>
      )}
      
      {/* Empty State */}
      {(!activeConversation || activeConversationId === null) && !isMobile && (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <i className="fas fa-inbox text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a conversation</h3>
            <p className="text-gray-500 max-w-sm px-4">Choose a conversation from the list to view messages and respond to your customers</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox;