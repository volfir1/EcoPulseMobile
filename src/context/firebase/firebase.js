// src/firebase/firebase.js
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED,
  initializeFirestore,
  enableMultiTabIndexedDbPersistence,
  disableNetwork,
  enableNetwork
} from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

// Your Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyCBOCel_9whNOlbWEPIyXwQ6X98fvADlUw",
  authDomain: "ecopulse-ba84f.firebaseapp.com",
  projectId: "ecopulse-ba84f",
  storageBucket: "ecopulse-ba84f.appspot.com",
  messagingSenderId: "34035725627",
  appId: "1:34035725627:web:6a7df22ee4c2d0a61e9fa9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with settings optimized for mobile
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  experimentalForceLongPolling: true, // More reliable on mobile networks
  ignoreUndefinedProperties: true // Handle undefined values gracefully
});

// Initialize Auth
const auth = getAuth(app);

// Track network state
let isNetworkConnected = true;

// Enable offline persistence based on platform
const setupOfflinePersistence = async () => {
  try {
    if (Platform.OS === 'web') {
      // For web, use multi-tab persistence
      await enableMultiTabIndexedDbPersistence(db);
    } else {
      // For mobile, use standard persistence
      await enableIndexedDbPersistence(db);
    }
    console.log('Firestore offline persistence enabled successfully');
  } catch (error) {
    if (error.code === 'failed-precondition') {
      console.warn('Firestore persistence could not be enabled because multiple tabs are open');
    } else if (error.code === 'unimplemented') {
      console.warn('Firestore persistence is not available in this environment');
    } else {
      console.error('Error enabling Firestore persistence:', error);
    }
  }
};

// Setup network monitoring
const setupNetworkMonitoring = () => {
  return NetInfo.addEventListener(state => {
    console.log('Network state changed:', state.isConnected, state.isInternetReachable);
    
    const newIsConnected = state.isConnected && state.isInternetReachable;
    
    // Only take action when network state changes
    if (newIsConnected !== isNetworkConnected) {
      isNetworkConnected = newIsConnected;
      
      if (newIsConnected) {
        console.log('📶 Network reconnected, enabling Firestore');
        enableNetwork(db).then(() => {
          console.log('Firestore network connection enabled');
        });
      } else {
        console.log('📵 Network disconnected, disabling Firestore');
        disableNetwork(db).then(() => {
          console.log('Firestore network connection disabled');
        });
      }
    }
  });
};

// Initialize offline persistence and network monitoring
setupOfflinePersistence();
const unsubscribeFromNetInfo = setupNetworkMonitoring();

// Create a function to check if we're online
const isOnline = () => isNetworkConnected;

export { app, db, auth, isOnline, unsubscribeFromNetInfo };