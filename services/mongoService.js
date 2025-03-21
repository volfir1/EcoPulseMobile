// src/services/mongoDBService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Set your API URL - for development you'll need to use your computer's IP address on mobile
// and not localhost (which would refer to the device itself)
const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:5000/api' 
  : 'http://192.168.1.2:5000/api'; // Replace with your actual server IP

// Helper function to get auth token
const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return null;
  }
};

// Parse JSON safely
const parseJSON = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
};

// Handler for fetch responses
const handleResponse = async (response) => {
  const data = await parseJSON(response);
  
  if (!response.ok) {
    const error = (data && data.message) || response.statusText;
    return Promise.reject(error);
  }
  
  return data;
};

// Save user to MongoDB after Firebase Auth
export const saveUserToMongoDB = async (userData) => {
  try {
    console.log('Saving user to MongoDB:', userData.email);
    const token = await getAuthToken();
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        firebaseId: userData.id || userData.firebaseId,
        email: userData.email,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        displayName: userData.displayName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        avatar: userData.avatar || userData.photoURL || 'default-avatar',
        gender: userData.gender || 'prefer-not-to-say',
        role: userData.role || 'user',
        hasCompletedOnboarding: userData.hasCompletedOnboarding || false
      })
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error saving user to MongoDB:', error);
    throw error;
  }
};

// Get user data from MongoDB
export const getUserFromMongoDB = async (firebaseId) => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      console.warn('No auth token available for MongoDB user fetch');
      return null;
    }
    
    const response = await fetch(`${API_URL}/users/${firebaseId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Return null for 404 (user not found) instead of throwing
    if (response.status === 404) {
      console.log('User not found in MongoDB:', firebaseId);
      return null;
    }
    
    const data = await handleResponse(response);
    return data.user;
  } catch (error) {
    console.error('Error fetching user from MongoDB:', error);
    // Return null instead of throwing if user not found
    return null;
  }
};

// Update user in MongoDB
export const updateUserInMongoDB = async (firebaseId, updateData) => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      console.warn('No auth token available for MongoDB user update');
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_URL}/users/${firebaseId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error updating user in MongoDB:', error);
    throw error;
  }
};

// Complete user onboarding
export const completeUserOnboarding = async (firebaseId, onboardingData) => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      console.warn('No auth token available for onboarding completion');
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_URL}/users/${firebaseId}/onboarding`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...onboardingData,
        hasCompletedOnboarding: true
      })
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error completing onboarding:', error);
    throw error;
  }
};

export default {
  saveUserToMongoDB,
  getUserFromMongoDB,
  updateUserInMongoDB,
  completeUserOnboarding
};