// src/features/auth/hooks/useChangePassword.js
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from 'src/context/AuthContext';
import { useProfile } from 'src/context/profileContext';
import * as Yup from 'yup';
import { useFormik } from 'formik';

export const useChangePassword = (navigation) => {
  // Get current user from AuthContext
  const { user } = useAuth();
  
  // Get profile context functions and state
  const { changePassword, loading: profileLoading } = useProfile();
  
  // Local state
  const [localLoading, setLocalLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isGoogleAccount, setIsGoogleAccount] = useState(false);
  
  // Check if user has a Google account
  useEffect(() => {
    if (user?.googleId) {
      setIsGoogleAccount(true);
    }
  }, [user]);
  
  // Combined loading state
  const loading = localLoading || profileLoading;
  
  // Validation schema with Yup
  const validationSchema = Yup.object({
    currentPassword: Yup.string()
      .required('Current password is required'),
    newPassword: Yup.string()
      .required('New password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: Yup.string()
      .required('Please confirm your new password')
      .oneOf([Yup.ref('newPassword')], "Passwords don't match")
  });
  
  // Setup Formik
  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      // Handle Google account
      if (isGoogleAccount) {
        Alert.alert(
          "Google Account",
          "Google-authenticated accounts cannot change passwords here. Please use Google's account settings to manage your password.",
          [{ text: "OK" }]
        );
        return;
      }
      
      // Set local loading state
      setLocalLoading(true);
      
      try {
        // Call the changePassword function from ProfileContext
        // This is using your existing implementation from ProfileContext
        const success = await changePassword(
          values.currentPassword,
          values.newPassword
        );
        
        if (success) {
          // Reset form
          formik.resetForm();
          
          // Show success message
          setShowSuccess(true);
          
          // Navigate back after a delay
          setTimeout(() => {
            navigation.goBack();
          }, 2000);
        } else {
          Alert.alert("Error", "Failed to update password. Please try again.");
        }
      } catch (error) {
        console.error("Password change error:", error);
        
        // Handle specific error cases
        if (error.message?.includes("current password")) {
          formik.setFieldError('currentPassword', "Current password is incorrect");
        } else if (error.message?.includes("Google") || 
                  error.message?.includes("social login")) {
          setIsGoogleAccount(true);
          Alert.alert(
            "Google Account",
            "Google-authenticated accounts cannot change passwords here. Please use Google's account settings to manage your password."
          );
        } else {
          Alert.alert("Error", error.message || "Failed to update password");
        }
      } finally {
        setLocalLoading(false);
      }
    }
  });
  
  // Password strength evaluation function
  const getPasswordStrength = (password) => {
    if (!password) return null;
    
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const isLongEnough = password.length >= 8;
    
    const score = [hasUppercase, hasLowercase, hasNumber, hasSpecial, isLongEnough]
      .filter(Boolean).length;
    
    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
  };
  
  // Return values that the component will use
  return {
    formik,
    loading,
    showSuccess,
    isGoogleAccount,
    getPasswordStrength
  };
};