// src/services/authService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { db, auth, isOnline } from '/src/context/firebase/firebase';
import NetInfo from '@react-native-community/netinfo';

// Determine the correct API URL based on device type and environment
const getApiUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://192.168.1.2:5000/api'; // For Android emulator
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:8080/api'; // For iOS simulator
  } else {
    // For physical devices, use your actual IP or domain
    return 'http://192.168.1.2:8080/api';
  }
};

// Create axios instance with defaults
const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
    'x-client-type': 'mobile'
  },
  timeout: 10000 // 10 second timeout
});

// Token keys for AsyncStorage
const ACCESS_TOKEN_KEY = 'ecopulse_access_token';
const REFRESH_TOKEN_KEY = 'ecopulse_refresh_token';
const USER_DATA_KEY = 'ecopulse_user';

// Last sync time key
const LAST_SYNC_KEY = 'ecopulse_last_sync';

// ----- Token Management -----

const storeTokens = async (accessToken, refreshToken) => {
  try {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    return true;
  } catch (error) {
    console.error('Error storing tokens:', error);
    return false;
  }
};

const getAccessToken = async () => {
  return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
};

const getRefreshToken = async () => {
  return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
};

const clearTokens = async () => {
  try {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_DATA_KEY);
    await AsyncStorage.removeItem(LAST_SYNC_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing tokens:', error);
    return false;
  }
};

// Store user data
const storeUser = async (userData) => {
  try {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    // Record sync time
    await AsyncStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
    return true;
  } catch (error) {
    console.error('Error storing user data:', error);
    return false;
  }
};

