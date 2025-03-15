import { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
import { Alert } from 'react-native';

const useLogin = (navigation) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // const { login, googleSignIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    setIsLoading(true);
    try {
      // === BYPASS AUTH LOGIC START ===
      // Simulate a brief loading state
      setTimeout(() => {
        // Clear form
        setEmail('');
        setPassword('');
        
        // Navigate using reset to prevent going back to login
        navigation.reset({
          index: 0,
          routes: [{ name: 'AppMain' }], // Make sure this matches your navigation structure
        });
        
        setIsLoading(false);
      }, 800);
      return;
      // === BYPASS AUTH LOGIC END ===
      
      /* Original authentication logic (commented out for later use)
      const result = await login(email, password);
      
      if (result.success) {
        // Clear form
        setEmail('');
        setPassword('');
        
        // Navigate using reset to prevent going back to login
        navigation.reset({
          index: 0,
          routes: [{ name: 'App' }],
        });
      } else if (result.requireVerification) {
        // Navigate to verification keeping the email
        navigation.navigate('EmailVerification', { 
          email: email,
          fromScreen: 'login'
        });
      } else {
        // Show specific error message
        Alert.alert(
          'Login Failed',
          result.message || 'Invalid credentials. Please try again.',
          [{ text: 'OK' }]
        );
      }
      */
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Error',
        'Connection error. Please check your internet and try again.',
        [{ text: 'OK' }]
      );
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    // === BYPASS AUTH LOGIC START ===
    // Simulate a brief loading state
    setTimeout(() => {
      // Navigate to home screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'AppMain' }], // Make sure this matches your navigation structure
      });
      
      setIsLoading(false);
    }, 800);
    return;
    // === BYPASS AUTH LOGIC END ===
    
    /* Original Google Sign-In logic (commented out for later use)
    try {
      const result = await googleSignIn();
      
      if (result.success) {
        // Navigate to home screen
        navigation.navigate('App', { screen: 'Home' });
      } else if (result.requireVerification) {
        // Navigate to verification screen
        navigation.navigate('EmailVerification', { email: result.email });
      } else if (result.message !== 'Sign-in was cancelled') {
        // Show error message only if not cancelled by user
        Alert.alert('Google Sign-In Failed', result.message || 'Please try again');
      }
    } catch (error) {
      if (error.message !== 'Sign-in was cancelled') {
        Alert.alert('Google Sign-In Error', error.message || 'An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
    */
  };

  const handleForgotPassword = () => {
    // For bypass, you might want to just go straight to home as well
    navigation.reset({
      index: 0,
      routes: [{ name: 'AppMain' }], // Make sure this matches your navigation structure
    });
    
    // Original code (commented out for later use)
    // navigation.navigate('ForgotPassword');
  };

  const handleRegisterNavigation = () => {
    // For bypass, you might want to just go straight to home as well
    navigation.reset({
      index: 0,
      routes: [{ name: 'AppMain' }], // Make sure this matches your navigation structure
    });
    
    // Original code (commented out for later use)
    // navigation.navigate('Register');
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleLogin,
    handleGoogleSignIn,
    handleForgotPassword,
    handleRegisterNavigation
  };
};

export default useLogin;