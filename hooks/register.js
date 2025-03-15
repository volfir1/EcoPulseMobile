// hooks/useRegister.js
import { useState } from 'react';
import { useAuth } from 'src/context/AuthContext';
import { Alert } from 'react-native';

const useRegister = (navigation) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { register, googleSignIn } = useAuth();

  const handleRegister = async () => {
    // Validation
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!acceptedTerms) {
      Alert.alert('Error', 'Please accept the terms and conditions');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Password strength
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      // Attempt to register with the provided information
      const result = await register({
        firstName,
        lastName,
        email,
        password
      });
      
      if (result.success) {
        if (result.requireVerification) {
          // Navigate to verification screen
          navigation.navigate('EmailVerification', { email });
        } else {
          // Clear form
          setFirstName('');
          setLastName('');
          setEmail('');
          setPassword('');
          setAcceptedTerms(false);
          
          // Show success message and navigate to login
          Alert.alert('Registration Successful', 'Your account has been created successfully.', [
            { text: 'OK', onPress: () => navigation.navigate('Login') }
          ]);
        }
      } else {
        // Show error message
        Alert.alert('Registration Failed', result.message || 'Please try again');
      }
    } catch (error) {
      Alert.alert('Registration Error', error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
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
  };

  const toggleTerms = () => {
    setAcceptedTerms(!acceptedTerms);
  };

  const handleLoginNavigation = () => {
    navigation.navigate('Login');
  };

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    acceptedTerms,
    toggleTerms,
    handleRegister,
    handleGoogleSignIn,
    handleLoginNavigation
  };
};

export default useRegister;