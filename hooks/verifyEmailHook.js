import { useState, useEffect } from 'react';
import { Alert, Keyboard } from 'react-native';
import { useAuth } from 'src/context/AuthContext';
import authService from 'services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useEmailVerification = (route, navigation, inputRef) => {
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

  return {
    email,
    userId,
    verificationCode,
    setVerificationCode,
    loading,
    resendLoading,
    countdown,
    error,
    keyboardOpen,
    debugInfo,
    handleVerify,
    handleResend,
    forceFocus
  };
};