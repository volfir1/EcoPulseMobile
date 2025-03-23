import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from 'services/authService';

/**
 * Custom hook for ForgotPassword screen logic
 * 
 * @param {object} navigation - React Navigation navigator
 * @param {object} route - React Navigation route
 * @param {object} authContext - Authentication context
 * @returns {object} State and handler functions
 */
export const useForgotPassword = (navigation, route, authContext) => {
  // Extract dependencies from context
  const { forgotPassword, networkStatus } = authContext;
  
  // Extract email from route params if coming from another screen
  const initialEmail = route.params?.email || '';
  
  // State management
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [token, setToken] = useState('');
  const [tokenError, setTokenError] = useState('');

  // Load saved state on mount
  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedState = await AsyncStorage.getItem('forgotPassword_state');
        if (savedState) {
          const state = JSON.parse(savedState);
          console.log('Restored ForgotPassword state:', state);
          
          if (state.email) setEmail(state.email);
          if (state.submitted) setSubmitted(state.submitted);
          if (state.showTokenInput) setShowTokenInput(state.showTokenInput);
        }
      } catch (error) {
        console.error('Error restoring state:', error);
      }
    };
    
    restoreState();
  }, []);

  // Save state on updates
  useEffect(() => {
    const saveState = async () => {
      try {
        const state = {
          email,
          submitted,
          showTokenInput
        };
        await AsyncStorage.setItem('forgotPassword_state', JSON.stringify(state));
      } catch (error) {
        console.error('Error saving state:', error);
      }
    };
    
    saveState();
  }, [email, submitted, showTokenInput]);

  // Log component render for debugging
  useEffect(() => {
    console.log(`ForgotPassword rendered with showTokenInput: ${showTokenInput}`);
  });

  // Update email if it changes in route params
  useEffect(() => {
    if (route.params?.email && route.params.email !== email) {
      setEmail(route.params.email);
    }
  }, [route.params?.email, email]);

  // Clear any previously stored tokens
  const clearStoredTokens = async () => {
    try {
      console.log('Clearing stored reset tokens from AsyncStorage');
      await AsyncStorage.removeItem('ecopulse_reset_token');
    } catch (error) {
      console.error('Error clearing token from AsyncStorage:', error);
    }
  };

  // Send password reset email
  const handleResetPassword = async () => {
    // Reset errors and state
    setTokenError('');
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Check if offline
    if (!networkStatus?.isConnected) {
      Alert.alert(
        'Offline Mode',
        'Password reset requires an internet connection. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Clear previous tokens before requesting a new one
    await clearStoredTokens();

    setIsLoading(true);
    try {
      // Add platform info for optimal email template
      const deviceType = Platform.OS;
      console.log(`Requesting password reset from ${deviceType}`);
      
      // Call the forgotPassword function from context
      const result = await forgotPassword(email.trim(), deviceType);
      
      console.log('Forgot password API result:', result);
      
      if (result.success) {
        setSubmitted(true);
        console.log('Password reset email sent successfully');
        
        // Always show the token input section after email is sent
        // This makes it a required step in the flow
        setShowTokenInput(true);
        
        // Save email for possible use in ResetPassword screen
        await AsyncStorage.setItem('resetPassword_email', email.trim());
        
        // Show success message with instructions
        Alert.alert(
          'Verification Code Sent',
          'A 6-character verification code has been sent to your email address. Please check your inbox and enter it on the next screen.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', result.message || 'Failed to process your request');
      }
    } catch (error) {
      console.error('Error requesting password reset:', error);
      Alert.alert(
        'Error', 
        error.message || 'An unexpected error occurred. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle manual token input section
  const toggleTokenInput = () => {
    setShowTokenInput(!showTokenInput);
    if (!showTokenInput) {
      // Clear previous error when opening the input
      setTokenError('');
    }
  };

  // Handle manual token from email function
  const handleManualTokenFromEmailClick = () => {
    Alert.alert(
      'Use Full Reset Token',
      'Please enter the EXACT token from your most recent password reset email. Make sure to copy the complete token string.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Enter Token',
          onPress: () => {
            Alert.prompt(
              'Enter Reset Token',
              'Copy and paste the token from your email',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Use Token',
                  onPress: (manualToken) => {
                    if (manualToken?.trim()) {
                      console.log('Manual token entered from email:', manualToken.trim());
                      
                      // Clear any stored token first
                      clearStoredTokens().then(() => {
                        // Navigate to ResetPassword with the entered token
                        navigation.navigate('ResetPassword', { 
                          token: manualToken.trim(),
                          email: email.trim()
                        });
                      });
                    } else {
                      Alert.alert('Error', 'Please enter a valid token');
                    }
                  }
                }
              ],
              'plain-text'
            );
          }
        }
      ]
    );
  };

  // Handle manual token submission and navigation to reset password
  const handleContinueWithToken = async () => {
    if (!token.trim()) {
      setTokenError('Please enter the verification code from your email');
      return;
    }
  
    // Check if offline
    if (!networkStatus?.isConnected) {
      Alert.alert(
        'Offline Mode',
        'Password reset requires an internet connection. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
      return;
    }
  
    setIsLoading(true);
    try {
      // Check if it's a short code (6-8 chars) or a full token
      if (token.length <= 8) {
        console.log('Processing as a short code');
        
        // Verify the short code and get the full token
        const verifyResult = await authService.verifyResetCode(email.trim(), token.trim());
        
        if (verifyResult.success) {
          // The full token is now stored in AsyncStorage by the verifyResetCode function
          console.log('Verification code verified successfully');
          
          // Navigate to ResetPassword screen without passing token in params
          // since it's stored in AsyncStorage
          navigation.navigate('ResetPassword', { 
            email: email.trim()
          });
        } else {
          setTokenError(verifyResult.message || 'Invalid verification code');
        }
      } else {
        // Handle as a full token (original flow)
        console.log('Processing as a full token');
        
        // Clear any stored tokens first
        await clearStoredTokens();
        
        // Store the token in AsyncStorage
        await AsyncStorage.setItem('ecopulse_reset_token', token.trim());
        
        // Navigate to ResetPassword screen
        navigation.navigate('ResetPassword', { 
          email: email.trim()
        });
      }
    } catch (error) {
      console.error('Error processing token:', error);
      setTokenError(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle back to login navigation
  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };
  
  return {
    email,
    setEmail,
    isLoading,
    submitted,
    showTokenInput,
    token,
    setToken,
    tokenError,
    handleResetPassword,
    toggleTokenInput,
    handleManualTokenFromEmailClick,
    handleContinueWithToken,
    handleBackToLogin
  };
};