import axios from 'axios';

const API_URL = "https://adminer.palestinesrelief.org/api";

const conversationService = {
  // Get all conversations with optional filters
  getConversations: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      
      const response = await axios.get(`${API_URL}/conversations?${queryParams}`);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },

  // Get a single conversation with messages
  getConversation: async (conversationId) => {
    try {
      const response = await axios.get(`${API_URL}/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching conversation ${conversationId}:`, error);
      throw error;
    }
  },

  // Send a message in a conversation
  sendMessage: async (conversationId, content, file = null) => {
    try {
      // If no file, use simple JSON post
      if (!file) {
        const response = await axios.post(`${API_URL}/conversations/${conversationId}/messages`, { content });
        return response.data;
      }
      
      // If there's a file, use FormData
      const formData = new FormData();
      formData.append('content', content);
      formData.append('file', file);
      
      const response = await axios.post(`${API_URL}/conversations/${conversationId}/messages`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error sending message to conversation ${conversationId}:`, error);
      throw error;
    }
  },

  // Close a conversation
  closeConversation: async (conversationId, reason = '') => {
    try {
      const response = await axios.post(`${API_URL}/conversations/${conversationId}/close`, { reason });
      return response.data;
    } catch (error) {
      console.error(`Error closing conversation ${conversationId}:`, error);
      throw error;
    }
  },

  // Reopen a closed conversation
  reopenConversation: async (conversationId) => {
    try {
      const response = await axios.post(`${API_URL}/conversations/${conversationId}/reopen`);
      return response.data;
    } catch (error) {
      console.error(`Error reopening conversation ${conversationId}:`, error);
      throw error;
    }
  },

  // Archive a conversation
  archiveConversation: async (conversationId) => {
    try {
      const response = await axios.post(`${API_URL}/conversations/${conversationId}/archive`);
      return response.data;
    } catch (error) {
      console.error(`Error archiving conversation ${conversationId}:`, error);
      throw error;
    }
  }
};

export default conversationService;