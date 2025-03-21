// src/utils/ConditionalGoogleSignIn.js
import { Platform } from 'react-native';

// This is a utility that conditionally imports GoogleSignin
// to prevent errors when the native module isn't available
const getGoogleSignin = () => {
  try {
    // Check if we're in a React Native environment or web
    if (Platform.OS === 'web') {
      // Return a mock implementation for web
      return {
        configure: () => console.log('Mock GoogleSignin.configure() for web'),
        hasPlayServices: async () => true,
        signIn: async () => {
          throw new Error('Google Sign-In is not supported on web in this app');
        },
        signOut: async () => {},
        statusCodes: {
          SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
          IN_PROGRESS: 'IN_PROGRESS',
          PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE'
        }
      };
    }

    // Try to import the real module
    const { GoogleSignin, statusCodes } = require('@react-native-google-signin/google-signin');
    return { GoogleSignin, statusCodes };
  } catch (error) {
    console.warn('GoogleSignin module could not be loaded:', error.message);
    
    // Return a mock implementation if the module fails to load
    return {
      GoogleSignin: {
        configure: () => console.warn('GoogleSignin not available'),
        hasPlayServices: async () => {
          throw new Error('GoogleSignin native module not linked');
        },
        signIn: async () => {
          throw new Error('GoogleSignin native module not linked');
        },
        signOut: async () => {
          console.warn('GoogleSignin not available');
        }
      },
      statusCodes: {
        SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
        IN_PROGRESS: 'IN_PROGRESS',
        PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE'
      }
    };
  }
};

export default getGoogleSignin;