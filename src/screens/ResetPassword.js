import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Clipboard
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from "../context/AuthContext";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ResetPassword = ({ route, navigation }) => {
  // Extract token and email from route params (handles both deep links and normal navigation)
  const { token: routeToken, email: routeEmail } = route.params || {};
  
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  const [tokenErrorMessage, setTokenErrorMessage] = useState('');
  const [tokenSource, setTokenSource] = useState('unknown');
  const [userEmail, setUserEmail] = useState(routeEmail || '');
  
  // Ref to prevent duplicate token validation
  const tokenValidated = useRef(false);
  
  const { resetPassword, forgotPassword, networkStatus } = useAuth();

  // Initial setup of token from route params
  useEffect(() => {
    if (routeToken) {
      console.log('Setting initial token from route params:', routeToken);
      setToken(routeToken);
      setTokenSource('route_params');
    }
  }, []);

  // Function to validate token format
  const isValidTokenFormat = (token) => {
    return typeof token === 'string' && token.trim().length >= 6;
  };

  // Check token validity on initial load and when it changes
  useEffect(() => {
    const validateCurrentToken = async () => {
      // Skip if already validated this token or if there's no token
      if (!token || tokenValidated.current) return;
      
      console.log('Raw token from params/storage:', token);
      
      // Only trim whitespace, preserve the exact token otherwise
      const trimmedToken = token.trim();
  
      // If token changed after trimming, update it
      if (trimmedToken !== token) {
        console.log('Token contained whitespace, trimmed version:', trimmedToken);
        setToken(trimmedToken);
      }
      
      // Basic format validation
      if (trimmedToken.length < 6) {
        console.log("Token too short:", trimmedToken.length);
        setTokenError(true);
        setTokenErrorMessage("The reset token format is invalid.");
        return;
      }
      
      // Mark this token as validated
      tokenValidated.current = true;
      console.log("Token format looks valid");
    };
    
    validateCurrentToken();
  }, [token]);

  // Check for stored token in AsyncStorage on mount
  useEffect(() => {
    const checkStoredToken = async () => {
      try {
        console.log('ResetPassword checking AsyncStorage for token...');
        const storedToken = await AsyncStorage.getItem('ecopulse_reset_token');
        
        if (storedToken && !routeToken) {
          console.log('Found token in AsyncStorage:', storedToken);
          setToken(storedToken);
          setTokenSource('async_storage');
          setTokenError(false);
          setTokenErrorMessage('');
          
          // Clear the stored token to prevent using it again
          await AsyncStorage.removeItem('ecopulse_reset_token');
        } else if (storedToken && routeToken) {
          console.log('Found token in AsyncStorage but using route token instead');
          // Clear the stored token since we're using the route token
          await AsyncStorage.removeItem('ecopulse_reset_token');
        } else {
          console.log('No token found in AsyncStorage');
        }
        
        // Check for stored email if not provided in route
        if (!userEmail) {
          const storedEmail = await AsyncStorage.getItem('resetPassword_email');
          if (storedEmail) {
            console.log('Using email from AsyncStorage:', storedEmail);
            setUserEmail(storedEmail);
          }
        }
      } catch (error) {
        console.error('Error checking AsyncStorage for token:', error);
      }
    };
    
    checkStoredToken();
  }, [routeToken, userEmail]);

  // Handle when screen comes into focus - for deep linking cases
  useFocusEffect(
    React.useCallback(() => {
      console.log('ResetPassword screen focused');
      console.log('Current token from state:', token);
      console.log('Current token from route:', route.params?.token);
      
      // Update token if it's provided in route and different from current token
      if (route.params?.token && route.params.token !== token) {
        console.log("New token received from navigation:", route.params.token);
        setToken(route.params.token);
        setTokenSource('navigation');
        setTokenError(false);
        setTokenErrorMessage('');
        // Reset validation flag for the new token
        tokenValidated.current = false;
      }
      
      // Update email if provided in route params
      if (route.params?.email && route.params.email !== userEmail) {
        console.log("Email received from navigation:", route.params.email);
        setUserEmail(route.params.email);
      }
      
      // Check if token is missing
      if (!token && !route.params?.token) {
        console.log("No token available - showing error state");
        setTokenError(true);
        setTokenErrorMessage("No reset token provided. Please request a new password reset link.");
      }
    }, [route.params, token, userEmail])
  );

  // Request a fresh token
  const handleRequestFreshToken = async () => {
    if (!userEmail) {
      Alert.alert(
        'Email Required',
        'Please enter your email address to request a new reset link',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Enter Email',
            onPress: () => navigation.navigate('ForgotPassword')
          }
        ]
      );
      return;
    }
    
    // Clear any stored token before requesting new one
    try {
      await AsyncStorage.removeItem('ecopulse_reset_token');
    } catch (error) {
      console.error('Error clearing token from AsyncStorage:', error);
    }
    
    setIsLoading(true);
    try {
      const result = await forgotPassword(userEmail, Platform.OS);
      
      if (result.success) {
        Alert.alert(
          'Success',
          'A new password reset link has been sent to your email. Please check your inbox.',
          [
            { text: 'OK' }
          ]
        );
      } else {
        Alert.alert('Error', result.message || 'Failed to request a new password reset link.');
      }
    } catch (error) {
      console.error('Error requesting fresh token:', error);
      Alert.alert('Error', error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle direct token entry from email
  const handleEnterTokenFromEmail = () => {
    Alert.alert(
      'Use Latest Token',
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
                      setToken(manualToken.trim());
                      setTokenSource('manual_email_entry');
                      setTokenError(false);
                      setTokenErrorMessage('');
                      
                      // Reset validation flag for the new token
                      tokenValidated.current = false;
                      
                      // Alert that token is ready to use
                      Alert.alert('Token Entered', 'The token has been entered. Click Reset Password to continue.');
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

  // Copy token to clipboard for debugging
  const copyTokenToClipboard = () => {
    if (!token) return;
    
    Clipboard.setString(token);
    Alert.alert('Success', 'Token copied to clipboard');
  };

  const handleResetPassword = async () => {
    // Clear previous errors
    setTokenErrorMessage('');
    
    // Token validation
    if (!token) {
      setTokenError(true);
      setTokenErrorMessage('Reset token is missing. Please try again from the forgot password screen.');
      return;
    }
    
    // CRUCIAL: Only trim whitespace, do not modify the token in any other way
    const exactToken = token.trim();
    
    console.log("Reset password with token:", exactToken);
    console.log(`Attempting password reset with token from ${tokenSource}`);
    console.log(`Token length: ${token.length}, trimmed length: ${token.trim().length}`);
    
    // Password validation
    if (!password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please enter and confirm your password');
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
  
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }
  
    // Check network
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
      // Additional logging before API call
      console.log(`Making resetPassword API call with token of length ${exactToken.length}`);
      
      // Directly attempt password reset
      const result = await resetPassword(exactToken, password);
      
      console.log("Reset password API result:", result);
      
      if (result.success) {
        // Clear stored email after successful reset
        await AsyncStorage.removeItem('resetPassword_email');
        
        Alert.alert(
          'Success', 
          'Your password has been reset successfully!',
          [{ 
            text: 'Login Now', 
            onPress: () => navigation.navigate('Login', { 
              email: result.email || userEmail
            })
          }]
        );
      } else {
        // If token is invalid, offer recovery options
        if (result.message?.toLowerCase().includes('token') ||
            result.message?.toLowerCase().includes('expired')) {
          
          // Check for the specific "expired" flag in response
          if (result.expired || result.details?.toLowerCase().includes('expired')) {
            // Token exists but is expired
            setTokenErrorMessage("Your reset token has expired. Please request a new one.");
          } else {
            // Token is invalid for other reasons
            setTokenErrorMessage(result.message || 'The reset token is invalid or has expired.');
          }
          
          setTokenError(true);
        } else {
          Alert.alert('Error', result.message || 'Failed to reset password');
        }
      }
    } catch (error) {
      console.error('Reset password error:', error);
      
      // Log all available error details
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      
      // Check for token-related errors in the exception
      if (error.message?.toLowerCase().includes('token') ||
          error.message?.toLowerCase().includes('expired')) {
          
        setTokenError(true);
        setTokenErrorMessage(error.message || 'The reset token is invalid or has expired.');
      } else {
        Alert.alert('Error', error.message || 'An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Handle manual token entry if token is missing
  const handleManualTokenEntry = () => {
    Alert.prompt(
      'Enter Reset Token',
      'Please enter the reset token from your email',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: (manualToken) => {
            if (manualToken?.trim()) {
              console.log('Manual token entered:', manualToken);
              setToken(manualToken.trim());
              setTokenSource('manual_entry');
              setTokenError(false);
              setTokenErrorMessage('');
              // Reset validation flag for the new token
              tokenValidated.current = false;
            } else {
              Alert.alert('Error', 'Please enter a valid token');
            }
          }
        }
      ],
      'plain-text'
    );
  };

  // If token error, show a special screen with instructions
  if (tokenError) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <Ionicons name="alert-circle" size={70} color="#F44336" />
            </View>
            
            <Text style={styles.title}>Invalid Reset Token</Text>
            
            <Text style={styles.description}>
              {tokenErrorMessage || "The password reset link appears to be invalid or expired."}
            </Text>
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => navigation.navigate('ForgotPassword', { email: userEmail })}
            >
              <LinearGradient
                colors={['#4CAF50', '#3E9142']}
                start={[0, 0]}
                end={[1, 0]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Request New Reset Link</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            {userEmail ? (
              <TouchableOpacity 
                style={[styles.button, { marginTop: 10 }]} 
                onPress={handleRequestFreshToken}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['#FF9800', '#F57C00']}
                  start={[0, 0]}
                  end={[1, 0]}
                  style={styles.buttonGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.buttonText}>Get Fresh Token</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            ) : null}
            
            <TouchableOpacity 
              style={[styles.button, { marginTop: 10 }]} 
              onPress={handleEnterTokenFromEmail}
            >
              <LinearGradient
                colors={['#2196F3', '#1976D2']}
                start={[0, 0]}
                end={[1, 0]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Enter Token From Email</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, { marginTop: 10 }]} 
              onPress={handleManualTokenEntry}
            >
              <LinearGradient
                colors={['#9C27B0', '#7B1FA2']}
                start={[0, 0]}
                end={[1, 0]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Enter Token Manually</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, { marginTop: 10 }]} 
              onPress={() => navigation.navigate('Login')}
            >
              <LinearGradient
                colors={['#607D8B', '#455A64']}
                start={[0, 0]}
                end={[1, 0]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Back to Login</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Ionicons name="arrow-back" size={24} color="#525F7F" />
            </TouchableOpacity>
            
            <View style={styles.iconContainer}>
              <Ionicons name="lock-closed" size={70} color="#4CAF50" />
            </View>
            
            <Text style={styles.title}>Reset Password</Text>
            
            <Text style={styles.description}>
              Create a new password for your account
            </Text>
            
            {/* Token info indicator */}
            <TouchableOpacity 
              style={styles.tokenInfo}
              onLongPress={copyTokenToClipboard}
            >
              <Text style={styles.tokenInfoText}>
                Using reset token: {token ? `${token.substring(0, 6)}...${token.substring(token.length - 6)}` : 'None'}
                {validatingToken ? ' (validating...)' : ''}
              </Text>
              <Text style={styles.tokenSourceText}>
                Source: {tokenSource}
              </Text>
              <Text style={styles.tokenHintText}>
                Long press to copy token
              </Text>
            </TouchableOpacity>
            
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color="#525F7F" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#A0A0A0"
                editable={!isLoading && !validatingToken}
              />
              <TouchableOpacity onPress={toggleShowPassword}>
                <Ionicons 
                  name={showPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color="#525F7F" 
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color="#525F7F" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#A0A0A0"
                editable={!isLoading && !validatingToken}
              />
            </View>
            
            <View style={styles.passwordRequirements}>
              <Text style={styles.requirementTitle}>Password requirements:</Text>
              <Text style={[
                styles.requirementText,
                password.length >= 6 ? styles.requirementMet : {}
              ]}>
                • At least 6 characters
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleResetPassword}
              disabled={isLoading || validatingToken}
            >
              <LinearGradient
                colors={['#4CAF50', '#3E9142']}
                start={[0, 0]}
                end={[1, 0]}
                style={styles.buttonGradient}
              >
                {isLoading || validatingToken ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Reset Password</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
            
            {/* Get fresh token button */}
            {userEmail ? (
              <TouchableOpacity 
                style={[styles.button, { marginTop: 10 }]} 
                onPress={handleRequestFreshToken}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['#FF9800', '#F57C00']}
                  start={[0, 0]}
                  end={[1, 0]}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Request New Token</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : null}
            
            {/* Enter token from email */}
            <TouchableOpacity 
              style={[styles.button, { marginTop: 10 }]} 
              onPress={handleEnterTokenFromEmail}
            >
              <LinearGradient
                colors={['#2196F3', '#1976D2']}
                start={[0, 0]}
                end={[1, 0]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Enter Token From Email</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            {/* Use known valid token for testing */}
            <TouchableOpacity 
              style={styles.linkButton}
              onPress={() => {
                // Use the exact token you found in the database
                const knownValidToken = "c49b8cd29f9f362b71612c31221f0cabd18b7713";
                setToken(knownValidToken);
                setTokenSource('known_valid_token');
                setTokenError(false);
                setTokenErrorMessage('');
                tokenValidated.current = false;
                Alert.alert('Token Set', 'Using the known valid token from your database. Try Reset Password now.');
              }}
            >
              <Text style={styles.linkText}>Use Valid Token</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#525F7F',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#F8F9FB',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#EAEEF2',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  passwordRequirements: {
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  requirementTitle: {
    fontSize: 14,
    color: '#525F7F',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  requirementMet: {
    color: '#4CAF50',
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
    shadowColor: "#4CAF50",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    padding: 10,
  },
  linkText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '500',
  },
  tokenInfo: {
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  tokenInfoText: {
    color: '#2E7D32',
    fontSize: 14,
    textAlign: 'center',
  },
  tokenSourceText: {
    color: '#2E7D32',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  tokenHintText: {
    color: '#616161',
    fontSize: 10,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 4,
  }
});