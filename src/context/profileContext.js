// src/context/ProfileContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

// Create the context
const ProfileContext = createContext();

// Get the API URL based on platform (similar to authService)
const getApiUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://192.168.1.2:5000/api'; // Django API for Android emulator
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:8000/api'; // Django API for iOS simulator
  } else {
    // For physical devices, use actual IP or domain
    return 'http://192.168.1.2:8000/api';
  }
};

// Helper function to get auth token
const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem('ecopulse_access_token');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Profile provider component
export const ProfileProvider = ({ children }) => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize profile from auth user or fetch from API
  useEffect(() => {
    if (user) {
      setProfile(user);
    } else {
      fetchUserProfile();
    }
  }, [user]);

  // Helper function to check if online
  const isOnline = async () => {
    try {
      // First check AsyncStorage for a cached network status
      const networkStatus = await AsyncStorage.getItem('networkStatus');
      if (networkStatus) {
        return JSON.parse(networkStatus).isConnected;
      }
      return true; // Default to assuming online if no stored status
    } catch (error) {
      console.error('Error checking online status:', error);
      return true; // Default to assuming online
    }
  };

  // Fetch user profile from the API
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check authentication state without throwing an error
      if (!user?.id) {
        console.log('No authenticated user, skipping profile fetch');
        setProfile(null); // Clear any existing profile
        return; // Exit early instead of throwing
      }
      
      const token = await getAuthToken();
      if (!token) {
        console.log('No auth token found, skipping profile fetch');
        return;
      }
      
      const response = await fetch(`${getApiUrl()}/users/${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-client-type': 'mobile'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data) {
        setProfile(data);
        
        // Update local storage if needed
        try {
          await AsyncStorage.setItem('userProfile', JSON.stringify(data));
        } catch (storageError) {
          console.error('Error storing profile data:', storageError);
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to load profile');
      
      // Try to load from storage as fallback
      try {
        const storedProfile = await AsyncStorage.getItem('userProfile');
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        }
      } catch (storageError) {
        console.error('Error loading profile from storage:', storageError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updatedData) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      
      // Simplified error handling for offline mode
      const isConnected = await isOnline();
      if (!isConnected) {
        // Store updates locally for when connection is restored
        const updatedProfile = { ...profile, ...updatedData };
        setProfile(updatedProfile);
        
        try {
          // Update AsyncStorage
          await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
          
          // Also update user object in auth context
          setUser(updatedProfile);
          await AsyncStorage.setItem('user', JSON.stringify(updatedProfile));
          
          // Return success but with a message about offline mode
          return true;
        } catch (storageError) {
          console.error('Error storing profile data:', storageError);
          throw new Error('Failed to save profile data locally');
        }
      }
      
      // Online mode - make API call
      const token = await getAuthToken();
      
      const response = await fetch(`${getApiUrl()}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-client-type': 'mobile'
        },
        body: JSON.stringify(updatedData)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data) {
        // Update both profile and user
        const updatedProfile = { ...profile, ...data };
        setProfile(updatedProfile);
        setUser(updatedProfile);
        
        // Update AsyncStorage
        await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        await AsyncStorage.setItem('user', JSON.stringify(updatedProfile));
        
        return true;
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      console.error('Error updating profile:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
const changePassword = async (currentPassword, newPassword) => {
  try {
    setLoading(true);
    setError(null);
    
    if (!user?.id) {
      throw new Error('User not authenticated');
    }
    
    // Check if this is a Google account
    if (user.googleId) {
      Alert.alert(
        'Google Account',
        'Google-authenticated accounts cannot change passwords here. Please use Google\'s account settings to manage your password.'
      );
      return false;
    }
    
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    // Use the correct endpoint from your API documentation
    console.log(`Making password change request to: ${getApiUrl()}/users/${user.id}/password`);
    
    const response = await fetch(`${getApiUrl()}/users/${user.id}/password`, {
      method: 'PUT', // Using PUT as specified in your API docs
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-client-type': 'mobile'
      },
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    });
    
    // Log response info for debugging
    console.log('Password change response status:', response.status);
    console.log('Content-Type:', response.headers.get('content-type'));
    
    // Get response as text first, then try to parse as JSON if appropriate
    const responseText = await response.text();
    
    // Log the first 100 characters for debugging
    console.log('Response preview:', responseText.substring(0, 100));
    
    let data;
    // Only try to parse as JSON if content looks like JSON
    if (responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        throw new Error('Invalid response format from server');
      }
    } else {
      // Handle non-JSON responses
      if (response.ok) {
        return true; // Success but no JSON response
      } else {
        throw new Error(`Server error (${response.status}): Non-JSON response`);
      }
    }
    
    if (response.ok) {
      return true;
    } else {
      throw new Error(data?.message || data?.error || data?.detail || 
        `Failed to update password (${response.status})`);
    }
  } catch (err) {
    setError(err.message || 'Failed to change password');
    console.error('Error changing password:', err);
    return false;
  } finally {
    setLoading(false);
  }
};

  // Handle profile picture update
  const updateProfilePicture = async (imageUri) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      
      // Create a FormData object for the image upload
      const formData = new FormData();
      formData.append('avatar', {
        uri: imageUri,
        name: 'profile-image.jpg',
        type: 'image/jpeg',
      });
      
      const token = await getAuthToken();
      
      // Make a direct fetch call to handle FormData
      const response = await fetch(`${getApiUrl()}/users/${user.id}/avatar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
          'x-client-type': 'mobile'
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      if (responseData) {
        // Update profile with new avatar URL
        const updatedProfile = { 
          ...profile, 
          avatar: responseData.avatar || responseData.avatarUrl 
        };
        
        setProfile(updatedProfile);
        setUser(updatedProfile);
        
        // Update AsyncStorage
        await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        await AsyncStorage.setItem('user', JSON.stringify(updatedProfile));
        
        return true;
      } else {
        throw new Error(responseData?.message || 'Failed to update profile picture');
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile picture');
      console.error('Error updating profile picture:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    profile,
    loading,
    error,
    fetchUserProfile,
    updateProfile,
    changePassword,
    updateProfilePicture,
    getApiUrl // Export this for potential direct use
  };
  
  // Provide the context to children
  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

// Hook to use the profile context
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export default ProfileContext;