// src/utils/validation.js
/**
 * Validates password strength
 * @param {string} password - The password to validate
 * @returns {Object} - Validation result with isValid flag and any errors
 */
export const validatePassword = (password) => {
    const errors = [];
  
    // Check if password exists
    if (!password) {
      errors.push('Password is required');
      return { isValid: false, errors };
    }
  
    // Check minimum length
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
  
    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
  
    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
  
    // Check for number
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
  
    // Check for special character
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
  
    return {
      isValid: errors.length === 0,
      errors
    };
  };