// src/hooks/register.js
import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from 'src/context/AuthContext';

const useRegister = (navigation) => {
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get auth functions from context
  const { register, googleSignIn } = useAuth();

  // Toggle terms acceptance
  const toggleTerms = () => {
    setAcceptedTerms(!acceptedTerms);
  };

  // Register with email/password
  const handleRegister = async () => {
    // Validate inputs
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all required fields');
      return;
    }

    if (!acceptedTerms) {
      Alert.alert('Terms & Conditions', 'Please accept the terms and conditions to continue');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      Alert.alert('Weak Password', 'Password should be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      const result = await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        gender: 'prefer-not-to-say',
        avatar: 'default-avatar'
      });

      if (result.success) {
        // Clear form
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setAcceptedTerms(false);

        // Navigate to verification screen if required
        if (result.requireVerification) {
          navigation.navigate('VerifyEmail', { 
            email: email.trim(), 
            userId: result.user.id 
          });
        } else {
          // Navigate to the app's main screen
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }
      } else {
        Alert.alert('Registration Failed', result.message || 'Please try again');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert(
        'Registration Error',
        'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Google sign-in
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await googleSignIn();
      
      if (result.success) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else if (result.message !== 'Sign-in was cancelled') {
        Alert.alert('Google Sign-In Failed', result.message || 'Please try again');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      if (error.message !== 'Sign-in was cancelled') {
        Alert.alert('Google Sign-In Error', error.message || 'An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to login screen
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