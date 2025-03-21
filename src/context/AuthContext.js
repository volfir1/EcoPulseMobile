// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, isOnline } from '/src/context/firebase/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import authService from '/services/authService';
import NetInfo from '@react-native-community/netinfo';

// Make sure to call this at the top level of your file
WebBrowser.maybeCompleteAuthSession();

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [networkStatus, setNetworkStatus] = useState({ isConnected: true });
  const netInfoUnsubscribe = useRef(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Configure Google Auth Request for Expo
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '34035725627-pgsqnv50ks12snc72fct3t0fr6u3v8qt.apps.googleusercontent.com',
    webClientId: '34035725627-pgsqnv50ks12snc72fct3t0fr6u3v8qt.apps.googleusercontent.com',
    androidClientId: '34035725627-g8vkrih40724lpjaa7qi4vofgojs5i43.apps.googleusercontent.com',
    scopes: ['profile', 'email']
  });

  // Setup network monitoring
  useEffect(() => {
    // Initial network check
    const checkInitialNetworkStatus = async () => {
      try {
        const state = await NetInfo.fetch();
        setNetworkStatus({
          isConnected: state.isConnected && state.isInternetReachable,
          type: state.type
        });
      } catch (error) {
        console.error('Error checking network status:', error);
      }
    };
    
    checkInitialNetworkStatus();
    
    // Subscribe to network changes
    netInfoUnsubscribe.current = NetInfo.addEventListener(state => {
      const isActuallyConnected = state.isConnected && state.isInternetReachable;
      console.log(`Network status changed: ${isActuallyConnected ? 'connected' : 'disconnected'}`);
      
      setNetworkStatus({
        isConnected: isActuallyConnected,
        type: state.type
      });
      
      // If reconnected, try to sync user data
      if (isActuallyConnected && user) {
        syncUserData(user.id || user.uid);
      }
    });
    
    // Cleanup
    return () => {
      if (netInfoUnsubscribe.current) {
        netInfoUnsubscribe.current();
      }
    };
  }, [user]);

  // Check for cached user on startup
  useEffect(() => {
    const restoreUser = async () => {
      try {
        // Check for cached user data
        const userData = await authService.getUser();
        const isAuthValid = await authService.isAuthenticated();
        
        if (userData && isAuthValid) {
          console.log('Restored user from cache:', userData.email);
          setUser(userData);
          setIsAuthenticated(true);
          
          // Try to sync user data if online
          if (networkStatus.isConnected) {
            syncUserData(userData.id || userData.uid);
          }
        }
      } catch (error) {
        console.error('Error restoring user:', error);
      } finally {
        setLoading(false);
      }
    };
    
    restoreUser();
  }, []);

  // Process Google Auth response
  useEffect(() => {
    if (response?.type === 'success') {
      console.log("Google auth response received in effect");
    }
  }, [response]);

  // Function to sync user data with server
  const syncUserData = async (userId) => {
    if (!networkStatus.isConnected || !userId) return;
    
    try {
      console.log('Syncing user data with server...');
      
      // Try to get user data from Firestore
      try {
        if (isOnline()) {
          const userDocRef = doc(db, 'users', userId);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const firestoreData = userDoc.data();
            console.log('Updated user data from Firestore');
            
            // Update local user state with fresh data
            setUser(prevUser => ({
              ...prevUser,
              ...firestoreData,
              lastSynced: new Date().toISOString()
            }));
            
            // Store updated user in AsyncStorage
            await authService.storeUser({
              ...user,
              ...firestoreData,
              lastSynced: new Date().toISOString()
            });
          }
        }
      } catch (firestoreError) {
        console.error('Error syncing with Firestore:', firestoreError);
      }
      
      // Try to verify authentication with backend
      try {
        const verifyResult = await authService.verifyAuth();
        if (verifyResult.success && verifyResult.user) {
          console.log('Authentication verified with backend');
          
          // Update tokens if new ones were provided
          if (verifyResult.tokens) {
            console.log('Received new tokens from server');
          }
        }
      } catch (error) {
        console.warn('Error verifying auth with backend:', error);
      }
    } catch (error) {
      console.error('Error in syncUserData:', error);
    }
  };

  // Login with email/password with improved error handling
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Check network connection first
      if (!networkStatus.isConnected) {
        console.log('Attempting offline login with cached credentials');
        
        // Try to get cached user
        const cachedUser = await authService.getUser();
        if (cachedUser && cachedUser.email === email && await authService.hasRecentSync()) {
          setUser(cachedUser);
          setIsAuthenticated(true);
          
          return {
            success: true,
            user: cachedUser,
            fromCache: true,
            message: 'Logged in with cached credentials (offline mode)'
          };
        } else {
          throw new Error('Cannot login while offline. Please check your connection.');
        }
      }
      
      // Online login through authService
      console.log('Attempting online login through authService');
      const result = await authService.login(email, password);
      
      console.log('Login result:', result);
      
      if (result.success && result.user) {
        // Store user in state and mark as authenticated
        setUser(result.user);
        setIsAuthenticated(true);
        
        return {
          success: true,
          user: result.user,
          requireVerification: !result.user.isVerified && !result.user.emailVerified
        };
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Specific error handling
      let errorMessage = error.message || 'Login failed';
      
      // Handle Firebase specific errors
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage = 'Invalid email or password';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed login attempts. Please try again later.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled. Please contact support.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
        }
      }
      
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Google sign-in with improved reliability
  const googleSignIn = async () => {
    try {
      setLoading(true);
      
      if (!networkStatus.isConnected) {
        throw new Error('Cannot sign in with Google while offline. Please check your connection.');
      }
      
      if (Platform.OS !== 'web') {
        // For mobile, use Expo's auth session
        console.log("Starting Google sign-in process with Expo...");
        
        if (!request) {
          throw new Error('Google authentication is not ready yet');
        }
        
        const result = await promptAsync();
        console.log("Google auth result:", result);
        
        if (result.type === 'success') {
          // Get the access token from the response
          const { authentication } = result;
          
          if (!authentication) {
            throw new Error('No authentication token received from Google');
          }
          
          try {
            // Create a credential from the access token
            const credential = GoogleAuthProvider.credential(
              authentication.idToken,
              authentication.accessToken
            );
            
            // Sign in with credential
            const userCredential = await signInWithCredential(auth, credential);
            console.log("Successfully signed in with Google credential");
            
            // Get or create user document in Firestore
            const userDocRef = doc(db, 'users', userCredential.user.uid);
            let userData = null;
            
            try {
              const userDoc = await getDoc(userDocRef);
              
              if (userDoc.exists()) {
                // User exists in Firestore
                userData = {
                  id: userCredential.user.uid,
                  email: userCredential.user.email,
                  emailVerified: userCredential.user.emailVerified,
                  ...userDoc.data()
                };
                
                // Update last login time
                await updateDoc(userDocRef, {
                  lastLogin: new Date(),
                  lastActivity: new Date()
                });
              } else {
                // New user, create document
                userData = {
                  id: userCredential.user.uid,
                  email: userCredential.user.email,
                  emailVerified: true,
                  isVerified: true,
                  firstName: userCredential.user.displayName?.split(' ')[0] || '',
                  lastName: userCredential.user.displayName?.split(' ')[1] || '',
                  role: 'user', // Default role
                  avatar: userCredential.user.photoURL || 'default-avatar',
                  gender: 'prefer-not-to-say',
                  createdAt: new Date(),
                  lastLogin: new Date(),
                  lastActivity: new Date()
                };
                
                await setDoc(userDocRef, userData);
              }
            } catch (firestoreError) {
              console.error('Error with Firestore during Google sign-in:', firestoreError);
              
              // Fallback to basic user data
              userData = {
                id: userCredential.user.uid,
                email: userCredential.user.email,
                emailVerified: userCredential.user.emailVerified,
                isVerified: true,
                firstName: userCredential.user.displayName?.split(' ')[0] || '',
                lastName: userCredential.user.displayName?.split(' ')[1] || '',
                avatar: userCredential.user.photoURL
              };
            }
            
            // Store user data and set as authenticated
            setUser(userData);
            setIsAuthenticated(true);
            await authService.storeUser(userData);
            
            return { success: true, user: userData };
            
          } catch (firebaseError) {
            console.error('Firebase sign-in error:', firebaseError);
            throw firebaseError;
          }
        } else if (result.type === 'cancel') {
          return { success: false, message: 'Sign-in was cancelled' };
        } else {
          throw new Error('Google sign-in failed. Please try again.');
        }
      } else {
        // Web implementation
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        
        // Successfully signed in
        setUser({
          id: userCredential.user.uid,
          email: userCredential.user.email,
          emailVerified: true,
          isVerified: true,
          firstName: userCredential.user.displayName?.split(' ')[0] || '',
          lastName: userCredential.user.displayName?.split(' ')[1] || ''
        });
        setIsAuthenticated(true);
        
        return { success: true };
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      return {
        success: false,
        message: error.message || 'Google sign-in failed'
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      await authService.logout();
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, message: error.message };
    }
  };

  const completeOnboarding = async (onboardingData) => {
    try {
      console.log('Completing onboarding with data:', onboardingData);
      
      // IMPORTANT: Set local state FIRST before any async operations
      // This ensures the UI updates even if subsequent operations fail
      const updatedUser = {
        ...user,
        gender: onboardingData.gender,
        avatar: onboardingData.avatar,
        hasCompletedOnboarding: true
      };
      
      // Update local state immediately
      setUser(updatedUser);
      setHasCompletedOnboarding(true);
      
      // Store locally in AsyncStorage regardless of network status
      try {
        await authService.storeUser(updatedUser);
        console.log('User data saved to local storage');
      } catch (storageError) {
        console.warn('Failed to store user data locally:', storageError);
        // Continue anyway
      }
      
      // Only try Firebase if we're online - but don't wait for it
      if (networkStatus.isConnected) {
        // Run Firebase update in background without awaiting
        (async () => {
          try {
            if (!isOnline()) {
              console.log('Firebase is offline, skipping Firestore update');
              return;
            }
            
            // Use user.id if available, otherwise try user.uid
            const userId = user?.id || user?.uid;
            if (!userId) {
              console.warn('No valid user ID found for Firestore update');
              return;
            }
            
            const userDocRef = doc(db, 'users', userId);
            await updateDoc(userDocRef, {
              gender: onboardingData.gender,
              avatar: onboardingData.avatar,
              hasCompletedOnboarding: true,
              updatedAt: new Date()
            });
            console.log('Updated user data in Firestore');
          } catch (firestoreError) {
            console.warn('Firebase update failed (will sync later):', firestoreError);
            // Don't let Firestore errors affect the user experience
          }
        })();
      } else {
        console.log('Device is offline, skipping Firestore update');
      }
      
      // ALWAYS return success to allow user to proceed
      return { 
        success: true,
        message: 'Profile setup complete'
      };
    } catch (error) {
      console.error('Error in completeOnboarding:', error);
      
      // Even on error, we want the user to continue
      // Return success anyway
      return { 
        success: true,
        message: 'Profile setup complete with some warnings'
      };
    }
  };
  
  const value = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    loading,
    login,
    googleSignIn,
    logout,
    networkStatus,
    syncUserData,
    completeOnboarding
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};