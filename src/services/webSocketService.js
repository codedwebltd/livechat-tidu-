import Pusher from 'pusher-js';
import authService from '../services/authService';

// WebSocket service for real-time communication
class WebSocketService {
  constructor() {
    this.pusher = null;
    this.channels = {};
    this.initialized = false;
    this.typingTimeouts = {};
  }

  // Initialize Pusher connection
  initialize() {
    if (this.initialized) return;
    
    this.pusher = new Pusher('38b5c6c6e09853ed572a', {
      cluster: 'eu',
      encrypted: true
    });
    
    this.initialized = true;
    console.log('WebSocket service initialized');
  }

  // Subscribe to a conversation channel
  subscribeToConversation(conversationId, callbacks = {}) {
    if (!this.initialized) this.initialize();
    
    // Channel name format matches the one used in the PHP backend
    const channelName = `conversation.${conversationId}`;
    
    // Check if already subscribed
    if (this.channels[channelName]) {
      console.log(`Already subscribed to channel: ${channelName}`);
      return this.channels[channelName];
    }
    
    // Subscribe to the channel
    const channel = this.pusher.subscribe(channelName);
    
    // Store channel reference
    this.channels[channelName] = channel;
    
    // Add event listeners
    channel.bind('pusher:subscription_succeeded', () => {
      console.log(`Subscribed to channel: ${channelName}`);
      if (callbacks.onSubscribed) callbacks.onSubscribed();
    });
    
    channel.bind('pusher:subscription_error', (error) => {
      console.error(`Error subscribing to channel: ${channelName}`, error);
      if (callbacks.onError) callbacks.onError(error);
    });
    
    // Bind to new-message event
    channel.bind('new-message', (data) => {
      console.log('New message received:', data);
      if (callbacks.onNewMessage) callbacks.onNewMessage(data);
    });
    
    // Bind to typing event
    channel.bind('typing', (data) => {
      console.log('Typing indicator received:', data);
      
      // For agent dashboard: show typing for visitors (non-agents)
      if (data.sender_type === 'visitor' || data.sender_type === 'bot') {
        if (callbacks.onTyping) callbacks.onTyping(data);
      }
    });
    
    return channel;
  }

  // Unsubscribe from a conversation channel
  unsubscribeFromConversation(conversationId) {
    const channelName = `conversation.${conversationId}`;
    
    if (this.channels[channelName]) {
      this.pusher.unsubscribe(channelName);
      delete this.channels[channelName];
      console.log(`Unsubscribed from channel: ${channelName}`);
    }
  }

  // Send a typing indicator
  sendTypingIndicator(conversationId, isTyping) {
    const API_URL = "https://adminer.palestinesrelief.org/api";
    
    // Get user ID for logging only
    const user_id = authService.getUserData('id');
    console.log("User ID from authService:", user_id);
    
    // Clear any existing timeout
    if (this.typingTimeouts[conversationId]) {
      clearTimeout(this.typingTimeouts[conversationId]);
      delete this.typingTimeouts[conversationId];
    }
    
    // If typing, set a timeout to automatically clear the indicator after 3 seconds
    if (isTyping) {
      this.typingTimeouts[conversationId] = setTimeout(() => {
        this.sendTypingIndicator(conversationId, false);
      }, 3000);
    }
    
   const token = authService.getToken();
// Send typing status to the server
fetch(`${API_URL}/typing`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    conversation_id: conversationId,
    is_typing: isTyping
  })
}).catch(err => {
  console.error('Error sending typing status:', err);
});
  }

  // Clean up on component unmount
  cleanup() {
    // Unsubscribe from all channels
    Object.keys(this.channels).forEach(channelName => {
      this.pusher.unsubscribe(channelName);
    });
    
    // Clear all typing timeouts
    Object.keys(this.typingTimeouts).forEach(id => {
      clearTimeout(this.typingTimeouts[id]);
    });
    
    // Disconnect Pusher
    if (this.pusher) {
      this.pusher.disconnect();
      this.initialized = false;
    }
    
    this.channels = {};
    this.typingTimeouts = {};
  }
}

// Create a singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;
