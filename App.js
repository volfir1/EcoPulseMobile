// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigator/AppNavigator';
import { View, ActivityIndicator } from 'react-native';

// Import function for setting up error boundaries if needed
// import { setupErrorHandling } from './src/utils/errorHandling';

// // Initialize error handling
// setupErrorHandling();

// TODO: Implement AppProvider later
// import { AppProvider } from './src/context/AppContext';

export default function App() {
  return (
    // <AppProvider> -- Removed for now, will implement later
      <NavigationContainer
        fallback={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        }
      >
        <StatusBar style="auto" />
        <AppNavigator />
      </NavigationContainer>
    // </AppProvider>
  );
}