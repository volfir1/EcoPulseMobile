// src/features/modules/components/api.js
import { Platform } from 'react-native';

// Python backend port
const PYTHON_API_PORT = 8000;

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
      return `http://${hostIp}:${PYTHON_API_PORT}`; // Use Python backend port
    }

    // For newer Expo SDK versions
    if (Constants?.expoConfig?.hostUri) {
      const hostIp = Constants.expoConfig.hostUri.split(':').shift();
      return `http://${hostIp}:${PYTHON_API_PORT}`; // Use Python backend port
    }
  } catch (error) {
    console.log('Error accessing Expo Constants:', error);
  }

  // Default cases for simulators/emulators
  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${PYTHON_API_PORT}`; // For Android emulator
  } else if (Platform.OS === 'ios') {
    return `http://localhost:${PYTHON_API_PORT}`; // For iOS simulator
  } else {
    return `http://127.0.0.1:${PYTHON_API_PORT}`; // For web/development
  }
};

// Dynamic API URL that's determined at runtime based on environment
// For Python backends, we might not need '/api' prefix
export const API_URL = `${getBaseUrl()}`;

// Parse response to handle NaN values
const parseResponse = async (response) => {
  const text = await response.text();
  // Skip parsing if empty response
  if (!text) return {};
  
  // Replace NaN, Infinity values before parsing
  const sanitizedText = text
    .replace(/: NaN/g, ': null')
    .replace(/: Infinity/g, ': null')
    .replace(/: -Infinity/g, ': null');

  try {
    return JSON.parse(sanitizedText);
  } catch (error) {
    console.error('Error parsing response:', error);
    console.error('Response text:', text);
    throw new Error('Invalid JSON response');
  }
};

// API methods using fetch
const api = {
  // Base URL for API requests
  get baseUrl() {
    return getBaseUrl(); // Make it a getter to always get the latest URL
  },

  // Helper to get the full API URL
  getApiUrl(endpoint) {
    // Remove any leading slashes from the endpoint
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    return `${this.baseUrl}/${cleanEndpoint}`;
  },

  // GET request
  get: async (endpoint) => {
    try {
      const url = api.getApiUrl(endpoint);
      console.log(`Making GET request to: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        try {
          const errorData = await parseResponse(response);
          throw new Error(errorData.detail || errorData.message || `API error: ${response.status}`);
        } catch (parseError) {
          throw new Error(`API error: ${response.status}`);
        }
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
      const url = api.getApiUrl(endpoint);
      console.log(`Making POST request to: ${url}`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        try {
          const errorData = await parseResponse(response);
          throw new Error(errorData.detail || errorData.message || `API error: ${response.status}`);
        } catch (parseError) {
          throw new Error(`API error: ${response.status}`);
        }
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
      const url = api.getApiUrl(endpoint);
      console.log(`Making PUT request to: ${url}`);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        try {
          const errorData = await parseResponse(response);
          throw new Error(errorData.detail || errorData.message || `API error: ${response.status}`);
        } catch (parseError) {
          throw new Error(`API error: ${response.status}`);
        }
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
      const url = api.getApiUrl(endpoint);
      console.log(`Making DELETE request to: ${url}`);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        try {
          const errorData = await parseResponse(response);
          throw new Error(errorData.detail || errorData.message || `API error: ${response.status}`);
        } catch (parseError) {
          throw new Error(`API error: ${response.status}`);
        }
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