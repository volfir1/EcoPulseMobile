import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from 'src/context/AuthContext';

/**
 * Auth-aware screen wrapper component
 * Renders content based on auth state
 */
const AuthAwareScreen = ({ 
  children, 
  loadingComponent,
  unauthenticatedComponent,
  requireAuth = true,
  navigation,
  returnScreen,
  authMessage = 'Please log in to access this feature'
}) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Default loading component
  const defaultLoadingComponent = (
    <View style={styles.centeredContainer}>
      <ActivityIndicator size="large" color="#4CAF50" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
  
  // Default unauthenticated component
  const defaultUnauthenticatedComponent = (
    <View style={styles.centeredContainer}>
      <Text style={styles.messageText}>{authMessage}</Text>
      {navigation && (
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login', { returnTo: returnScreen || navigation.current?.key })}
        >
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  
  if (loading) {
    return loadingComponent || defaultLoadingComponent;
  }
  
  if (requireAuth && !isAuthenticated) {
    return unauthenticatedComponent || defaultUnauthenticatedComponent;
  }
  
  return children;
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f9fc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#757575',
  },
  messageText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  }
});

export default AuthAwareScreen;