// Get stored user data
const getUser = async () => {
  try {
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

// Check if a user has been synced recently (within last 24 hours)
const hasRecentSync = async () => {
  try {
    const lastSync = await AsyncStorage.getItem(LAST_SYNC_KEY);
    if (!lastSync) return false;
    
    const lastSyncDate = new Date(lastSync);
    const now = new Date();
    const hoursSinceSync = (now - lastSyncDate) / (1000 * 60 * 60);
    
    return hoursSinceSync < 24; // Consider data fresh if synced in last 24 hours
  } catch (error) {
    console.error('Error checking sync status:', error);
    return false;
  }
};

// ----- Network Status Helpers -----

// Check if network is available
const checkNetwork = async () => {
  if (Platform.OS !== 'web') {
    const state = await NetInfo.fetch();
    return state.isConnected && state.isInternetReachable;
  }
  return navigator.onLine;
};

// ----- Request Interceptors -----

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      // Check network before making request
      const isNetworkAvailable = await checkNetwork();
      if (!isNetworkAvailable) {
        return Promise.reject(new Error('No network connection available'));
      }
      
      // Add auth token
      const token = await getAccessToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

// Handle token refresh in responses
api.interceptors.response.use(
  (response) => {
    // Check if response contains a new token
    if (response.data && response.data.newToken) {
      // Store the new token
      AsyncStorage.setItem(ACCESS_TOKEN_KEY, response.data.newToken);
      // Remove it from the response data
      delete response.data.newToken;
    }
    return response;
  },
  async (error) => {
    // Check if error is due to network
    if (!error.response) {
      console.log('Network error or timeout detected');
      return Promise.reject(new Error('Network error or request timeout'));
    }
    
    const originalRequest = error.config;
    
    // If 401 error (Unauthorized) and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry && error.response?.data?.requireRefresh) {
      originalRequest._retry = true;
      
      try {
        // Get the refresh token
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
          // No refresh token, force logout
          await logout();
          return Promise.reject(new Error('Authentication required. Please login again.'));
        }
        
        // Call the refresh token endpoint
        const response = await axios.post(`${getApiUrl()}/auth/refresh-token`, 
          { refreshToken },
          { headers: { 'x-client-type': 'mobile' } }
        );
        
        if (response.data.accessToken) {
          // Store the new tokens
          await storeTokens(response.data.accessToken, response.data.refreshToken || refreshToken);
          
          // Update the Authorization header with new token
          originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
          
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed, force logout
        await logout();
        return Promise.reject(new Error('Your session has expired. Please login again.'));
      }
    }
    
    return Promise.reject(error);
  }
);


// Register

const register = async (userData) => {
  try {
    console.log('Registering new user:', userData.email);
    
    // Add clientType for mobile
    const registrationData = {
      ...userData,
      clientType: 'mobile'
    };
    
    const response = await api.post('auth/register', registrationData);
    
    console.log('Registration response:', response);
    
    if (response.data && response.data.success) {
      // Store tokens if available
      if (response.data.tokens) {
        await storeTokens(
          response.data.tokens.accessToken, 
          response.data.tokens.refreshToken
        );
      } else if (response.data.user && response.data.user.accessToken) {
        await storeTokens(
          response.data.user.accessToken, 
          response.data.user.refreshToken
        );
      }
      
      // Store user data
      if (response.data.user) {
        await storeUser(response.data.user);
      }
      
      // Make sure we return the userId from the response
      return {
        success: true,
        user: response.data.user,
        requireVerification: response.data.requireVerification || true,
        message: response.data.message || 'Registration successful',
        userId: response.data.userId // Add this line to include userId in the return
      };
    } else {
      throw new Error(response.data?.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
    
    // Extract error message from response if available
    const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Registration failed. Please try again.';
    
    return {
      success: false,
      message: errorMessage
    };
  }
};
// ----- Firebase Auth + MongoDB Hybrid Methods -----

// Login with email and password (with Firebase)
const login = async (email, password, options = {}) => {
  const { skipFirebase = false } = options;
  let user = null;
  let firebaseError = null;
  let mongoSuccess = false;
  
  console.log(`Login attempt for ${email}, skipFirebase=${skipFirebase}`);
  
  // Try to get cached user data first if offline
  const isNetworkAvailable = await checkNetwork();
  const cachedUser = await getUser();
  
  if (!isNetworkAvailable && cachedUser && cachedUser.email === email) {
    console.log('Network unavailable, using cached user data');
    const hasRecentData = await hasRecentSync();
    
    if (hasRecentData) {
      return {
        success: true,
        user: cachedUser,
        fromCache: true,
        message: 'Using cached credentials while offline'
      };
    }
  }
  
  // Step 1: Try Firebase authentication if not skipped
  if (!skipFirebase) {
    try {
      console.log('Attempting Firebase authentication...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get Firestore user data if available
      try {
        if (isOnline()) {
          const userDocRef = doc(db, 'users', userCredential.user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const firestoreData = userDoc.data();
            user = {
              id: userCredential.user.uid,
              email: userCredential.user.email,
              emailVerified: userCredential.user.emailVerified,
              firstName: firestoreData.firstName || '',
              lastName: firestoreData.lastName || '',
              role: firestoreData.role || 'user',
              avatar: firestoreData.avatar || 'default-avatar',
              isVerified: true,
              firebaseUser: true
            };
            
            // Update last login in Firestore if online
            try {
              await updateDoc(userDocRef, {
                lastLogin: new Date(),
                lastActivity: new Date()
              });
            } catch (updateError) {
              console.warn('Could not update last login time:', updateError);
            }
          }
        } else {
          console.log('Firebase authentication successful but offline, minimal user info available');
          user = {
            id: userCredential.user.uid,
            email: userCredential.user.email,
            emailVerified: userCredential.user.emailVerified,
            isVerified: true,
            firebaseUser: true
          };
        }
      } catch (firestoreError) {
        console.error('Error fetching Firestore user data:', firestoreError);
        // Continue with basic user info
        user = {
          id: userCredential.user.uid,
          email: userCredential.user.email,
          emailVerified: userCredential.user.emailVerified,
          isVerified: true,
          firebaseUser: true
        };
      }
    } catch (error) {
      console.log('Firebase authentication failed:', error.code, error.message);
      firebaseError = error;
    }
  }
  
  // Step 2: Try MongoDB authentication
  try {
    if (isNetworkAvailable) {
      console.log('Attempting MongoDB authentication...');
      const response = await api.post('/auth/login', {
        email,
        password,
        clientType: 'mobile',
        firebaseAuthFailed: firebaseError !== null
      });
      
      if (response.data.success) {
        mongoSuccess = true;
        
        // Store tokens if available
        if (response.data.user.accessToken) {
          await storeTokens(
            response.data.user.accessToken, 
            response.data.user.refreshToken || null
          );
        }
        
        // Use MongoDB user data which is more complete
        user = {
          ...response.data.user,
          mongoUser: true
        };
        
        await storeUser(user);
      }
    } else {
      console.log('Network unavailable, skipping MongoDB authentication');
    }
  } catch (error) {
    console.error('MongoDB authentication failed:', error.response?.data || error);
    
    // If both Firebase and MongoDB auth failed, throw error
    if (!user) {
      throw error.response?.data || error;
    }
  }
  
  // Result determination
  if (user) {
    return {
      success: true,
      user,
      firebaseAuth: !skipFirebase && firebaseError === null,
      mongoAuth: mongoSuccess
    };
  } else {
    // Both auth methods failed
    throw new Error(firebaseError?.message || 'Authentication failed');
  }
};

// Google sign-in
const googleSignIn = async (token, user) => {
  try {
    console.log('Calling backend API for Google Sign-In with token and user info:', user.email);
    
    // Make API request to your backend
    const response = await api.post('/auth/google-signin', {
      token,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoUrl,
      uid: user.id,
      clientType: 'mobile'
    });
    
    if (response.data.success) {
      console.log('Backend Google auth successful, storing user data and tokens');
      
      // Store tokens if provided
      if (response.data.user.accessToken && response.data.user.refreshToken) {
        await storeTokens(response.data.user.accessToken, response.data.user.refreshToken);
      } else if (response.data.tokens) {
        await storeTokens(
          response.data.tokens.accessToken, 
          response.data.tokens.refreshToken || null
        );
      }
      
      // Store the user data
      await storeUser(response.data.user);
      
      // Record sync time
      await AsyncStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
      
      return {
        success: true,
        user: response.data.user,
        message: response.data.message || 'Successfully signed in with Google'
      };
    } else {
      throw new Error(response.data?.message || 'Google sign-in failed on the server');
    }
  } catch (error) {
    console.error('Google sign-in API error:', error.response?.data || error);
    
    // Try to provide a more specific error message
    const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Failed to sign in with Google. Please try again.';
    
    return {
      success: false,
      message: errorMessage
    };
  }
};

// Verify auth
const verifyAuth = async () => {
  try {
    const response = await api.get('/auth/verify');
    
    if (response.data.success && response.data.tokens) {
      await storeTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken);
    }
    
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear local storage
      await clearTokens();
    }
    throw error.response?.data || error;
  }
};

const verifyEmail = async (userId, verificationCode) => {
  try {
    const response = await api.post('auth/verify-email', {
      userId,
      verificationCode,
      clientType: 'mobile'
    });
    
    return response.data;
  } catch (error) {
    console.error('Email verification error:', error);
    throw error;
  }
};
// Logout from the system
const logout = async () => {
  try {
    // Call logout API endpoint if online
    if (await checkNetwork()) {
      await api.post('/auth/logout', { clientType: 'mobile' });
    }
  } catch (error) {
    console.error('Logout API error:', error);
  }
  
  // Always clear tokens regardless of API response
  return await clearTokens();
};

// Check if user is logged in
const isAuthenticated = async () => {
  const token = await getAccessToken();
  const user = await getUser();
  return !!token && !!user;
};

const resendVerificationCode = async (userId) => {
  try {
    console.log('Requesting new verification code for userId:', userId);
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const response = await api.post('auth/resend-verification', {
      userId,
      clientType: 'mobile'
    });
    
    console.log('Resend verification response:', response.data);
    
    if (response.data && response.data.success) {
      return {
        success: true,
        message: response.data.message || 'Verification code sent successfully'
      };
    } else {
      throw new Error(response.data?.message || 'Failed to send verification code');
    }
  } catch (error) {
    console.error('Resend verification error:', error);
    
    // Extract error message from response if available
    const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Failed to send verification code. Please try again.';
    
    return {
      success: false,
      message: errorMessage
    };
  }
};

const forgotPassword = async (email) => {
  if (!email) throw new Error("Email is required");

  try {
    console.log('Sending password reset request:', {
      email,
      url: `${API_URL}/auth/forgot-password`
    });

    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ email }),
      credentials: "include"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to process password reset request");
    }

    return {
      success: true,
      message: data.message || "If that email address is in our database, we will send a password reset link."
    };
  } catch (error) {
    console.error("Forgot password error:", {
      error,
      message: error.message
    });
    throw error;
  }
};
const requestReactivation = async (email) => {
  try {
    const response = await api.post('auth/request-reactivation', { 
      email,
      clientType: 'mobile'
    });
    
    return response.data;
  } catch (error) {
    console.error('Reactivation request error:', error);
    throw error;
  }
};


