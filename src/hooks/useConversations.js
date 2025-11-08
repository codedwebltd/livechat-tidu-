import { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/authService';

export const useConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'open',
    search: '',
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1
  });

  const API_URL = "https://adminer.palestinesrelief.org/api";

  // Fetch conversations from API
  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        status: filters.status,
        page: filters.page,
        limit: filters.limit
      });
      
      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      
      const response = await axios.get(`${API_URL}/conversations?${queryParams}`);
      
      if (response.data.status === 'success') {
        // Transform API data to match our UI needs
        const transformedData = response.data.conversations.map(conv => ({
          id: conv.id,
          name: conv.visitor_name || `Visitor ${conv.id.toString().slice(-4)}`,
          initial: getInitial(conv.visitor_name),
          avatarColor: getAvatarColor(conv.id),
          type: 'Live chat',
          lastMessage: conv.last_message?.content || conv.first_message || 'New conversation',
          lastMessageTime: formatTimestamp(conv.last_message_at || conv.created_at),
          state: conv.status === 'open' ? 'active' : conv.status,
          status: conv.status,
          isRead: conv.is_read,
          hasNewMessages: conv.has_new_messages,
          visitorEmail: conv.visitor_email,
          createdAt: conv.created_at,
          visitorInfo: {
            ip: conv.visitor_ip,
            userAgent: conv.visitor_user_agent,
            location: conv.meta_data?.location,
            referrer: conv.visitor_referrer
          }
        }));
        
        setConversations(transformedData);
        
        // Update pagination info
        setPagination({
          total: response.data.total,
          totalPages: response.data.total_pages,
          currentPage: response.data.page
        });
      } else {
        setError('Failed to fetch conversations');
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to fetch conversations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get avatar color based on ID
  const getAvatarColor = (id) => {
    const colors = ['blue', 'green', 'purple', 'red', 'yellow', 'indigo', 'pink', 'gray'];
    const hash = id.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };
  
  // Helper function to get initial from name
  const getInitial = (name) => {
    if (!name) return 'V';
    return name.charAt(0).toUpperCase();
  };
  
  // Helper function to format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 30) {
      return `${Math.floor(diffDay / 30)}mo`;
    } else if (diffDay > 0) {
      return `${diffDay}d`;
    } else if (diffHour > 0) {
      return `${diffHour}h`;
    } else if (diffMin > 0) {
      return `${diffMin}m`;
    } else {
      return 'now';
    }
  };

  // Update conversation state (pending/active)
  const updateConversationState = async (conversationId, newState) => {
    try {
      let endpoint;
      let method = 'PUT';
      
      // Map UI states to API endpoints
      if (newState === 'active' && conversations.find(c => c.id === conversationId)?.status === 'closed') {
        endpoint = `${API_URL}/conversations/${conversationId}/reopen`;
        method = 'POST';
      } else if (newState === 'closed') {
        endpoint = `${API_URL}/conversations/${conversationId}/close`;
        method = 'POST';
      } else if (newState === 'archived') {
        endpoint = `${API_URL}/conversations/${conversationId}/archive`;
        method = 'POST';
      }
      
      if (!endpoint) return;
      
      // Update optimistically
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, state: newState, status: newState } 
            : conv
        )
      );
      
      // Send API request
      await axios({
        method,
        url: endpoint
      });
      
      // Refresh data
      fetchConversations();
      
    } catch (error) {
      console.error('Error updating conversation state:', error);
      // Revert on failure
      fetchConversations();
    }
  };

  // Send a message
  const sendMessage = async (conversationId, messageText) => {
    try {
      // Add message optimistically
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
      
      // Send message to API
      await axios.post(`${API_URL}/conversations/${conversationId}/messages`, {
        content: messageText
      });
      
      // No need to refresh the whole list immediately
      // The real-time updates will handle this if WebSockets are implemented
      
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  // Update filters and refetch
  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.hasOwnProperty('status') || newFilters.hasOwnProperty('search') ? 1 : newFilters.page || prev.page
    }));
  };
  
  // Search conversations
  const searchConversations = (query) => {
    updateFilters({ search: query, page: 1 });
  };
  
  // Change conversation status filter
  const filterByStatus = (status) => {
    updateFilters({ status, page: 1 });
  };
  
  // Pagination navigation
  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      updateFilters({ page });
    }
  };

  // Fetch conversations when component mounts or filters change
  useEffect(() => {
    if (authService.isAuthenticated()) {
      fetchConversations();
    }
  }, [filters]);

  return {
    conversations,
    loading,
    error,
    pagination,
    updateConversationState,
    sendMessage,
    searchConversations,
    filterByStatus,
    goToPage,
    refreshConversations: fetchConversations
  };
};

export default useConversations;