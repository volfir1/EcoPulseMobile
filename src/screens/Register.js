import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard
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

const Register = ({ navigation }) => {
  const { setUser, setIsAuthenticated } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' // Default role
  });
  const [errors, setErrors] = useState({});
  
  // Refs for inputs to allow focus management
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  // Handle text input changes
  const handleInputChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Clear error for this field
    if (errors[key]) {
      setErrors(prev => ({
        ...prev,
        [key]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // Validate first name
    if (!formData.firstName.trim()) {
      formErrors.firstName = 'First name is required';
      isValid = false;
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      formErrors.lastName = 'Last name is required';
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      formErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      formErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Validate password
    if (!formData.password) {
      formErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      formErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  // Extract userId from registration response
  // This function handles different response formats
  const extractUserId = (result) => {
    console.log('Extracting userId from:', JSON.stringify(result, null, 2));
    
    // First, directly check for userId at the top level (this is our new case)
    if (result.userId) {
      console.log('Found userId directly in result:', result.userId);
      return result.userId;
    }
    
    // Then try other possible locations
    if (result.user?.id) return result.user.id;
    if (result.user?._id) return result.user._id;
    if (result.user?.userId) return result.user.userId;
    if (result.data?.user?.id) return result.data.user.id;
    if (result.data?.userId) return result.data.userId;
    
    // Additional checks for MongoDB-style ObjectId
    if (result._id) return result._id;
    if (result.user?._id) return result.user._id;
    
    // Log what we found in the response to help debugging
    console.log('Could not find userId. Result keys:', Object.keys(result));
    if (result.user) {
      console.log('User object keys:', Object.keys(result.user));
    }
    
    // As a last resort, try to search for any property that might contain an ID
    for (const key in result) {
      if (typeof result[key] === 'string' && 
          (key.toLowerCase().includes('id') || 
           result[key].match(/^[0-9a-f]{24}$/i))) {
        console.log('Found potential ID in property:', key, result[key]);
        return result[key];
      }
    }
    
    return null;
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
  
    // Dismiss keyboard
    Keyboard.dismiss();
    setLoading(true);
  
    try {
      // Remove confirmPassword from the data sent to API
      const { confirmPassword, ...registrationData } = formData;
      
      console.log('Sending registration data:', registrationData);
      
      // Register user through authService
      const result = await authService.register(registrationData);
      
      console.log('Registration result:', JSON.stringify(result, null, 2));
      
      // Extract userId with our helper function
      const userId = extractUserId(result);
      console.log('Extracted userId:', userId);
      
      if (result.success) {
        // If verification is required, navigate to verification screen
        if (result.requireVerification) {
          if (!userId) {
            // Handle missing userId more gracefully
            console.error('Failed to extract userId from response:', result);
            
            // Try to get userId directly from the response as a last resort
            const lastResortUserId = result.userId || 
                                    (result.user && (result.user.id || result.user._id)) || 
                                    null;
            
            if (lastResortUserId) {
              console.log('Found userId as last resort:', lastResortUserId);
              
              // Store userId in AsyncStorage
              try {
                await AsyncStorage.setItem('pendingVerificationUserId', lastResortUserId);
                await AsyncStorage.setItem('pendingVerificationEmail', formData.email);
              } catch (storageError) {
                console.error('Failed to store verification data:', storageError);
              }
              
              navigation.navigate('VerifyEmail', {
                email: formData.email,
                userId: lastResortUserId
              });
              return;
            }
            
            // If we still can't find a userId, show alert
            Alert.alert(
              'Registration Incomplete',
              'Your account was created, but we could not retrieve your user ID. Would you like to try again or go to login?',
              [
                {
                  text: 'Try Again',
                  onPress: handleSubmit
                },
                {
                  text: 'Go to Login',
                  onPress: () => navigation.navigate('Login')
                }
              ]
            );
            return;
          }
          
          console.log('Navigating to verification with:', {
            email: formData.email,
            userId: userId
          });
          
          // Store userId in AsyncStorage as backup
          try {
            await AsyncStorage.setItem('pendingVerificationUserId', userId);
            await AsyncStorage.setItem('pendingVerificationEmail', formData.email);
          } catch (storageError) {
            console.error('Failed to store verification data:', storageError);
          }
          
          navigation.navigate('VerifyEmail', {
            email: formData.email,
            userId: userId
          });
        } else {
          // Set user in context and mark as authenticated
          setUser(result.user);
          setIsAuthenticated(true);
          
          // Navigate to the main app
          navigation.reset({
            index: 0,
            routes: [{ name: 'Dashboard' }] // Change to your actual dashboard name
          });
        }
      } else {
        // Show error message
        Alert.alert('Registration Failed', result.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Registration Error', error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Navigate to login screen
  const goToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Join EcoPulse</Text>
            <Text style={styles.subtitle}>Create your account to track and manage your energy usage</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                style={[styles.textInput, errors.firstName && styles.inputError]}
                value={formData.firstName}
                onChangeText={(text) => handleInputChange('firstName', text)}
                placeholder="Enter your first name"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => lastNameRef.current?.focus()}
                blurOnSubmit={false}
              />
              {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                ref={lastNameRef}
                style={[styles.textInput, errors.lastName && styles.inputError]}
                value={formData.lastName}
                onChangeText={(text) => handleInputChange('lastName', text)}
                placeholder="Enter your last name"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                blurOnSubmit={false}
              />
              {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                ref={emailRef}
                style={[styles.textInput, errors.email && styles.inputError]}
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                blurOnSubmit={false}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                ref={passwordRef}
                style={[styles.textInput, errors.password && styles.inputError]}
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
                placeholder="Create a password"
                secureTextEntry
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                blurOnSubmit={false}
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              {!errors.password && (
                <Text style={styles.passwordHint}>Must be at least 8 characters</Text>
              )}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <TextInput
                ref={confirmPasswordRef}
                style={[styles.textInput, errors.confirmPassword && styles.inputError]}
                value={formData.confirmPassword}
                onChangeText={(text) => handleInputChange('confirmPassword', text)}
                placeholder="Confirm your password"
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>
            
            <TouchableOpacity 
              style={[styles.button, loading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={greenTheme.WHITE} />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={goToLogin}>
                <Text style={styles.loginLink}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: greenTheme.BACKGROUND
  },
  keyboardAvoidContainer: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30
  },
  formContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: greenTheme.WHITE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: greenTheme.TEXT,
    marginBottom: 10,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: greenTheme.GRAY,
    marginBottom: 25,
    textAlign: 'center'
  },
  inputGroup: {
    marginBottom: 16
  },
  inputLabel: {
    fontSize: 14,
    color: greenTheme.TEXT,
    marginBottom: 8,
    fontWeight: '500'
  },
  textInput: {
    backgroundColor: greenTheme.LIGHT_GRAY,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16
  },
  inputError: {
    borderWidth: 1,
    borderColor: greenTheme.ERROR
  },
  errorText: {
    color: greenTheme.ERROR,
    fontSize: 12,
    marginTop: 5
  },
  passwordHint: {
    color: greenTheme.GRAY,
    fontSize: 12,
    marginTop: 5
  },
  button: {
    backgroundColor: greenTheme.PRIMARY,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20
  },
  disabledButton: {
    opacity: 0.7
  },
  buttonText: {
    color: greenTheme.WHITE,
    fontSize: 16,
    fontWeight: 'bold'
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
  },
  loginText: {
    color: greenTheme.GRAY,
    fontSize: 14
  },
  loginLink: {
    color: greenTheme.PRIMARY,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5
  }
});

export default Register;