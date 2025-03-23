// src/features/auth/screens/ChangePassword.jsx
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useChangePassword } from 'hooks/changePassword';
import styles, { greenTheme } from 'styles/changePasswordStyles';

// Password strength indicator component
const PasswordStrengthIndicator = ({ password, getPasswordStrength }) => {
  const strength = getPasswordStrength(password);
  
  if (!strength) return null;
  
  return (
    <View>
      <View style={styles.strengthIndicator}>
        <View style={[
          styles.strengthFill,
          strength === 'weak' && styles.strengthWeak,
          strength === 'medium' && styles.strengthMedium,
          strength === 'strong' && styles.strengthStrong,
        ]} />
      </View>
      <Text style={[
        styles.strengthText, 
        { 
          color: 
            strength === 'weak' ? greenTheme.ERROR : 
            strength === 'medium' ? greenTheme.WARNING : 
            greenTheme.SUCCESS,
        }
      ]}>
        {strength === 'weak' ? 'Weak password' : 
         strength === 'medium' ? 'Medium password' : 
         'Strong password'}
      </Text>
    </View>
  );
};

const ChangePassword = ({ navigation }) => {
  const {
    formik,
    loading,
    showSuccess,
    isGoogleAccount,
    getPasswordStrength
  } = useChangePassword(navigation);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={greenTheme.BACKGROUND} />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={greenTheme.TEXT} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={styles.backButton} />
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            {/* Success Message */}
            {showSuccess && (
              <View style={styles.successMessage}>
                <View style={styles.iconContainer}>
                  <Ionicons name="checkmark-circle" size={24} color={greenTheme.PRIMARY} />
                </View>
                <Text style={styles.successText}>
                  Password successfully updated!
                </Text>
              </View>
            )}
            
            {/* Google Account Info */}
            {isGoogleAccount ? (
              <View style={styles.googleAccountInfo}>
                <View style={styles.iconContainer}>
                  <Ionicons name="information-circle" size={24} color={greenTheme.INFO} />
                </View>
                <Text style={styles.infoText}>
                  You signed in with Google. To change your password, please visit your Google account settings.
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.title}>Change Your Password</Text>
                <Text style={styles.subtitle}>
                  Keep your account secure by updating your password regularly.
                </Text>
              
                {/* Current Password Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Current Password</Text>
                  <TextInput
                    style={[
                      styles.input,
                      formik.touched.currentPassword && formik.errors.currentPassword && styles.inputError
                    ]}
                    placeholder="Enter your current password"
                    placeholderTextColor={greenTheme.GRAY}
                    secureTextEntry
                    value={formik.values.currentPassword}
                    onChangeText={formik.handleChange('currentPassword')}
                    onBlur={formik.handleBlur('currentPassword')}
                    editable={!loading}
                  />
                  {formik.touched.currentPassword && formik.errors.currentPassword && (
                    <Text style={styles.errorText}>{formik.errors.currentPassword}</Text>
                  )}
                </View>
                
                {/* New Password Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>New Password</Text>
                  <TextInput
                    style={[
                      styles.input,
                      formik.touched.newPassword && formik.errors.newPassword && styles.inputError
                    ]}
                    placeholder="Enter new password"
                    placeholderTextColor={greenTheme.GRAY}
                    secureTextEntry
                    value={formik.values.newPassword}
                    onChangeText={formik.handleChange('newPassword')}
                    onBlur={formik.handleBlur('newPassword')}
                    editable={!loading}
                  />
                  
                  {formik.values.newPassword.length > 0 && (
                    <PasswordStrengthIndicator 
                      password={formik.values.newPassword} 
                      getPasswordStrength={getPasswordStrength}
                    />
                  )}
                  
                  {formik.touched.newPassword && formik.errors.newPassword ? (
                    <Text style={styles.errorText}>{formik.errors.newPassword}</Text>
                  ) : (
                    <View style={styles.passwordRequirements}>
                      <Text style={styles.requirementText}>• At least 8 characters</Text>
                      <Text style={styles.requirementText}>• At least one uppercase letter</Text>
                      <Text style={styles.requirementText}>• At least one lowercase letter</Text>
                      <Text style={styles.requirementText}>• At least one number</Text>
                      <Text style={styles.requirementText}>• At least one special character</Text>
                    </View>
                  )}
                </View>
                
                {/* Confirm Password Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Confirm New Password</Text>
                  <TextInput
                    style={[
                      styles.input,
                      formik.touched.confirmPassword && formik.errors.confirmPassword && styles.inputError
                    ]}
                    placeholder="Confirm new password"
                    placeholderTextColor={greenTheme.GRAY}
                    secureTextEntry
                    value={formik.values.confirmPassword}
                    onChangeText={formik.handleChange('confirmPassword')}
                    onBlur={formik.handleBlur('confirmPassword')}
                    editable={!loading}
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <Text style={styles.errorText}>{formik.errors.confirmPassword}</Text>
                  )}
                </View>
                
                {/* Submit Button */}
                <TouchableOpacity
                  style={[
                    styles.button,
                    loading && styles.buttonDisabled
                  ]}
                  onPress={formik.handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text style={styles.buttonText}>Update Password</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChangePassword;