// src/context/AppContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create context
export const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  // App state
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // On app start, check if user has completed onboarding
  useEffect(() => {
    const checkAppState = async () => {
      try {
        // Check onboarding status
        const onboardingStatus = await AsyncStorage.getItem('hasCompletedOnboarding');
        setHasCompletedOnboarding(onboardingStatus === 'true');
        
        // Check authentication status
        const userToken = await AsyncStorage.getItem('userToken');
        setIsAuthenticated(userToken !== null);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking app state:', error);
        setIsLoading(false);
      }
    };
    
    checkAppState();
  }, []);

  // Function to complete onboarding
  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  // Authentication functions
  const login = async (token) => {
    try {
      await AsyncStorage.setItem('userToken', token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error saving auth token:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        isLoading,
        hasCompletedOnboarding,
        isAuthenticated,
        completeOnboarding,
        login,
        logout
      }}
    >
      {isLoading ? (
        // Show loading screen while checking app state
        <LoadingScreen />
      ) : (
        children
      )}
    </AppContext.Provider>
  );
};

// Simple loading screen component
const LoadingScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};