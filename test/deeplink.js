// utils/linking.js
import { Platform } from 'react-native';
import { getStateFromPath as defaultGetStateFromPath, getPathFromState as defaultGetPathFromState } from '@react-navigation/native';

/**
 * Deep linking configuration for the app
 * This defines which URLs can open the app and how they map to screens
 */
const linking = {
  prefixes: [
    // Custom URL scheme
    'ecopulse://',
    
    // Universal links for iOS and Android (replace with your domain)
    'https://ecopulse.app',
    
    // For development/testing
    'https://auth.expo.io/@lester20/EcoPulseMobile'
  ],
  
  // Configuration for matching paths to screens
  config: {
    // Initial route name to look for (same as in your stack)
    initialRouteName: 'Auth',
    
    screens: {
      // Auth Stack screens
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
          ResetPassword: {
            path: 'reset-password',
            parse: {
              // Parse the token parameter from the URL
              token: (token) => token
            }
          },
          VerifyEmail: {
            path: 'verify-email',
            parse: {
              email: (email) => decodeURIComponent(email),
              userId: (userId) => userId
            }
          }
        }
      },
      
      // Include Home/Main screen paths for completeness
      Home: {
        screens: {
          Main: 'home',
          Dashboard: 'dashboard',
          Profile: 'profile'
        }
      }
    }
  },
  
  // Define custom getStateFromPath function to handle complex path and parameter parsing
  getStateFromPath: (path, options) => {
    console.log("Deep link path received:", path);
    
    // Use the default parser function to provide a base implementation
    // This is required since we're customizing the function
    const defaultHandler = defaultGetStateFromPath || ((path, options) => { return { routes: [] }; });
    
    // Handle special case for reset password
    if (path.includes('reset-password')) {
      // Extract token from query parameters
      const tokenMatch = path.match(/[?&]token=([^&]+)/);
      const token = tokenMatch ? tokenMatch[1] : null;
      
      if (token) {
        console.log("Password reset token found:", token);
        
        // Navigate to ResetPassword screen with token
        return {
          routes: [
            {
              name: 'Auth',
              state: {
                routes: [
                  {
                    name: 'ResetPassword',
                    params: { token }
                  }
                ]
              }
            }
          ]
        };
      }
    }
    
    // For other paths, use the default behavior
    return defaultHandler(path, options);
  },
  
  // Custom function to convert state back to a path
  getPathFromState: (state, options) => {
    // Make sure we have access to the default implementation
    const defaultHandler = defaultGetPathFromState || ((state, options) => '');
    
    // Use the default implementation 
    return defaultHandler(state, options);
  },
};

export default linking;