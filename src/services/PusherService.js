import Pusher from 'pusher-js';
import authService from './authService';

/**
 * Clean Pusher Service with MULTIPLE callback support
 */
class PusherService {
  constructor() {
    this.pusher = null;
    this.channels = {};
    this.channelCallbacks = {}; // Store multiple callbacks per channel
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) {
      console.log('Pusher already initialized');
      return;
    }
    
    if (process.env.NODE_ENV === 'development') {
      Pusher.logToConsole = true;
    }
    
    this.pusher = new Pusher('38b5c6c6e09853ed572a', {
      cluster: 'eu',
      encrypted: true
    });
    
    this.initialized = true;
    console.log('✅ Pusher initialized');
    
    this.pusher.connection.bind('state_change', (states) => {
      console.log(`Pusher: ${states.previous} → ${states.current}`);
    });
    
    this.pusher.connection.bind('connected', () => {
      console.log('✅ Pusher connected');
    });
    
    this.pusher.connection.bind('error', (error) => {
      console.error('❌ Pusher error:', error);
    });
  }

  subscribeToConversation(conversationId, callbacks = {}) {
    if (!this.initialized) this.initialize();
    
    const channelName = `conversation.${conversationId}`;
    
    // Generate unique callback ID
    const callbackId = Math.random().toString(36).substring(7);
    
    // Initialize callback storage for this channel
    if (!this.channelCallbacks[channelName]) {
      this.channelCallbacks[channelName] = {};
    }
    
    // Store these callbacks
    this.channelCallbacks[channelName][callbackId] = callbacks;
    console.log(`📝 Stored callbacks for ${channelName} (ID: ${callbackId})`);
    
    // Subscribe to channel if not already subscribed
    if (!this.channels[channelName]) {
      console.log(`📡 Subscribing to: ${channelName}`);
      const channel = this.pusher.subscribe(channelName);
      
      this.channels[channelName] = channel;
      
      channel.bind('pusher:subscription_succeeded', () => {
        console.log(`✅ Subscribed to: ${channelName}`);
        
        // Notify all subscribers
        Object.values(this.channelCallbacks[channelName] || {}).forEach(cb => {
          if (cb.onSubscribed) cb.onSubscribed();
        });
      });
      
      channel.bind('pusher:subscription_error', (error) => {
        console.error(`❌ Subscription error for ${channelName}:`, error);
        
        // Notify all subscribers
        Object.values(this.channelCallbacks[channelName] || {}).forEach(cb => {
          if (cb.onError) cb.onError(error);
        });
      });
      
      // Listen for new messages - Standard format
      channel.bind('new-message', (data) => {
        console.log(`💬 New message on ${channelName}:`, data);
        
        // Call ALL registered callbacks
        Object.values(this.channelCallbacks[channelName] || {}).forEach(cb => {
          if (cb.onNewMessage) cb.onNewMessage(data);
        });
      });
      
      // Listen for new messages - Laravel Event format
      channel.bind('App\\Events\\NewMessage', (data) => {
        console.log(`💬 New message (Laravel) on ${channelName}:`, data);
        
        if (data.message) {
          // Call ALL registered callbacks
          Object.values(this.channelCallbacks[channelName] || {}).forEach(cb => {
            if (cb.onNewMessage) cb.onNewMessage(data.message);
          });
        }
      });
      
      // Listen for typing indicators
      channel.bind('typing', (data) => {
        console.log(`📝 Typing on ${channelName}:`, data);
        
        if (data.sender_type === 'visitor') {
          // Call ALL registered callbacks
          Object.values(this.channelCallbacks[channelName] || {}).forEach(cb => {
            if (cb.onTyping) cb.onTyping(data);
          });
        }
      });
    } else {
      console.log(`✅ Already subscribed to: ${channelName}, added new callbacks`);
    }
    
    // Return callback ID so it can be unsubscribed later
    return callbackId;
  }

  unsubscribeFromConversation(conversationId, callbackId = null) {
    const channelName = `conversation.${conversationId}`;
    
    if (callbackId && this.channelCallbacks[channelName]) {
      // Remove specific callback
      delete this.channelCallbacks[channelName][callbackId];
      console.log(`🔌 Removed callback ${callbackId} from ${channelName}`);
      
      // If no more callbacks, unsubscribe from channel
      if (Object.keys(this.channelCallbacks[channelName]).length === 0) {
        delete this.channelCallbacks[channelName];
        
        if (this.channels[channelName]) {
          this.pusher.unsubscribe(channelName);
          delete this.channels[channelName];
          console.log(`🔌 Fully unsubscribed from: ${channelName}`);
        }
      }
    } else {
      // Remove all callbacks and unsubscribe
      delete this.channelCallbacks[channelName];
      
      if (this.channels[channelName]) {
        this.pusher.unsubscribe(channelName);
        delete this.channels[channelName];
        console.log(`🔌 Fully unsubscribed from: ${channelName}`);
      }
    }
  }

  sendTypingIndicator(conversationId, isTyping) {
    const API_URL = "https://adminer.palestinesrelief.org/api";
    const token = authService.getToken();
    
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
      console.error('Error sending typing indicator:', err);
    });
  }

  cleanup() {
    console.log('🧹 Cleaning up Pusher...');
    
    Object.keys(this.channels).forEach(channelName => {
      this.pusher.unsubscribe(channelName);
    });
    
    if (this.pusher) {
      this.pusher.disconnect();
      this.initialized = false;
    }
    
    this.channels = {};
    this.channelCallbacks = {};
    console.log('✅ Pusher cleaned up');
  }
}

const pusherService = new PusherService();

export default pusherService;