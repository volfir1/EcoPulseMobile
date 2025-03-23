// Add this to a new file: src/utils/tokenUtils.js
import axios from 'axios';
import authService from '/services/authService';

/**
 * Verify a password reset token's validity without attempting a reset
 * @param {string} token - The token to verify
 * @returns {Promise<Object>} Result object with validation status
 */
export const verifyResetToken = async (token) => {
  try {
    if (!token || typeof token !== 'string') {
      return {
        success: false,
        validToken: false,
        message: "Invalid token format"
      };
    }
    
    // Clean token (remove whitespace only)
    const cleanToken = token.trim();
    
    // Make API request to verify token
    const response = await axios.get(`${authService.getApiUrl()}/auth/verify-token`, {
      params: { token: cleanToken }
    });
    
    console.log("Token verification response:", response.data);
    
    // Return the server's response
    return {
      ...response.data,
      verified: true
    };
  } catch (error) {
    console.error("Token verification error:", error);
    
    // If we received a response with data, return it
    if (error.response?.data) {
      return {
        ...error.response.data,
        verified: true
      };
    }
    
    // Otherwise return a generic error
    return {
      success: false,
      validToken: false,
      verified: false,
      message: error.message || "Failed to verify token",
      error: error
    };
  }
};

/**
 * Request a new password reset token
 * @param {string} email - User's email address
 * @param {string} deviceType - Device type (for optimal email template)
 * @returns {Promise<Object>} Result of the token request
 */
export const requestFreshToken = async (email, deviceType = 'mobile') => {
  try {
    if (!email || !email.trim()) {
      return {
        success: false,
        message: "Email is required to request a token"
      };
    }
    
    // Request password reset via authService
    const result = await authService.forgotPassword(email.trim(), deviceType);
    
    return result;
  } catch (error) {
    console.error("Error requesting password reset token:", error);
    
    return {
      success: false,
      message: error.message || "Failed to request password reset token"
    };
  }
};