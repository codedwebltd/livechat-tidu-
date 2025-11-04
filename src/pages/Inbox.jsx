import React, { useState, useEffect } from 'react';
import { useConversations } from '../hooks/useConversations';
import ActiveChatArea from '../components/ActiveChatArea';
import CustomerInfo from '../components/CustomerInfo';

const Inbox = () => {
  // Get conversation data from our hook
  const { 
    conversations, 
    updateConversationState,
    sendMessage
  } = useConversations();
  
  // State for UI management
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [view, setView] = useState('list'); // 'list', 'chat', or 'info'
  
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
  const handleSendMessage = (conversationId, text) => {
    sendMessage(conversationId, text);
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
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <i className="fas fa-ellipsis-v text-gray-600"></i>
              </button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                placeholder="Search in Inbox..." 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium">
                👋 Unassigned
              </button>
              <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
                All
              </button>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <div 
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
                className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-all duration-150 ${
                  activeConversationId === conversation.id 
                    ? 'bg-blue-50 border-l-4 border-l-blue-600' 
                    : 'border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative flex-shrink-0">
                    <div 
                      className={`w-12 h-12 rounded-full ${getAvatarBg(conversation.avatarColor)} flex items-center justify-center text-white font-bold shadow-sm`}
                    >
                      {conversation.initial}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{conversation.name}</h3>
                      <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{conversation.type}</p>
                    <p className="text-sm text-gray-700 truncate">{conversation.lastMessage}</p>
                  </div>
                </div>
              </div>
            ))}
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