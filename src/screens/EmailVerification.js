import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import authService from '/services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Green theme colors
const greenTheme = {
  PRIMARY: '#2E7D32',
  SECONDARY: '#4CAF50',
  LIGHT: '#81C784',
  BACKGROUND: '#E8F5E9',
  TEXT: '#212121',
  WHITE: '#FFFFFF',
  GRAY: '#757575',
  LIGHT_GRAY: '#EEEEEE',
  ERROR: '#FF5252'
};

const VerifyEmail = ({ route, navigation }) => {
  const { user, setUser, setIsAuthenticated } = useAuth();
  
  // Extract params with deep debugging
  const routeParams = route.params || {};
  console.log('Full route params:', JSON.stringify(routeParams));
  
  const email = routeParams.email || user?.email || '';
  
  // Use multiple fallbacks for userId
  const userId = routeParams.userId || 
                 routeParams.user?.id || 
                 user?.id || 
                 '';
                 
  console.log('Using email:', email);
  console.log('Using userId:', userId);
  
  // Reference to the input field
  const inputRef = useRef(null);
  
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    userId: userId,
    email: email,
    route: JSON.stringify(routeParams)
  });

  // Debug the params
  useEffect(() => {
    console.log('Extracted verification params:', { email, userId });
    // Update debug info if params change
    setDebugInfo({
      userId: userId,
      email: email,
      route: JSON.stringify(routeParams)
    });
  }, [email, userId, routeParams]);

  // Setup keyboard listeners
  useEffect(() => {
    // Listen for keyboard open and close events
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardOpen(true);
        console.log('Keyboard opened');
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardOpen(false);
        console.log('Keyboard closed');
      }
    );

    // Focus input on mount
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        console.log('Attempting to focus input');
      }
    }, 500);

    // Start countdown timer
    startCountdown();

    // Clean up listeners
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Countdown timer for resend button
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Force focus on input
  const forceFocus = () => {
    console.log('Force focusing input');
    if (inputRef.current) {
      inputRef.current.blur();
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  };

  // Start countdown for resend button
  const startCountdown = () => {
    setCountdown(60); // 60 seconds countdown
  };

  // Try to recover userId from other sources
  const recoverUserId = async () => {
    try {
      // Try to get from AsyncStorage
      const storedUser = await authService.getUser();
      if (storedUser && storedUser.id) {
        return storedUser.id;
      }
      
      // Try to recover from auth context
      if (user && user.id) {
        return user.id;
      }
      
      return null;
    } catch (error) {
      console.error('Error recovering userId:', error);
      return null;
    }
  };

  // Handle verification code submission
  const handleVerify = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }
  
    let userIdToUse = userId;
    
    // Recover userId if missing
    if (!userIdToUse) {
      const recoveredId = await recoverUserId();
      if (recoveredId) {
        userIdToUse = recoveredId;
      } else {
        setError('User ID is missing. Please go back and try again.');
        return;
      }
    }
  
    setLoading(true);
    setError('');
    Keyboard.dismiss();
  
    try {
      const response = await fetch(`${authService.getApiUrl()}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-type': 'mobile'
        },
        body: JSON.stringify({
          userId: userIdToUse,
          verificationCode: verificationCode.trim(),
          clientType: 'mobile'
        })
      });
  
      const responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        result = { success: false, message: 'Invalid server response' };
      }
  
      if (result.success) {
        // Update user data while KEEPING onboarding flags false
        const updatedUserData = {
          ...(result.user || user), // Use existing user if no new data
          isVerified: true,
          emailVerified: true,
          hasCompletedOnboarding: false,
          hasSeenOnboarding: false // Keep onboarding state
        };
  
        console.log('Email verified successfully, updating user data:', updatedUserData);
        
        // Update user state
        setUser(updatedUserData);
        
        // Store the updated user data WITHOUT setting isAuthenticated yet
        await authService.storeUser(updatedUserData);
        
        // IMPORTANT: Explicitly mark email as verified but onboarding not completed
        await AsyncStorage.setItem('ecopulse_email_verified', 'true');
        await AsyncStorage.setItem('ecopulse_has_completed_onboarding', 'false');
        
        Alert.alert(
          'Email Verified',
          'Your email has been verified successfully! Let\'s complete your profile setup.',
          [
            {
              text: 'Continue',
              onPress: () => {
                // CRITICAL CHANGE: Set authentication state ONLY after alert is dismissed
                // This delays the AppNavigator from re-evaluating navigation state
                // until after we navigate
                setIsAuthenticated(true);
                
                // Use navigation.replace rather than reset for smoother transition
                navigation.replace('OnboardRegister');
                
                // Log the navigation for debugging
                console.log('Navigating to OnboardRegister screen');
              }
            }
          ]
        );
      } else {
        setError(result.message || 'Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Verification failed. Please check your code and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle resending verification code
  const handleResend = async () => {
    if (countdown > 0) return;
    
    let userIdToUse = userId;
    
    // If we don't have a userId, try to recover it
    if (!userIdToUse) {
      const recoveredId = await recoverUserId();
      if (recoveredId) {
        userIdToUse = recoveredId;
        console.log('Recovered userId for resend:', recoveredId);
      } else {
        setError('User ID is missing. Please go back and try again.');
        
        // Show detailed debug alert
        Alert.alert(
          'Debug Info',
          `We're missing the user ID for resend.\n\nRoute params: ${JSON.stringify(routeParams)}\n\nUser context: ${JSON.stringify(user)}`,
          [{ text: 'OK' }]
        );
        return;
      }
    }
    
    setResendLoading(true);
    setError('');

    try {
      console.log('Sending resend request with userId:', userIdToUse);
      
      // Direct API call to troubleshoot
      const apiUrl = `${authService.getApiUrl()}/auth/resend-verification`;
      console.log('Resend API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-type': 'mobile'
        },
        body: JSON.stringify({
          userId: userIdToUse,
          clientType: 'mobile'
        })
      });
      
      console.log('Resend response status:', response.status);
      const responseText = await response.text();
      console.log('Raw resend response:', responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing resend response:', e);
        result = { success: false, message: 'Invalid server response' };
      }
      
      console.log('Parsed resend response:', result);
      
      if (result.success) {
        Alert.alert('Code Sent', 'A new verification code has been sent to your email');
        startCountdown();
      } else {
        setError(result.message || 'Failed to resend code. Please try again.');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      setError('Failed to resend code. Please try again later.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <View style={styles.card}>
              <Text style={styles.title}>Verify Your Email</Text>
              <Text style={styles.subtitle}>
                We've sent a verification code to:
              </Text>
              <Text style={styles.email}>{email}</Text>
              
              <Text style={styles.instruction}>
                Enter the code below to verify your email address.
              </Text>
              
              <TouchableOpacity 
                activeOpacity={1}
                style={styles.inputWrapper}
                onPress={forceFocus}
              >
                <TextInput
                  ref={inputRef}
                  style={styles.input}
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  placeholder="Enter verification code"
                  keyboardType="number-pad"
                  autoFocus={true}
                  maxLength={6}
                  caretHidden={false}
                  contextMenuHidden={false}
                  textContentType="oneTimeCode"
                />
              </TouchableOpacity>
              
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              
              <TouchableOpacity
                style={[styles.verifyButton, loading && styles.disabledButton]}
                onPress={handleVerify}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={greenTheme.WHITE} />
                ) : (
                  <Text style={styles.verifyButtonText}>Verify Email</Text>
                )}
              </TouchableOpacity>
              
              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Didn't receive the code? </Text>
                {countdown > 0 ? (
                  <Text style={styles.countdownText}>Resend in {countdown}s</Text>
                ) : (
                  <TouchableOpacity onPress={handleResend} disabled={resendLoading}>
                    {resendLoading ? (
                      <ActivityIndicator size="small" color={greenTheme.PRIMARY} />
                    ) : (
                      <Text style={styles.resendLink}>Resend Code</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>

              {/* Debug info section */}
              <View style={styles.debugSection}>
                <Text style={styles.debugTitle}>Debug Info (tap to hide)</Text>
                <Text style={styles.debugText}>User ID: {debugInfo.userId || 'Not found'}</Text>
                <Text style={styles.debugText}>Email: {debugInfo.email || 'Not found'}</Text>
                <Text style={styles.debugText}>Keyboard: {keyboardOpen ? 'Open' : 'Closed'}</Text>
                <Text style={styles.debugText}>Route Params: {debugInfo.route}</Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: greenTheme.BACKGROUND
  },
  keyboardAvoid: {
    flex: 1
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    backgroundColor: greenTheme.WHITE,
    borderRadius: 15,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: greenTheme.TEXT,
    marginBottom: 16,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: greenTheme.GRAY,
    textAlign: 'center'
  },
  email: {
    fontSize: 16,
    fontWeight: 'bold',
    color: greenTheme.PRIMARY,
    textAlign: 'center',
    marginBottom: 24
  },
  instruction: {
    fontSize: 14,
    color: greenTheme.TEXT,
    marginBottom: 16,
    textAlign: 'center'
  },
  inputWrapper: {
    marginBottom: 24,
    width: '100%'
  },
  input: {
    backgroundColor: greenTheme.LIGHT_GRAY,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 2
  },
  errorText: {
    color: greenTheme.ERROR,
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center'
  },
  verifyButton: {
    backgroundColor: greenTheme.PRIMARY,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center'
  },
  disabledButton: {
    opacity: 0.7
  },
  verifyButtonText: {
    color: greenTheme.WHITE,
    fontSize: 16,
    fontWeight: 'bold'
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24
  },
  resendText: {
    fontSize: 14,
    color: greenTheme.GRAY
  },
  resendLink: {
    fontSize: 14,
    color: greenTheme.PRIMARY,
    fontWeight: 'bold'
  },
  countdownText: {
    fontSize: 14,
    color: greenTheme.SECONDARY
  },
  // Debug styles
  debugSection: {
    marginTop: 30,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  debugTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  debugText: {
    fontSize: 10,
    color: '#666',
    marginBottom: 3,
  }
});

export default VerifyEmail;