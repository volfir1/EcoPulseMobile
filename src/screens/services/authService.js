// services/authService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { auth } from '../../firebase/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  confirmPasswordReset
} from 'firebase/auth';

const API_URL = 'http://localhost:5000/api'; // Your backend URL

class AuthService {
  // Check authentication status
  async checkAuthStatus() {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        // Try to get from AsyncStorage
        const userData = await AsyncStorage.getItem('user');
        if (!userData) {
          return { success: false, message: 'No user found' };
        }
        
        return { success: true, user: JSON.parse(userData) };
      }
      
      // User is logged in with Firebase
      return {
        success: true,
        user: {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          emailVerified: currentUser.emailVerified,
          photoURL: currentUser.photoURL
        }
      };
    } catch (error) {
      console.error('Auth check error:', error);
      return { success: false, message: error.message };
    }
  }
  
  // Register a new user
  async register(userData) {
    try {
      const { email, password, firstName, lastName } = userData;
      
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile
      await user.updateProfile({
        displayName: `${firstName} ${lastName}`
      });
      
      // Send verification email
      await sendEmailVerification(user);
      
      // Optionally send user data to your backend
      try {
        await axios.post(`${API_URL}/users`, {
          firebaseUid: user.uid,
          email,
          firstName,
          lastName
        });
      } catch (backendError) {
        console.error('Backend registration error:', backendError);
        // Continue even if backend registration fails
      }
      
      return {
        success: true,
        userId: user.uid,
        requireVerification: true,
        message: 'Please check your email for verification instructions'
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw { success: false, message: error.message };
    }
  }
  
  // Login with email/password
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if verification is required
      if (!user.emailVerified) {
        return {
          success: false,
          requireVerification: true,
          userId: user.uid,
          message: 'Please verify your email before logging in'
        };
      }
      
      // Get user token
      const token = await user.getIdToken();
      
      // Store user data
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        accessToken: token
      };
      
      await this.storeUserData(userData);
      
      return {
        success: true,
        user: userData,
        message: 'Login successful'
      };
    } catch (error) {
      console.error('Login error:', error);
      throw { success: false, message: error.message };
    }
  }
  
  // Forgot password
  async forgotPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      console.error('Forgot password error:', error);
      throw { success: false, message: error.message };
    }
  }
  
  // Logout user
  async logout() {
    try {
      await signOut(auth);
      await this.clearUserData();
      return { success: true, message: 'Logout successful' };
    } catch (error) {
      console.error('Logout error:', error);
      await this.clearUserData();
      return { success: true, message: 'Locally logged out' };
    }
  }
  
  // Store user data in AsyncStorage
  async storeUserData(user) {
    if (!user) return;
    
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      if (user.accessToken) {
        await AsyncStorage.setItem('accessToken', user.accessToken);
      }
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }
  
  // Clear user data from AsyncStorage
  async clearUserData() {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('accessToken');
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }
  
  // Get stored user
  async getUser() {
    try {
      const userData = await AsyncStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }
}

export default new AuthService();