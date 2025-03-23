import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from './authService';

// API base URL - use the same logic as the authService for consistency
const getApiUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://192.168.1.2:5000/api'; // For Android emulator
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:8080/api'; // For iOS simulator
  } else {
    // For physical devices, use your actual IP or domain
    return 'http://192.168.1.2:8080/api';
  }
};

// Create a function to get the auth header
const getAuthHeader = async () => {
  const token = await authService.getAccessToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

/**
 * Ticket Service - Handles all ticket-related API calls
 */
class TicketService {
  /**
   * Get all tickets for the current user
   * @returns {Promise<Object>} Response with tickets data
   */
  async getUserTickets() {
    try {
      // Check if user is authenticated
      if (!await authService.isAuthenticated()) {
        throw new Error('Authentication required');
      }
      
      // Get auth headers
      const headers = await getAuthHeader();
      
      const response = await fetch(`${getApiUrl()}/ticket/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
          'x-client-type': 'mobile'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch tickets');
      }
      
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Tickets fetched successfully'
      };
    } catch (error) {
      console.error('Error in getUserTickets:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch tickets'
      };
    }
  }
  
  /**
   * Get a single ticket by ID
   * @param {string} ticketId - The ID of the ticket to fetch
   * @returns {Promise<Object>} Response with ticket data
   */
  async getTicket(ticketId) {
    try {
      // Check if user is authenticated
      if (!await authService.isAuthenticated()) {
        throw new Error('Authentication required');
      }
      
      // Get auth headers
      const headers = await getAuthHeader();
      
      const response = await fetch(`${getApiUrl()}/ticket/${ticketId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
          'x-client-type': 'mobile'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch ticket');
      }
      
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Ticket fetched successfully'
      };
    } catch (error) {
      console.error('Error in getTicket:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch ticket'
      };
    }
  }
  
  /**
   * Create a new ticket
   * @param {Object} ticketData - The ticket data to submit
   * @returns {Promise<Object>} Response with created ticket
   */
  async createTicket(ticketData) {
    try {
      if (!await authService.isAuthenticated()) {
        throw new Error('Authentication required');
      }
  
      const headers = await getAuthHeader();
      const userData = await authService.getUser();
  
      // Enhanced priority mapping with validation
      const priorityMap = {
        Low: 'low',
        Medium: 'medium',
        High: 'high',
        Urgent: 'urgent'
      };
  
      // Normalize input priority (case-insensitive)
      const inputPriority = ticketData.priority?.trim() || '';
      const normalizedPriority = inputPriority.charAt(0).toUpperCase() + 
                                inputPriority.slice(1).toLowerCase();
  
      // Validate against backend enum
      const validPriorities = new Set(['low', 'medium', 'high', 'urgent']);
      const mappedPriority = priorityMap[normalizedPriority] || 'medium';
      
      if (!validPriorities.has(mappedPriority)) {
        throw new Error(`Invalid priority value: ${ticketData.priority}`);
      }
  
      const payload = {
        ...ticketData,
        priority: mappedPriority,
        userId: userData?.id || userData?._id || userData?.uid,
        clientType: 'mobile',
        // Add automatic timestamps
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
  
      const response = await fetch(`${getApiUrl()}/ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
          'x-client-type': 'mobile',
          'x-priority-level': mappedPriority // Optional header for backend filtering
        },
        body: JSON.stringify(payload)
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        const errorMessage = data.message || 
          `Ticket creation failed (HTTP ${response.status})`;
        throw new Error(errorMessage);
      }
  
      // Add client-side cache update
      if (this.cache) {
        this.cache.updateQuery('tickets', (old) => 
          [...(old || []), data.data]
        );
      }
  
      return {
        success: true,
        data: data.data,
        message: data.message || 'Ticket created successfully',
        priorityUsed: mappedPriority // Feedback about actual priority used
      };
  
    } catch (error) {
      console.error('TicketService Error:', error);
      
      // Automatic retry for network errors
      if (error.message.includes('Network')) {
        console.warn('Queueing ticket for retry...');
        this.retryQueue.add(ticketData);
      }
  
      return {
        success: false,
        message: error.message,
        originalPriority: ticketData.priority,
        mappedPriority: mappedPriority // Include in error response
      };
    }
  }
  
  /**
   * Reply to an existing ticket
   * @param {string} ticketId - The ID of the ticket to reply to
   * @param {string} content - The reply content
   * @returns {Promise<Object>} Response with updated ticket
   */
  async replyToTicket(ticketId, content) {
    try {
      // Check if user is authenticated
      if (!await authService.isAuthenticated()) {
        throw new Error('Authentication required');
      }
      
      // Get auth headers
      const headers = await getAuthHeader();
      
      // Get user data
      const userData = await authService.getUser();
      
      const response = await fetch(`${getApiUrl()}/ticket/${ticketId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
          'x-client-type': 'mobile'
        },
        body: JSON.stringify({ 
          content,
          userId: userData?.id || userData?._id || userData?.uid,
          clientType: 'mobile' 
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reply');
      }
      
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Reply sent successfully'
      };
    } catch (error) {
      console.error('Error in replyToTicket:', error);
      return {
        success: false,
        message: error.message || 'Failed to send reply'
      };
    }
  }
  
  /**
   * Update a ticket's status
   * @param {string} ticketId - The ID of the ticket to update
   * @param {string} status - The new status (open, in-progress, resolved, closed)
   * @returns {Promise<Object>} Response with updated ticket
   */
  async updateTicketStatus(ticketId, status) {
    try {
      // Check if user is authenticated
      if (!await authService.isAuthenticated()) {
        throw new Error('Authentication required');
      }
      
      // Get auth headers
      const headers = await getAuthHeader();
      
      const response = await fetch(`${getApiUrl()}/ticket/${ticketId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
          'x-client-type': 'mobile'
        },
        body: JSON.stringify({ 
          status,
          clientType: 'mobile' 
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update ticket status');
      }
      
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Ticket status updated successfully'
      };
    } catch (error) {
      console.error('Error in updateTicketStatus:', error);
      return {
        success: false,
        message: error.message || 'Failed to update ticket status'
      };
    }
  }
  
  /**
   * Check if network is available
   * @returns {Promise<boolean>} True if network is available
   */
  async checkNetwork() {
    return await authService.checkNetwork();
  }
}

export default new TicketService();