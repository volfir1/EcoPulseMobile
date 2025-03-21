// src/context/ProfileContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import api from '../features/modules/components/api';

// Create the context
const ProfileContext = createContext();

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

  // Fetch user profile from the API
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the user ID from auth context
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      
      const response = await api.get(`users/${user.id}`);
      
      if (response?.data) {
        setProfile(response.data);
        
        // Update local storage if needed
        try {
          await AsyncStorage.setItem('userProfile', JSON.stringify(response.data));
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
      
      const response = await api.put(`users/${user.id}`, updatedData);
      
      if (response?.data) {
        // Update both profile and user
        const updatedProfile = { ...profile, ...response.data };
        setProfile(updatedProfile);
        setUser(updatedProfile);
        
        // Update AsyncStorage
        await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        await AsyncStorage.setItem('user', JSON.stringify(updatedProfile));
        
        return {
          success: true,
          message: 'Profile updated successfully'
        };
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      console.error('Error updating profile:', err);
      return {
        success: false,
        message: err.message || 'Failed to update profile'
      };
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
        return {
          success: false,
          message: 'Cannot change password for Google account'
        };
      }
      
      const response = await api.put(`users/${user.id}/password`, {
        currentPassword,
        newPassword
      });
      
      if (response?.data?.success) {
        return {
          success: true,
          message: 'Password updated successfully'
        };
      } else {
        throw new Error(response?.data?.message || 'Failed to update password');
      }
    } catch (err) {
      setError(err.message || 'Failed to change password');
      console.error('Error changing password:', err);
      return {
        success: false,
        message: err.message || 'Failed to change password'
      };
    } finally {
      setLoading(false);
    }
  };

  // Handle account deactivation
  const deactivateAccount = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      
      const response = await api.post('auth/deactivate-account');
      
      if (response?.data?.success) {
        // Clear local storage
        await AsyncStorage.removeItem('userProfile');
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('authToken');
        
        return {
          success: true,
          message: 'Account deactivated successfully'
        };
      } else {
        throw new Error(response?.data?.message || 'Failed to deactivate account');
      }
    } catch (err) {
      setError(err.message || 'Failed to deactivate account');
      console.error('Error deactivating account:', err);
      return {
        success: false,
        message: err.message || 'Failed to deactivate account'
      };
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
      
      // Make a direct fetch call to handle FormData
      const response = await fetch(`${api.baseUrl}/users/${user.id}/avatar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${await AsyncStorage.getItem('authToken')}`
        },
        body: formData
      });
      
      const responseData = await response.json();
      
      if (response.ok && responseData) {
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
        
        return {
          success: true,
          message: 'Profile picture updated successfully',
          avatar: responseData.avatar || responseData.avatarUrl
        };
      } else {
        throw new Error(responseData?.message || 'Failed to update profile picture');
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile picture');
      console.error('Error updating profile picture:', err);
      return {
        success: false,
        message: err.message || 'Failed to update profile picture'
      };
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
    deactivateAccount,
    updateProfilePicture
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