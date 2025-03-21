// src/hooks/useForgotPassword.js
import { useState } from 'react';
import { useAuth } from '../src/context/AuthContext';

const useForgotPassword = (navigate) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const { forgotPassword } = useAuth();
  
  const handleResetPassword = async () => {
    // Reset messages
    setSuccessMessage('');
    setErrorMessage('');
    
    // Validate email
    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await forgotPassword(email);
      
      if (result.success) {
        setSuccessMessage(result.message);
        setEmail(''); // Clear the email field on success
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBackToLogin = () => {
    navigate('/login');
  };
  
  return {
    email,
    setEmail,
    isLoading,
    successMessage,
    errorMessage,
    handleResetPassword,
    handleBackToLogin
  };
};

export default useForgotPassword;