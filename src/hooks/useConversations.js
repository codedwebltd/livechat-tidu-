import { useState, useEffect } from 'react';

export const useConversations = () => {
  // Sample data - this will be replaced with API calls
  const initialConversations = [
    {
      id: 'conv1',
      name: 'Drew',
      initial: 'D',
      avatarColor: 'yellow',
      type: 'Live chat',
      lastMessage: '?',
      lastMessageTime: '19d',
      state: 'pending'
    },
    {
      id: 'conv2',
      name: 'Quinn',
      initial: 'Q',
      avatarColor: 'purple',
      type: 'Live chat',
      lastMessage: "what's a good first step...",
      lastMessageTime: '20d',
      state: 'active'
    }
  ];

  const [conversations, setConversations] = useState(initialConversations);

  // Update conversation state (pending/active)
  const updateConversationState = (conversationId, newState) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, state: newState } 
          : conv
      )
    );
    
    // In the future: Add API call to update state
    // fetch(`/api/conversations/${conversationId}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ state: newState })
    // });
  };

  // Send a message
  const sendMessage = (conversationId, messageText) => {
    // Add message to the conversation
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { 
              ...conv, 
              lastMessage: messageText,
              lastMessageTime: 'now'
            } 
          : conv
      )
    );
    
    // In the future: Add API call to send message
    // fetch(`/api/conversations/${conversationId}/messages`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ text: messageText })
    // });
  };

  return {
    conversations,
    updateConversationState,
    sendMessage
  };
};

export default useConversations;