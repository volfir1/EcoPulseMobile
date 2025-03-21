// src/hooks/useLogin.js - Enhanced with debug and proper scopes
import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { useAuth } from '/src/context/AuthContext';
import NetInfo from '@react-native-community/netinfo';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from 'src/context/firebase/firebase';
import authService from '/services/authService';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';

// Important: Register your app for web browser redirect
WebBrowser.maybeCompleteAuthSession();

const useLogin = (navigation) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  
  // Get the auth functions and states from context
  const { login, networkStatus, setUser, setIsAuthenticated } = useAuth();
  
  // Get the configured client IDs from app.json
  const { googleClientId } = Constants.expoConfig?.extra || {};
  
  // Set up Expo Google Auth Session with proper configuration
  // Important: Add scopes and proper configuration
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: googleClientId?.android,
    webClientId: googleClientId?.web,
    iosClientId: googleClientId?.ios || googleClientId?.web,
    expoClientId: googleClientId?.web, // Added for Expo Go
    scopes: ['profile', 'email'],
    responseType: 'id_token',
    usePKCE: false,
    redirectUri: Platform.OS === 'web' 
      ? `${window.location.origin}/`
      : `${Constants.expoConfig?.scheme || 'ecopulse'}://`
  });
  
  // For debugging - log authentication response
  useEffect(() => {
    if (response?.type) {
      console.log("Google Auth Response:", JSON.stringify(response, null, 2));
    }
  }, [response]);
  
  // Google Sign-In availability is determined by whether the request object is ready
  const googleSignInAvailable = !!request;
  
  // Monitor network status
  useEffect(() => {
    setIsOffline(!networkStatus.isConnected);
  }, [networkStatus]);

  // Show offline banner when network status changes
  useEffect(() => {
    if (isOffline) {
      console.log('App is in offline mode');
    }
  }, [isOffline]);

  // Email/password login implementation
  const handleLogin = async () => {
    // Reset error state
    setError(null);
    
    // Validate input
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    try {
      // Special handling for offline mode 
      if (isOffline) {
        console.log('Attempting offline login...');
        
        // Login will try to use cached credentials if possible
        const result = await login(email, password);
        
        if (result.success && result.fromCache) {
          // Successfully logged in with cached credentials
          Alert.alert(
            'Offline Login', 
            'You are logged in with cached credentials. Some features may be limited until you reconnect.',
            [{ text: 'OK' }]
          );
          
          // Navigate to main app
          navigation.reset({
            index: 0,
            routes: [{ name: 'AppMain' }],
          });
          return;
        } else {
          throw new Error('Cannot login while offline with these credentials');
        }
      }
      
      // Normal online login flow
      console.log('Attempting online login...');
      const result = await login(email, password);
      
      console.log('Login response:', JSON.stringify(result));
      
      if (result.success) {
        // Clear form fields
        setEmail('');
        setPassword('');
        
        // Handle email verification requirement if needed
        if (result.requireVerification) {
          // Store userId from response for verification
          const userId = result.user?.id || result.userId;
          
          if (Platform.OS !== 'web') {
            // On mobile, navigate to verification screen
            navigation.navigate('VerifyEmail', { 
              email: email,
              userId: userId
            });
          } else {
            // On web, follow existing logic
            navigation.navigate('VerifyEmail', { email });
          }
        } else {
          // Firebase workaround: short delay to ensure Firebase auth state is synchronized
          setTimeout(() => {
            // Navigate to the app's main screen
            navigation.reset({
              index: 0,
              routes: [{ name: 'AppMain' }],
            });
          }, 300);
        }
      } else {
        // Handle specific error cases
        if (result.isAutoDeactivated) {
          Alert.alert(
            'Account Deactivated',
            'Your account has been deactivated due to inactivity. Please check your email for reactivation instructions.',
            [
              { 
                text: 'OK', 
                onPress: () => navigation.navigate('Login')
              }
            ]
          );
        } else {
          // Handle general error
          setError(result.message || 'Login failed. Please try again.');
          Alert.alert('Login Failed', result.message || 'Please try again');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (isOffline) {
        Alert.alert(
          'Cannot Login While Offline',
          'Please check your internet connection and try again.',
          [{ text: 'OK' }]
        );
      } else {
        // Set error message
        setError(error.message || 'An unexpected error occurred. Please try again.');
        Alert.alert(
          'Login Error',
          error.message || 'An unexpected error occurred. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign-In implementation using Expo Auth Session
  const handleGoogleSignIn = async () => {
    if (isOffline) {
      Alert.alert(
        'Cannot Use Google Sign-In',
        'Google sign-in requires an internet connection. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Check if Google Sign-In is available before proceeding
    if (!googleSignInAvailable) {
      Alert.alert(
        'Google Sign-In Not Available',
        'Google Sign-In is not configured properly on this device.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Starting Google sign-in process with Expo Auth Session...");
      console.log("Using client IDs:", {
        android: googleClientId?.android,
        web: googleClientId?.web,
        ios: googleClientId?.ios
      });
      
      // Log redirect URI for debugging
      const redirectUri = Platform.select({
        web: `${window.location.origin}/`,
        default: `${Constants.expoConfig?.scheme || 'ecopulse'}://`
      });
      console.log("Redirect URI:", redirectUri);
      
      // Prompt user to sign in with Google
      const result = await promptAsync();
      console.log("Google Auth result:", result);
      
      // Handle authentication response
      if (result.type === 'success') {
        // Get the access token from the response
        const { id_token } = result.authentication || {};
        
        if (!id_token) {
          console.error("Missing ID token in response:", result);
          throw new Error("No ID token received from Google");
        }
        
        // Create a credential from the ID token
        const credential = GoogleAuthProvider.credential(id_token);
        
        // Sign in with Firebase
        console.log("Signing in to Firebase with Google credential...");
        const userCredential = await signInWithCredential(auth, credential);
        console.log("Firebase sign-in successful:", userCredential.user.uid);
        
        // Call your backend API (using your existing authService)
        console.log("Calling backend with Google token...");
        const apiResult = await authService.googleSignIn(
          id_token,
          {
            email: userCredential.user.email,
            displayName: userCredential.user.displayName,
            photoUrl: userCredential.user.photoURL,
            id: userCredential.user.uid
          }
        );
        
        if (apiResult.success) {
          console.log("Backend authentication successful");
          
          // Update user state
          setUser(apiResult.user);
          setIsAuthenticated(true);
          
          // Navigate to main app
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'AppMain' }],
            });
          }, 300);
          
          return { success: true };
        } else {
          throw new Error(apiResult.message || 'Authentication failed on the server');
        }
      } else if (result.type === 'cancel') {
        console.log("User cancelled the sign-in flow");
        return { success: false, message: 'Sign-in was cancelled' };
      } else {
        console.error("Google sign-in failed with result:", result);
        throw new Error('Google sign-in failed. Please try again.');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      
      let errorMessage = error.message || 'An unexpected error occurred';
      setError(errorMessage);
      
      if (error.message !== 'Sign-in was cancelled') {
        Alert.alert('Google Sign-In Error', errorMessage);
      }
      
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (isOffline) {
      Alert.alert(
        'Offline Mode',
        'Password reset requires an internet connection. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
      return;
    }
    navigation.navigate('ForgotPassword');
  };

  const handleRegisterNavigation = () => {
    if (isOffline) {
      Alert.alert(
        'Offline Mode',
        'Registration requires an internet connection. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
      return;
    }
    navigation.navigate('Register');
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    setError,
    isOffline,
    googleSignInAvailable,
    handleLogin,
    handleGoogleSignIn,
    handleForgotPassword,
    handleRegisterNavigation
  };
};

export default useLogin;