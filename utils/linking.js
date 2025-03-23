// utils/linking.js
import { Platform } from 'react-native';
import { getStateFromPath, getPathFromState } from '@react-navigation/native';

const linking = {
  prefixes: [
    'ecopulse://',
    'https://ecopulse.app',
    'https://auth.expo.io/@lester20/EcoPulseMobile'
  ],

  config: {
    // Changed to match restored navigation state
    initialRouteName: 'Home',
    
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
          ResetPassword: {
            path: 'reset-password/:token',
            parse: {
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
      Home: {
        screens: {
          Main: 'home',
          Dashboard: 'dashboard',
          Profile: 'profile',
          // Add deep link targets for drawer screens
          Solar: 'energy/solar',
          Wind: 'energy/wind',
          Geo: 'energy/geothermal'
        }
      }
    }
  },

  getStateFromPath: (path, config) => {
    console.log("Processing deep link:", path);

    // Enhanced reset-password handling
    if (path.includes('reset-password')) {
      const token = path.split('token=')[1]?.split('&')[0];
      if (token) {
        console.log("Handling password reset deep link");
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

    // Fallback for other paths
    try {
      return getStateFromPath(path, config);
    } catch (error) {
      console.error('Path parsing error:', error);
      return {
        routes: [
          {
            name: 'Home',
            state: {
              routes: [{ name: 'Main' }]
            }
          }
        ]
      };
    }
  },

  getPathFromState: (state, config) => {
    // Add custom path generation for drawer screens
    const cleanState = {
      ...state,
      routes: state.routes.filter(route => route.name !== 'Main')
    };

    try {
      let path = getPathFromState(cleanState, config);
      
      // Handle nested drawer navigation
      if (path.includes('Home')) {
        path = path.replace(/Home\//, '');
      }
      
      return path;
    } catch (error) {
      console.error('State to path conversion failed:', error);
      return '/';
    }
  }
};

export default linking;