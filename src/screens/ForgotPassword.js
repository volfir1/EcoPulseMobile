// src/features/auth/screens/ForgotPassword.jsx
import React, { useRef, useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForgotPassword } from 'hooks/forgotPassword';
import { useAuth } from 'src/context/AuthContext';
import styles, { greenTheme } from 'styles/forgotPasswordStyles';

const ForgotPassword = ({ navigation, route }) => {
  // Get auth context
  const authContext = useAuth();
  
  // Use the hook with navigation and auth context
  const {
    email,
    setEmail,
    isLoading,
    submitted,
    showTokenInput,
    token,
    setToken,
    tokenError,
    handleResetPassword,
    toggleTokenInput,
    handleManualTokenFromEmailClick,
    handleContinueWithToken,
    handleBackToLogin
  } = useForgotPassword(navigation, route, authContext);
  
  // Local state to control the tab/card display
  const [activeTab, setActiveTab] = useState('email'); // 'email' or 'code'
  
  // Animation for sliding between cards
  const slideAnimation = useRef(new Animated.Value(0)).current;
  
  // Update animation when active tab changes
  useEffect(() => {
    if (activeTab === 'code') {
      // Slide to verification card
      Animated.timing(slideAnimation, {
        toValue: -1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide back to email card
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [activeTab]);
  
  // Update activeTab when showTokenInput changes
  useEffect(() => {
    if (showTokenInput) {
      setActiveTab('code');
    }
  }, [showTokenInput]);
  
  // Calculate transform based on screen width
  const translateX = slideAnimation.interpolate({
    inputRange: [-1, 0],
    outputRange: [-(styles.card.width), 0],
  });
  
  // Handle "Already have a code" button
  const handleHaveCodeAlready = () => {
    setActiveTab('code');
  };
  
  // Handle back button in code verification tab
  const handleBackToEmail = () => {
    setActiveTab('email');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back button */}
          <TouchableOpacity 
            style={styles.backNavigationButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={greenTheme.PRIMARY} />
            <Text style={styles.backNavigationText}>Back</Text>
          </TouchableOpacity>
          
          {/* Tab Selection */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'email' && styles.activeTab
              ]}
              onPress={() => setActiveTab('email')}
              disabled={isLoading}
            >
              <Text style={[
                styles.tabText,
                activeTab === 'email' && styles.activeTabText
              ]}>
                Request Code
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'code' && styles.activeTab
              ]}
              onPress={() => setActiveTab('code')}
              disabled={isLoading}
            >
              <Text style={[
                styles.tabText,
                activeTab === 'code' && styles.activeTabText
              ]}>
                Enter Code
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Animated Cards Container */}
          <Animated.View 
            style={[
              styles.cardsContainer,
              { transform: [{ translateX }] }
            ]}
          >
            {/* Email Input Card */}
            <View style={[styles.card, styles.slide]}>
              <Ionicons 
                name="mail" 
                size={60} 
                color={greenTheme.PRIMARY} 
                style={styles.emailIcon} 
              />
              
              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>
                Enter your email address and we'll send you a verification code to reset your password.
              </Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <View>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor={greenTheme.GRAY}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    editable={!isLoading}
                  />
                  <View style={styles.inputIconContainer}>
                    <Ionicons name="mail-outline" size={20} color={greenTheme.GRAY} />
                  </View>
                </View>
              </View>
              
              <TouchableOpacity
                style={[
                  styles.button,
                  isLoading && styles.buttonDisabled
                ]}
                onPress={handleResetPassword}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Send Verification Code</Text>
                )}
              </TouchableOpacity>
              
              {/* "Already have a code" option */}
              <TouchableOpacity
                style={styles.linkButton}
                onPress={handleHaveCodeAlready}
                disabled={isLoading}
              >
                <Text style={styles.linkText}>Already have a code?</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.linkButton, { marginTop: 8 }]}
                onPress={handleBackToLogin}
                disabled={isLoading}
              >
                <Text style={styles.linkText}>Back to Login</Text>
              </TouchableOpacity>
              
              {submitted && (
                <View style={styles.infoCard}>
                  <Text style={styles.infoText}>
                    A verification code has been sent to your email. 
                    Please check your inbox and enter the code on the next screen.
                  </Text>
                </View>
              )}
            </View>
            
            {/* Code Verification Card */}
            <View style={[styles.card, styles.slide]}>
              <Text style={styles.title}>Verify Your Email</Text>
              <Text style={styles.subtitle}>
                Enter the 6-character verification code sent to your email address.
              </Text>
              
              {email && (
                <View style={styles.emailDisplayContainer}>
                  <Ionicons name="mail" size={16} color={greenTheme.PRIMARY} />
                  <Text style={styles.emailDisplayText}>{email}</Text>
                </View>
              )}
              
              <View style={styles.codeContainer}>
                <TextInput
                  style={[
                    styles.verificationInput,
                    tokenError && styles.inputError
                  ]}
                  placeholder="Enter code"
                  placeholderTextColor={greenTheme.GRAY}
                  // Using default keyboard instead of numeric
                  keyboardType="default"
                  autoCapitalize="none"
                  maxLength={10} // Allow for longer codes if needed
                  value={token}
                  onChangeText={setToken}
                  editable={!isLoading}
                />
                {tokenError ? (
                  <Text style={styles.errorText}>{tokenError}</Text>
                ) : (
                  <View style={styles.codeHelp}>
                    <Text style={styles.codeHelpText}>Didn't receive the code?</Text>
                    <TouchableOpacity 
                      style={styles.resendButton}
                      onPress={handleResetPassword}
                      disabled={isLoading}
                    >
                      <Text style={styles.resendText}>Resend</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              
              <TouchableOpacity
                style={[
                  styles.button,
                  isLoading && styles.buttonDisabled
                ]}
                onPress={handleContinueWithToken}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Verify & Continue</Text>
                )}
              </TouchableOpacity>
              
              <View style={styles.orContainer}>
                <View style={styles.divider} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.divider} />
              </View>
              
              <TouchableOpacity
                style={styles.manualTokenButton}
                onPress={handleManualTokenFromEmailClick}
                disabled={isLoading}
              >
                <Text style={styles.manualTokenText}>
                  Use full token from email
                </Text>
              </TouchableOpacity>
              
              {/* Option to go back to email input */}
              <TouchableOpacity
                style={[styles.linkButton, { marginTop: 8 }]}
                onPress={handleBackToEmail}
                disabled={isLoading}
              >
                <Text style={styles.linkText}>Need to change email?</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPassword;