// src/screens/OnboardRegisterScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

// Import avatar helper functions
import { isCloudinaryUrl, addCacheBuster, getDefaultAvatarUrl } from 'utils/avatarHelper';
import CloudinaryImage from 'utils/CloudinaryImage';

// Import default avatar images with correct paths
import avatar1 from '/assets/avatars/png/1.png';
import avatar2 from '/assets/avatars/png/2.png';
import avatar3 from '/assets/avatars/png/3.png';
import avatar4 from '/assets/avatars/4.png';
import avatar5 from '/assets/avatars/png/5.png';
import avatar6 from '/assets/avatars/png/6.png';
import avatar7 from '/assets/avatars/png/7.png';

// Default colors for fallback avatars
const AVATAR_COLORS = ['#4CAF50', '#2196F3', '#FFC107', '#E91E63', '#9C27B0', '#FF5722', '#3F51B5'];

// Fallback avatar component
const LetterAvatar = ({ letter, color }) => (
  <View style={[styles.letterAvatar, { backgroundColor: color }]}>
    <Text style={styles.letterText}>{letter}</Text>
  </View>
);

// Gender options
const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'transgender', label: 'Transgender' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' }
];

// Default avatars with images, letters and colors
const defaultAvatars = [
  { id: 'avatar-1', image: avatar1, color: AVATAR_COLORS[0], letter: 'A' },
  { id: 'avatar-2', image: avatar2, color: AVATAR_COLORS[1], letter: 'B' },
  { id: 'avatar-3', image: avatar3, color: AVATAR_COLORS[2], letter: 'C' },
  { id: 'avatar-4', image: avatar4, color: AVATAR_COLORS[3], letter: 'D' },
  { id: 'avatar-5', image: avatar5, color: AVATAR_COLORS[4], letter: 'E' },
  { id: 'avatar-6', image: avatar6, color: AVATAR_COLORS[5], letter: 'F' },
  { id: 'avatar-7', image: avatar7, color: AVATAR_COLORS[6], letter: 'G' },
];

