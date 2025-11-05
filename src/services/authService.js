// src/services/authService.js

import axios from 'axios';

// Get base URL from .env file
//const API_URL = process.env.REACT_APP_API_URL || '';

const API_URL = "http://adminer.palestinesrelief.org/api"; 

const authService = {
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      
      if (response.data.status === 'success') {
        // Save token and user data to sessionStorage
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        sessionStorage.setItem('onboarding_completed', response.data.onboarding_completed);
        
        // Start token validation check
        authService.startTokenValidation();
        
        return { success: true, data: response.data };
      } else {
        return { 
          success: false, 
          message: response.data.message || 'Registration failed'
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors
      };
    }
  },

  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      
      if (response.data.status === 'success') {
        // Save token and user data to sessionStorage
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        sessionStorage.setItem('onboarding_completed', response.data.onboarding_completed);
        
        // Start token validation check
        authService.startTokenValidation();
        
        return { success: true, data: response.data };
      } else {
        return { 
          success: false, 
          message: response.data.message || 'Login failed'
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed'
      };
    }
  },

  logout: () => {
    // Stop token validation
    authService.stopTokenValidation();
    
    // Clear storage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('onboarding_completed');
    
    return { success: true };
  },

  getCurrentUser: () => {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  getUserData: (field = null) => {
    const user = sessionStorage.getItem('user');
    if (!user) return null;
    
    const userData = JSON.parse(user);
    
    // If no specific field requested, return all user data
    if (!field) return userData;
    
    // Handle nested properties using dot notation
    if (field.includes('.')) {
      const parts = field.split('.');
      let value = userData;
      
      for (const part of parts) {
        if (!value || typeof value !== 'object') return null;
        value = value[part];
      }
      
      return value;
    }
    
    // Return specific field if it exists
    return userData[field] || null;
  },
  
  isOnboardingCompleted: () => {
    const completed = sessionStorage.getItem('onboarding_completed');
    return completed === 'true' || completed === true;
  },

  isAuthenticated: () => {
    return !!sessionStorage.getItem('token');
  },

  getToken: () => {
    return sessionStorage.getItem('token');
  },
  
  // Token validation interval ID
  tokenValidationInterval: null,
  
  // Validate token against backend
  validateToken: async () => {
    try {
      // Skip validation if no token exists
      if (!authService.isAuthenticated()) {
        authService.stopTokenValidation();
        return false;
      }
      
      // Call validate-token endpoint
      await axios.get(`${API_URL}/validate-token`);
      return true;
    } catch (error) {
      // If 401 or other error, token is invalid
      console.log('Token validation failed:', error);
      
      // Clear session and stop validation
      authService.logout();
      
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      
      return false;
    }
  },
  
  // Start periodic token validation
  startTokenValidation: (interval = 1) => {
    // Clear any existing interval
    authService.stopTokenValidation();
    
    // Set new interval (in minutes)
    const minutes = interval * 60 * 1000;
    authService.tokenValidationInterval = setInterval(
      authService.validateToken, 
      minutes
    );
    
    // Run initial validation
    authService.validateToken();
  },
  
  // Stop token validation
  stopTokenValidation: () => {
    if (authService.tokenValidationInterval) {
      clearInterval(authService.tokenValidationInterval);
      authService.tokenValidationInterval = null;
    }
  },

  // Onboarding methods
  getOnboardingData: async () => {
    try {
      const response = await axios.get(`${API_URL}/onboarding`);
      return response.data.onboarding;
    } catch (error) {
      console.error('Error fetching onboarding data:', error);
      return null;
    }
  },

  updateOnboarding: async (onboardingData) => {
    try {
      const response = await axios.post(`${API_URL}/onboarding/update`, onboardingData);
      
      if (response.data.status === 'success') {
        // Update the user object in session storage to include the latest onboarding data
        const user = authService.getCurrentUser();
        if (user) {
          user.onboarding = response.data.onboarding;
          if (response.data.onboarding.completed) {
            user.onboarding_completed = true;
            sessionStorage.setItem('onboarding_completed', true);
          }
          sessionStorage.setItem('user', JSON.stringify(user));
        }
        
        return { success: true, data: response.data.onboarding };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Error updating onboarding:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update onboarding'
      };
    }
  },

  skipOnboarding: async () => {
    try {
      const response = await axios.post(`${API_URL}/onboarding/skip`);
      
      if (response.data.status === 'success') {
        // Update user data to reflect onboarding completion
        const user = authService.getCurrentUser();
        if (user) {
          user.onboarding_completed = true;
          sessionStorage.setItem('user', JSON.stringify(user));
          sessionStorage.setItem('onboarding_completed', true);
        }
        
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Error skipping onboarding:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to skip onboarding'
      };
    }
  },

  // Setup axios interceptor for adding token to requests
  setupAxiosInterceptors: () => {
    // Request interceptor - add token to all requests
    axios.interceptors.request.use(
      (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    
    // Response interceptor - handle 401 errors globally
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // If 401 Unauthorized, clear session and redirect
        if (error.response && error.response.status === 401) {
          authService.logout();
          
          // Only redirect if not already on login page
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }
};

export default authService;