import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import authService from '/services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEmailVerification } from 'hooks/verifyEmailHook';
import { styles, greenTheme } from 'styles/verifyEmailStyles';

const VerifyEmail = ({ route, navigation }) => {
  // Reference to the input field
  const inputRef = useRef(null);
  
  const {
    email,
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
  } = useEmailVerification(route, navigation, inputRef);

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

export default VerifyEmail;