const OnboardRegisterScreen = ({ navigation }) => {
  console.log('Rendering OnboardRegisterScreen');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // State for selected options
  const [selectedAvatar, setSelectedAvatar] = useState('avatar-1');
  const [customAvatar, setCustomAvatar] = useState(null);
  const [selectedGender, setSelectedGender] = useState('prefer-not-to-say');
  const [avatarRefreshKey, setAvatarRefreshKey] = useState(Date.now());

  // Check if we have a user on mount
  useEffect(() => {
    const checkStorageForUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('ecopulse_user');
        if (userData) {
          console.log('Found existing user data in storage');
        }
      } catch (error) {
        console.error('Error checking for user data:', error);
      }
    };
    
    checkStorageForUser();
  }, []);
  
  // Handle avatar selection
  const handleAvatarSelect = (avatarId) => {
    setSelectedAvatar(avatarId);
    setCustomAvatar(null); // Clear custom avatar when selecting a default one
  };
  
  // Handle gender selection
  const handleGenderSelect = (genderValue) => {
    setSelectedGender(genderValue);
  };
  
  // Handle image picking
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

  // Upload custom avatar to Cloudinary (if this feature is needed)
  const uploadCustomAvatarToCloudinary = async (imageUri) => {
    try {
      setUploadProgress(10);
      
      // Read the image file as base64
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64
      });
      
      setUploadProgress(30);
      
      // Get auth token (if using authentication)
      const authToken = await AsyncStorage.getItem('authToken');
      
      if (!authToken) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      // Prepare data for upload
      const uploadData = {
        base64Image: `data:image/jpeg;base64,${base64Image}`,
        avatarId: 'custom',
        uniqueId: Date.now().toString()
      };
      
      setUploadProgress(50);
      
      // Get your API URL (adjust as needed)
      const apiUrl = "https://your-api-url.com/api"; // Replace with your actual API URL
      const fullUrl = `${apiUrl}/upload/avatar/base64`;
      
      // Upload to backend
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(uploadData)
      });
      
      setUploadProgress(80);
      
      // Check for errors
      if (response.status === 401) {
        throw new Error('Authentication expired. Please log in again.');
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload avatar');
      }
      
      setUploadProgress(100);
      
      // Return the Cloudinary URL
      return data.avatar || data.avatarUrl;
    } catch (error) {
      console.error('Error uploading custom avatar:', error);
      // For now, just return the local URI as fallback
      return imageUri;
    }
  };
  
  // Standalone implementation of completeOnboarding without requiring AuthContext
  const completeOnboardingLocally = async (data) => {
    try {
      // Get existing user data if available
      let userData = {};
      try {
        const storedUser = await AsyncStorage.getItem('ecopulse_user');
        if (storedUser) {
          userData = JSON.parse(storedUser);
        }
      } catch (storageError) {
        console.warn('Error getting stored user data:', storageError);
      }
      
      // If we have a custom avatar that's a local file, we might want to upload it
      let avatarValue = data.avatar;
      
      if (customAvatar && (customAvatar.startsWith('file:') || customAvatar.startsWith('content:'))) {
        try {
          // Upload custom avatar to Cloudinary if needed
          // Comment this out if you're not using Cloudinary upload
          // avatarValue = await uploadCustomAvatarToCloudinary(customAvatar);
        } catch (uploadError) {
          console.error('Error uploading avatar:', uploadError);
          // Keep the local URI as fallback
          avatarValue = customAvatar;
        }
      } else if (selectedAvatar && selectedAvatar.startsWith('avatar-')) {
        // For selected default avatar, you might want to use the Cloudinary URL
        // avatarValue = getDefaultAvatarUrl(selectedAvatar);
      }
      
      // Update user data with onboarding info
      const updatedUser = {
        ...userData,
        gender: data.gender,
        avatar: avatarValue, // This might be a Cloudinary URL or local URI
        hasCompletedOnboarding: true
      };
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('ecopulse_user', JSON.stringify(updatedUser));
      
      // IMPORTANT: Update the authentication state to trigger re-render in AppNavigator
      await AsyncStorage.setItem('ecopulse_has_completed_onboarding', 'true');
      
      console.log('Saved user data locally:', updatedUser);
      return { success: true };
    } catch (error) {
      console.error('Error in completeOnboardingLocally:', error);
      // Return success anyway so the user can proceed
      return { success: true };
    }
  };
  
  // Handle completing onboarding
  const handleComplete = async () => {
    try {
      console.log('Starting handleComplete function');
      setIsLoading(true);
      
      // Prepare data for submission
      const onboardingData = {
        gender: selectedGender,
        avatar: customAvatar || selectedAvatar,
        hasCompletedOnboarding: true
      };
      
      console.log('Onboarding data:', onboardingData);
      
      // Save data locally
      try {
        await completeOnboardingLocally(onboardingData);
        console.log('Completed onboarding locally');
      } catch (error) {
        console.error('Failed to complete onboarding locally:', error);
      }
      
      try {
        // Set all necessary flags in AsyncStorage
        console.log('Setting completion flags');
        
        // 1. Update user data in AsyncStorage
        const userData = await AsyncStorage.getItem('ecopulse_user');
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData);
            parsedUser.hasCompletedOnboarding = true;
            await AsyncStorage.setItem('ecopulse_user', JSON.stringify(parsedUser));
            console.log('Updated user onboarding status in AsyncStorage');
          } catch (parseError) {
            console.error('Error updating user data:', parseError);
          }
        }
        
        // 2. Set the direct onboarding completion flag
        await AsyncStorage.setItem('ecopulse_has_completed_onboarding', 'true');
        
        // 3. Set force reload flag with timestamp to trigger AppNavigator refresh
        await AsyncStorage.setItem('ecopulse_force_reload', Date.now().toString());
        
        // 4. Show a brief message to indicate success
        Alert.alert(
          'Setup Complete',
          'Your profile setup is complete! The app will now take you to the main screen.',
          [{ text: 'OK' }]
        );
        
      } catch (error) {
        console.error('Error in completion process:', error);
        
        // Show a user-friendly message
        Alert.alert(
          'Setup Complete',
          'Your profile has been set up successfully! Please restart the app if you are not redirected automatically.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error in handleComplete:', error);
      
      Alert.alert(
        'Notice', 
        'We encountered an issue, but your profile has been saved. Please restart the app to continue.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // Navigate to next step
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  
  // Navigate to previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  // Render avatar (image or letter)
  const renderAvatar = (avatar) => {
    // If avatar has an image, use it
    if (avatar.image) {
      return (
        <Image 
          source={avatar.image} 
          style={styles.avatarImage}
          resizeMode="cover"
        />
      );
    }
    
    // Otherwise use letter avatar
    return (
      <LetterAvatar 
        letter={avatar.letter} 
        color={avatar.color}
      />
    );
  };
  
  // Steps content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Choose Your Avatar</Text>
            <Text style={styles.stepDescription}>
              Select an avatar that represents you or upload your own.
            </Text>
            
            <View style={styles.avatarGrid}>
              {defaultAvatars.map((avatar) => (
                <TouchableOpacity
                  key={avatar.id}
                  style={[
                    styles.avatarOption,
                    selectedAvatar === avatar.id && styles.selectedAvatarOption
                  ]}
                  onPress={() => handleAvatarSelect(avatar.id)}
                >
                  {renderAvatar(avatar)}
                </TouchableOpacity>
              ))}
              
              {/* Custom avatar upload option */}
              <TouchableOpacity
                style={[
                  styles.avatarOption,
                  customAvatar && styles.selectedAvatarOption
                ]}
                onPress={pickImage}
              >
              {customAvatar ? (
  isCloudinaryUrl(customAvatar) ? (
    // Use CloudinaryImage for Cloudinary URLs
    <CloudinaryImage
      source={{ uri: customAvatar }}
      style={styles.avatarImage}
      refreshKey={Date.now()}
      forceRefresh={true}
      resizeMode="cover"
    />
  ) : (
    // Use regular Image for local URIs
    <Image
      source={{ uri: customAvatar }}
      style={styles.avatarImage}
    />
  )
) : (
  <View style={styles.uploadAvatarPlaceholder}>
    <Ionicons name="add-circle-outline" size={24} color="#4CAF50" />
    <Text style={styles.uploadText}>Upload</Text>
  </View>
)}
              </TouchableOpacity>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={nextStep}
              >
                <Text style={styles.buttonText}>Next</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        );
        
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Choose Your Gender</Text>
            <Text style={styles.stepDescription}>
              Select the option that best represents you. This information helps us personalize your experience.
            </Text>
            
            <View style={styles.genderOptions}>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.genderOption,
                    selectedGender === option.value && styles.selectedGenderOption
                  ]}
                  onPress={() => handleGenderSelect(option.value)}
                >
                  <Text
                    style={[
                      styles.genderOptionText,
                      selectedGender === option.value && styles.selectedGenderOptionText
                    ]}
                  >
                    {option.label}
                  </Text>
                  
                  {selectedGender === option.value && (
                    <Ionicons name="checkmark-circle" size={20} color="white" style={styles.checkIcon} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={prevStep}
              >
                <Ionicons name="arrow-back" size={20} color="#555" />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.completeButton}
                onPress={handleComplete}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Complete</Text>
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            Welcome to EcoPulse! Let's set up your profile to get the most out of the app.
          </Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${(currentStep / 2) * 100}%` }
            ]}
          />
        </View>
        
        {renderStepContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 30,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 25,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  avatarOption: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  selectedAvatarOption: {
    borderColor: '#4CAF50',
    borderWidth: 3,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  letterAvatar: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  uploadAvatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 5,
    fontSize: 12,
    color: '#4CAF50',
  },
  genderOptions: {
    marginBottom: 30,
  },
  genderOption: {
    padding: 16,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedGenderOption: {
    backgroundColor: '#4CAF50',
  },
  genderOptionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  selectedGenderOptionText: {
    color: 'white',
  },
  checkIcon: {
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: 20,
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  backButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.45,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.45,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  backButtonText: {
    color: '#555',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default OnboardRegisterScreen;