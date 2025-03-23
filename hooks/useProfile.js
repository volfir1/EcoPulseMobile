// src/features/profile/hooks/useProfile.js
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from 'src/context/AuthContext';
import authService from 'services/authService';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  isCloudinaryUrl, 
  addCacheBuster, 
  getAvatarDisplayInfo 
} from '/utils/avatarHelper.js';
// Import default avatar images with correct relative paths
import avatar1 from '/assets/avatars/png/1.png';
import avatar2 from '/assets/avatars/png/2.png';
import avatar3 from '/assets/avatars/png/3.png';
import avatar4 from '/assets/avatars/4.svg';
import avatar5 from '/assets/avatars/png/5.png';
import avatar6 from '/assets/avatars/6.svg';
import avatar7 from '/assets/avatars/png/7.png';
// Default avatars with image sources
export const defaultAvatars = [
  { id: 'avatar-1', image: avatar1, name: 'Avatar A' },
  { id: 'avatar-2', image: avatar2, name: 'Avatar B' },
  { id: 'avatar-3', image: avatar3, name: 'Avatar C' },
  { id: 'avatar-4', image: avatar4, name: 'Avatar D' },
  { id: 'avatar-5', image: avatar5, name: 'Avatar E' },
  { id: 'avatar-6', image: avatar6, name: 'Avatar F' },
  { id: 'avatar-7', image: avatar7, name: 'Avatar G' },
];

// Helper to check if a URL is a Cloudinary URL

export const useProfile = (navigation) => {
  // Use Auth context directly
  const { user, setUser, isAuthenticated, setIsAuthenticated } = useAuth();
  
  // Local state
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: 'prefer-not-to-say' // Default value
  });
  
  // Token Debug
  const [tokenStatus, setTokenStatus] = useState('Checking...');
  
  // Avatar states
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [customAvatar, setCustomAvatar] = useState(null);
  const [avatarRefreshKey, setAvatarRefreshKey] = useState(Date.now());
  
  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);
  
  // Initialize form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        gender: user.gender || 'prefer-not-to-say',
      });
      
      // Reset avatar refresh key
      setAvatarRefreshKey(Date.now());
      
      // Handle avatar initialization - check if it's a Cloudinary URL
      if (user.avatar && isCloudinaryUrl(user.avatar)) {
        setCustomAvatar(user.avatar);
        setSelectedAvatar(null);
      }
      // Check if it's a default avatar ID
      else if (user.avatar && user.avatar.startsWith('avatar-')) {
        setSelectedAvatar(user.avatar);
        setCustomAvatar(null);
      } 
      // If any other type of avatar, treat as URL
      else if (user.avatar) {
        setCustomAvatar(user.avatar);
        setSelectedAvatar(null);
      }
    }
  }, [user]);
  
  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      // Get token and auth status in parallel
      const [token, isAuth] = await Promise.all([
        authService.getAccessToken(),
        authService.isAuthenticated()
      ]);
      
      // Detailed token status for debugging
      setTokenStatus(`Token: ${token ? 'Valid' : 'None'}, Auth: ${isAuth ? 'Yes' : 'No'}`);
      
      // Update authentication context if there's a mismatch
      if (token && !isAuthenticated) {
        console.log('Token exists but not authenticated in context - triggering context update');
        
        // Try to get user data
        const userData = await authService.getUser();
        if (userData) {
          // Update the auth context - this will propagate through the app
          setUser(userData);
          setIsAuthenticated(true);
        }
      } else if (!token && isAuthenticated) {
        console.log('No token but authenticated in context - fixing inconsistency');
        setIsAuthenticated(false);
      }
      
      // Check if we have token in storage but not in user object
      if (!token && user && user.accessToken) {
        console.log('Restoring token from user object');
        await authService.storeTokens(user.accessToken, user.refreshToken || null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setTokenStatus('Error: ' + (error.message || 'Unknown error'));
    }
  };
  
  // Text input changes
  const handleInputChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Avatar selection
  const handleAvatarSelect = (avatarId) => {
    setSelectedAvatar(avatarId);
    setCustomAvatar(null);
  };
  
  // Image picking
  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        setCustomAvatar(selectedAsset.uri);
        setSelectedAvatar(null); // Clear selected default avatar
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };
  
  // Toggle avatar modal
  const toggleAvatarModal = () => {
    setShowAvatarModal(!showAvatarModal);
  };
  
  // Upload image to cloudinary
  const uploadCustomAvatarToCloudinary = async (imageUri) => {
    try {
      console.log(`Starting custom avatar upload from: ${imageUri}`);
      setUploadProgress(10);
      
      // Read the image file as base64
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64
      });
      
      console.log(`Image read as base64, length: ${base64Image.length} characters`);
      setUploadProgress(30);
      
      // Get auth token directly from authService
      const authToken = await authService.getAccessToken();
      
      if (!authToken) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      // Generate a unique ID for the upload
      const uniqueId = Date.now().toString();
      
      // IMPORTANT: This should match the exact format your web app uses
      // Ensure we're using the same data structure as the web version
      const uploadData = {
        base64Image: `data:image/jpeg;base64,${base64Image}`,
        avatarId: 'custom-upload', // Match the web version exactly
        uniqueId: uniqueId
      };
      
      setUploadProgress(50);
      
      // Get API URL
      const apiUrl = authService.getApiUrl();
      const fullUrl = `${apiUrl}/upload/avatar/base64`;
      
      console.log(`Making Cloudinary upload request to: ${fullUrl}`);
      
      // Make request with same headers as web version
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          // Include credentials in headers just like web version
          'x-client-type': 'mobile'
        },
        body: JSON.stringify(uploadData)
      });
      
      setUploadProgress(80);
      
      if (response.status === 401) {
        throw new Error('Authentication expired. Please log in again.');
      }
      
      // Get full response text for debugging
      const responseText = await response.text();
      console.log('Server response:', responseText);
      
      let data;
      try {
        // Try to parse as JSON
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Response was not JSON:', responseText);
        throw new Error('Invalid response format from server');
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload avatar');
      }
      
      setUploadProgress(100);
      
      // Get the Cloudinary URL from the response using the same field name as web
      const avatarUrl = data.avatar || data.avatarUrl;
      
      if (!avatarUrl) {
        throw new Error('No avatar URL returned from server');
      }
      
      console.log('Avatar uploaded successfully:', avatarUrl);
      
      // Clear image cache for this user
      if (user?.id) {
        await AsyncStorage.removeItem(`AVATAR_CACHE_${user.id}`);
      }
      
      return avatarUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  };
  
  // Set a default avatar
  const setDefaultAvatar = async (avatarId) => {
    try {
      console.log(`Setting default avatar: ${avatarId}`);
      
      // Get auth token using authService
      const authToken = await authService.getAccessToken();
      
      if (!authToken) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      // Find the selected avatar data
      const avatarData = defaultAvatars.find(a => a.id === avatarId);
      
      if (!avatarData) {
        throw new Error('Avatar not found');
      }
      
      // Get API URL from authService
      const apiUrl = authService.getApiUrl();
      const fullUrl = `${apiUrl}/upload/default-avatar`;
      
      console.log(`Making default avatar request to: ${fullUrl}`);
      console.log('Avatar data:', { avatarId, name: avatarData.name });
      
      // Send request to set default avatar
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'x-client-type': 'mobile'
        },
        body: JSON.stringify({
          avatarId: avatarId,
          name: avatarData.name || avatarId,
        })
      });
      
      // Check for token errors
      if (response.status === 401) {
        throw new Error('Authentication expired. Please log in again.');
      }
      
      // Get the response text for debugging
      const responseText = await response.text();
      console.log('Default avatar response:', responseText);
      
      let data;
      try {
        // Try to parse as JSON if possible
        data = JSON.parse(responseText);
      } catch (e) {
        console.log('Response was not JSON:', responseText);
        throw new Error('Invalid response format from server');
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to set default avatar');
      }
      
      // Always use the avatar URL returned from the server directly
      const avatarUrl = data.avatar || data.avatarUrl;
      console.log('Default avatar set successfully:', avatarUrl);
      
      // Return the URL from the server
      return avatarUrl;
    } catch (error) {
      console.error('Error setting default avatar:', error);
      throw error; // Let the calling function handle the error
    }
  };
  

 // Fixed avatar handling in handleSubmit function
 const handleSubmit = async () => {
  try {
    setLoading(true);
    
    // Prepare update data (similar to web version)
    const updateData = { ...formData };
    
    console.log('Starting profile update with data:', updateData);
    
    // Clear avatar caches
    if (user?.id) {
      await AsyncStorage.removeItem(`AVATAR_CACHE_${user.id}`);
    }
    
    // IMPORTANT: Handle avatar update first, just like in web version
    if (selectedAvatar) {
      // Using default avatar
      console.log(`Setting default avatar: ${selectedAvatar}`);
      try {
        // Get the avatar URL from server
        const avatarUrl = await setDefaultAvatar(selectedAvatar);
        console.log(`Default avatar set: ${avatarUrl}`);
        
        // Store the selected avatar ID, not the URL
        // This matches how your web version stores default avatars
        updateData.avatar = selectedAvatar;
      } catch (avatarError) {
        console.error('Error setting default avatar:', avatarError);
        Alert.alert('Avatar Error', 'Failed to set avatar, but profile will still be updated');
      }
    } else if (customAvatar) {
      if (customAvatar.startsWith('file:') || customAvatar.startsWith('content:')) {
        // Local file needs to be uploaded
        console.log(`Uploading local avatar from: ${customAvatar}`);
        try {
          const avatarUrl = await uploadCustomAvatarToCloudinary(customAvatar);
          console.log(`Custom avatar uploaded: ${avatarUrl}`);
          
          // Store the full URL for custom uploads
          updateData.avatar = avatarUrl;
        } catch (uploadError) {
          console.error('Error uploading avatar:', uploadError);
          Alert.alert('Upload Error', 'Failed to upload avatar, but profile will still be updated');
        }
      } else {
        // Already a remote URL
        updateData.avatar = customAvatar;
      }
    }
    
    // Now update the profile with the prepared data
    console.log('Final update data:', updateData);
    
    const result = await updateUserProfile(updateData);
    
    if (result.success) {
      // Generate a new refresh key to force image refresh
      const refreshKey = Date.now().toString();
      
      // Update local user data, combining with server response
      const updatedUser = {
        ...user,
        ...result.user,
        _imageRefreshKey: refreshKey
      };
      
      // Update context
      setUser(updatedUser);
      
      // Force avatar refresh
      setAvatarRefreshKey(refreshKey);
      
      // Show success message and exit edit mode
      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
      
      // Close avatar modal if open
      if (showAvatarModal) {
        setShowAvatarModal(false);
      }
    } else {
      Alert.alert('Error', result.message || 'Failed to update profile');
    }
  } catch (error) {
    console.error('Profile update error:', error);
    
    if (error.message?.includes('Authentication')) {
      // Handle auth errors by redirecting to login
      Alert.alert(
        'Authentication Error',
        'Your session has expired. Please log in again.',
        [{ 
          text: 'OK', 
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth', params: { screen: 'Login' } }]
            });
          }
        }]
      );
    } else {
      Alert.alert('Error', error.message || 'An error occurred while updating your profile');
    }
  } finally {
    setLoading(false);
    setUploadProgress(0);
  }
};

  
  // Custom implementation of updateUserProfile to avoid dependency issues
  const updateUserProfile = async (userData) => {
    try {
      console.log('Updating user profile with data:', JSON.stringify(userData, null, 2));
      
      // Get the current user to access their ID
      const currentUser = await authService.getUser();
      
      if (!currentUser) {
        throw new Error('User data not found');
      }
      
      // Use the correct ID field - this is critical!
      // Different auth methods might use different field names
      const userId = currentUser.id || currentUser._id || currentUser.userId || currentUser.uid;
      
      if (!userId) {
        console.error('User object:', currentUser);
        throw new Error('User ID not found in user object');
      }
      
      console.log(`Using user ID for profile update: ${userId}`);
      
      // Get authentication token
      const token = await authService.getAccessToken();
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Use your API base URL
      const apiUrl = authService.getApiUrl();
      const fullUrl = `${apiUrl}/users/${userId}`;
      console.log(`Making profile update request to: ${fullUrl}`);
      
      // Make direct fetch request
      const response = await fetch(fullUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-client-type': 'mobile'
        },
        body: JSON.stringify({
          ...userData,
          clientType: 'mobile'
        })
      });
      
      // Get the response text for debugging
      const responseText = await response.text();
      console.log(`Profile update response (${response.status}):`, responseText);
      
      // Parse the response
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing response:', e);
        throw new Error('Invalid response from server');
      }
      
      if (response.status === 401) {
        throw new Error('Authentication expired. Please log in again.');
      }
      
      if (!response.ok) {
        throw new Error(data?.message || `Server error: ${response.status}`);
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Update failed on server');
      }
      
      return {
        success: true,
        user: data.user || userData // Return server user data or fallback to input
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update profile'
      };
    }
  };
  
  // Password reset navigation
  const handlePasswordReset = () => {
    navigation.navigate('ForgotPassword', { email: user?.email });
  };
  
  // Render avatar info - returns data for the component to render
  const getAvatarInfo = () => {
    return getAvatarDisplayInfo(user, selectedAvatar, customAvatar, avatarRefreshKey);
  };
  
  return {
    user,
    loading,
    uploadProgress,
    isEditing,
    showAvatarModal,
    formData,
    tokenStatus,
    selectedAvatar,
    customAvatar,
    defaultAvatars,
    avatarRefreshKey,
    setIsEditing,
    handleInputChange,
    handleAvatarSelect,
    pickImage,
    toggleAvatarModal,
    handleSubmit,
    handlePasswordReset,
    getAvatarInfo,
    isCloudinaryUrl
  };
};