const updateUserProfile = async (userData) => {
  try {
    // Check network connectivity
    const isNetworkAvailable = await checkNetwork();
    
    if (isNetworkAvailable) {
      // Make API call to update user profile
      const response = await api.put('/users/profile', {
        ...userData,
        clientType: 'mobile'
      });
      
      if (response.data && response.data.success) {
        // Update stored user data
        const currentUser = await getUser();
        const updatedUser = {
          ...currentUser,
          ...userData
        };
        
        await storeUser(updatedUser);
        
        return {
          success: true,
          user: updatedUser
        };
      } else {
        throw new Error(response.data?.message || 'Failed to update profile');
      }
    } else {
      // Offline mode - just update local storage
      const currentUser = await getUser();
      if (!currentUser) {
        throw new Error('User data not found');
      }
      
      const updatedUser = {
        ...currentUser,
        ...userData,
        _pendingSync: true // Mark for later sync when online
      };
      
      await storeUser(updatedUser);
      
      return {
        success: true,
        user: updatedUser,
        offlineMode: true
      };
    }
  } catch (error) {
    console.error('Update profile error:', error);
    return {
      success: false,
      message: error.message || 'Failed to update profile'
    };
  }
};


// ----- Export Service -----

const authService = {
  login,
  googleSignIn,
  verifyAuth,
  logout,
  isAuthenticated,
  getUser,
  storeUser,
  getAccessToken,
  getRefreshToken,
  checkNetwork,
  hasRecentSync,
  register,
  requestReactivation,
  verifyEmail,
  resendVerificationCode,
  getApiUrl,
  forgotPassword,
  updateUserProfile
};

export default authService;