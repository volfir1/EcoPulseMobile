// // context/AuthContext.js
// import React, { createContext, useState, useEffect, useContext } from 'react';
// import { auth } from '../firebase/firebase';
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged,
//   sendPasswordResetEmail,
//   sendEmailVerification,
//   GoogleAuthProvider,
//   signInWithCredential
// } from 'firebase/auth';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import Constants from 'expo-constants';
// import * as Linking from 'expo-linking';
// import * as WebBrowser from 'expo-web-browser';
// import { Platform } from 'react-native';

// const configureGoogleSignIn = () => {
//   GoogleSignin.configure({
//     webClientId: '34035725627-pgsqnv50ks12snc72fct3t0fr6u3v8qt.apps.googleusercontent.com',
//     offlineAccess: true
//   });
// };
// ;
// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [verificationData, setVerificationData] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     configureGoogleSignIn();
//   }, []);
//   // Listen for auth state changes
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
//       if (authUser) {
//         // User is signed in
//         const userData = {
//           uid: authUser.uid,
//           email: authUser.email,
//           displayName: authUser.displayName,
//           emailVerified: authUser.emailVerified,
//           photoURL: authUser.photoURL
//         };
        
//         await AsyncStorage.setItem('user', JSON.stringify(userData));
//         setUser(userData);
//       } else {
//         // User is signed out
//         await AsyncStorage.removeItem('user');
//         setUser(null);
//       }
//       setLoading(false);
//     });

//     // Check if there's a stored user when the app loads
//     const loadStoredUser = async () => {
//       const storedUser = await AsyncStorage.getItem('user');
//       if (storedUser) {
//         setUser(JSON.parse(storedUser));
//       }
//     };

//     loadStoredUser();

//     // Cleanup subscription
//     return () => unsubscribe();
//   }, []);

//   // Register a new user
//   const register = async (userData) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const { email, password, firstName, lastName } = userData;
      
//       // Create user with Firebase
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const newUser = userCredential.user;
      
//       // Update profile
//       await newUser.updateProfile({
//         displayName: `${firstName} ${lastName}`
//       });
      
//       // Send verification email
//       await sendEmailVerification(newUser);
      
//       setVerificationData({
//         userId: newUser.uid,
//         email
//       });
      
//       return {
//         success: true,
//         requireVerification: true,
//         userId: newUser.uid,
//         message: 'Please check your email for verification instructions'
//       };
//     } catch (error) {
//       console.error('Registration error:', error);
//       setError(error.message);
//       return {
//         success: false,
//         message: error.message
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Login with email/password
//   const login = async (email, password) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const loggedInUser = userCredential.user;
      
//       // Check if email is verified
//       if (!loggedInUser.emailVerified) {
//         setVerificationData({
//           userId: loggedInUser.uid,
//           email
//         });
        
//         return {
//           success: false,
//           requireVerification: true,
//           userId: loggedInUser.uid,
//           message: 'Please verify your email before logging in'
//         };
//       }
      
//       const userData = {
//         uid: loggedInUser.uid,
//         email: loggedInUser.email,
//         displayName: loggedInUser.displayName,
//         emailVerified: loggedInUser.emailVerified,
//         photoURL: loggedInUser.photoURL
//       };
      
//       await AsyncStorage.setItem('user', JSON.stringify(userData));
//       setUser(userData);
      
//       return {
//         success: true,
//         user: userData,
//         message: 'Login successful'
//       };
//     } catch (error) {
//       console.error('Login error:', error);
//       setError(error.message);
//       return {
//         success: false,
//         message: error.message
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const googleSignIn = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Check Play Services
//       await GoogleSignin.hasPlayServices();
      
//       // Perform Google Sign In
//       const { idToken } = await GoogleSignin.signIn();
      
//       // Create credential
//       const credential = GoogleAuthProvider.credential(idToken);
      
//       // Sign in to Firebase
//       const userCredential = await signInWithCredential(auth, credential);
      
//       // Format user data
//       const userData = {
//         uid: userCredential.user.uid,
//         email: userCredential.user.email,
//         displayName: userCredential.user.displayName,
//         photoURL: userCredential.user.photoURL,
//         emailVerified: true
//       };

//       // Store user data
//       await AsyncStorage.setItem('user', JSON.stringify(userData));
//       setUser(userData);

//       return {
//         success: true,
//         user: userData
//       };
//     } catch (error) {
//       console.error('Google Sign-In Error:', error);
//       setError(error.message);
//       return {
//         success: false,
//         message: error.message
//       };
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   // Forgot password
//   const forgotPassword = async (email) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       await sendPasswordResetEmail(auth, email);
      
//       return {
//         success: true,
//         message: 'Password reset email sent'
//       };
//     } catch (error) {
//       console.error('Forgot password error:', error);
//       setError(error.message);
//       return {
//         success: false,
//         message: error.message
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Verify email
//   const verifyEmail = async (code) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       // Force refresh the token to get the latest emailVerified status
//       if (auth.currentUser) {
//         await auth.currentUser.reload();
        
//         if (auth.currentUser.emailVerified) {
//           return {
//             success: true,
//             message: 'Your email has been verified'
//           };
//         } else {
//           return {
//             success: false,
//             message: 'Your email is not verified yet'
//           };
//         }
//       } else {
//         return {
//           success: false,
//           message: 'No user is signed in'
//         };
//       }
//     } catch (error) {
//       console.error('Verification error:', error);
//       setError(error.message);
//       return {
//         success: false,
//         message: error.message
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Resend verification email
//   const resendVerificationCode = async () => {
//     if (!auth.currentUser) {
//       return {
//         success: false,
//         message: 'No user is currently signed in'
//       };
//     }
    
//     try {
//       setLoading(true);
//       setError(null);
      
//       await sendEmailVerification(auth.currentUser);
      
//       return {
//         success: true,
//         message: 'Verification email sent'
//       };
//     } catch (error) {
//       console.error('Resend verification error:', error);
//       setError(error.message);
//       return {
//         success: false,
//         message: error.message
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Logout
//   const logout = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       // Sign out from Firebase
//       await signOut(auth);
//       await AsyncStorage.removeItem('user');
//       setUser(null);
      
//       return {
//         success: true,
//         message: 'Logout successful'
//       };
//     } catch (error) {
//       console.error('Logout error:', error);
//       setError(error.message);
//       return {
//         success: false,
//         message: error.message
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const value = {
//     user,
//     loading,
//     error,
//     verificationData,
//     isAuthenticated: !!user,
//     register,
//     login,
//     googleSignIn,
//     forgotPassword,
//     verifyEmail,
//     resendVerificationCode,
//     logout,
//     setError
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export default AuthContext;