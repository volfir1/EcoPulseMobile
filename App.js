import React, { useEffect, useRef, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, Linking, Alert, View } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { ProfileProvider } from 'src/context/profileContext';
import AppNavigator from './src/navigator/AppNavigator';
import linking from './utils/linking';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Persistence key for navigation state
const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();

  // Reference to the navigation container
  const navigationRef = useRef(null);
  
  // Load navigation state from storage
  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        
        if (savedStateString) {
          const state = JSON.parse(savedStateString);
          setInitialState(state);
        }
      } catch (e) {
        console.warn('Failed to restore navigation state:', e);
      } finally {
        setIsReady(true);
      }
    };

    restoreState();
  }, []);

  // State persistence handling
  const onStateChange = useCallback(
    async (state) => {
      try {
        const serializedState = JSON.stringify(state);
        await AsyncStorage.setItem(PERSISTENCE_KEY, serializedState);
      } catch (e) {
        console.warn('Failed to save navigation state:', e);
      }
    },
    []
  );

  // Handle deep links more explicitly for debugging and better control
  useEffect(() => {
    // Handle URL when app is opened via a link
    const handleInitialURL = async () => {
      try {
        // Get the initial URL that opened the app
        const url = await Linking.getInitialURL();
        if (url) {
          console.log('App opened with URL:', url);
          processURL(url);
        }
      } catch (error) {
        console.error('Error getting initial URL:', error);
      }
    };
    
    // Process a deep link URL
    const processURL = (url) => {
      console.log('Processing URL:', url);
      
      // For reset password links, manually extract the token and navigate
      if (url.includes('reset-password')) {
        const tokenMatch = url.match(/[?&]token=([^&]+)/);
        const token = tokenMatch ? tokenMatch[1] : null;
        
        if (token) {
          console.log('Extracted reset token:', token);
          
          // Wait for navigation to be ready, then navigate
          if (navigationRef.current) {
            // Direct navigation to ResetPassword with the token
            setTimeout(() => {
              navigationRef.current.navigate('Auth', {
                screen: 'ResetPassword',
                params: { token }
              });
              
              // Confirm the navigation with a debug message on dev builds
              if (__DEV__) {
                Alert.alert(
                  'Deep Link Detected',
                  `Navigating to ResetPassword with token: ${token}`
                );
              }
            }, 500); // Small delay to ensure navigation is ready
          } else {
            console.warn('Navigation ref not ready yet');
          }
        } else {
          console.warn('No token found in URL:', url);
        }
      }
    };
    
    // Handle the initial URL that may have opened the app
    handleInitialURL();
    
    // Listen for incoming links while the app is open
    const linkingSubscription = Linking.addEventListener('url', ({ url }) => {
      console.log('Incoming link while app is open:', url);
      processURL(url);
    });
    
    // Clean up the listener
    return () => {
      linkingSubscription.remove();
    };
  }, []);
  
  // Show loading screen while restoring nav state
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }
  
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AuthProvider>
        {/* Wrap the NavigationContainer with ProfileProvider */}
        <ProfileProvider>
          <NavigationContainer 
            ref={navigationRef}
            linking={linking} 
            initialState={initialState}
            onStateChange={onStateChange}
            fallback={<ActivityIndicator size="large" color="#4CAF50" />}
            onReady={() => {
              console.log('Navigation container is ready');
            }}
          >
            <AppNavigator />
          </NavigationContainer>
        </ProfileProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}