// src/features/modules/components/api.js
import { Platform } from 'react-native';
export const API_URL = 'http://localhost:5000/api';
let Constants = null;
try {
  Constants = require('expo-constants').default;
} catch (error) {
  console.log('Could not import expo-constants:', error);
}

// Get base URL based on platform and environment
const getBaseUrl = () => {
  // Try to get IP from Expo if available
  try {
    // For Expo on physical devices
    if (Constants?.manifest?.debuggerHost) {
      // Get the IP address from Expo's debuggerHost
      const hostIp = Constants.manifest.debuggerHost.split(':').shift();
      return `http://${hostIp}:8000`;
    }

    // For newer Expo SDK versions
    if (Constants?.expoConfig?.hostUri) {
      const hostIp = Constants.expoConfig.hostUri.split(':').shift();
      return `http://${hostIp}:8000`;
    }
  } catch (error) {
    console.log('Error accessing Expo Constants:', error);
  }

  // Default cases for simulators/emulators
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:8000';
  } else {
    return 'http://localhost:8000';
  }
};

// Parse response to handle NaN values
const parseResponse = async (response) => {
  const text = await response.text();
  // Replace NaN, Infinity values before parsing
  const sanitizedText = text
    .replace(/: NaN/g, ': null')
    .replace(/: Infinity/g, ': null')
    .replace(/: -Infinity/g, ': null');

  try {
    return JSON.parse(sanitizedText);
  } catch (error) {
    console.error('Error parsing response:', error);
    throw new Error('Invalid JSON response');
  }
};

// API methods using fetch
const api = {
  // Base URL for API requests
  baseUrl: getBaseUrl(),

  // GET request
  get: async (endpoint) => {
    try {
      const url = `${api.baseUrl}${endpoint}`;
      console.log(`Making GET request to: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await parseResponse(response);
      return { data, status: response.status, statusText: response.statusText };
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  },

  // POST request
  post: async (endpoint, body) => {
    try {
      const response = await fetch(`${api.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await parseResponse(response);
      return { data, status: response.status, statusText: response.statusText };
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  },

  // PUT request
  put: async (endpoint, body) => {
    try {
      const response = await fetch(`${api.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await parseResponse(response);
      return { data, status: response.status, statusText: response.statusText };
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  },

  // DELETE request
  delete: async (endpoint) => {
    try {
      const response = await fetch(`${api.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await parseResponse(response);
      return { data, status: response.status, statusText: response.statusText };
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }
};

export default api;