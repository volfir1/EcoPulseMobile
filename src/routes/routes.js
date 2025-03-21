// src/routes/routes.js - Modified with error handling
import React, { lazy, Suspense } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import ErrorBoundary from '@components/ErrorBoundary';

// Suspense fallback component
const LoadingComponent = () => (
  <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center' }} />
);

// Fallback component when imports fail
const ImportErrorComponent = ({ componentName, error }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#dc3545' }}>
      Failed to load {componentName}
    </Text>
    <Text>{error?.message || 'Unknown error'}</Text>
  </View>
);

// Enhanced wrapper for lazy components with error handling
const createLazyComponent = (importFunc, componentName) => {
  const LazyComponent = lazy(() => 
    importFunc()
      .then(module => {
        // Check if the module has a default export
        if (!module.default) {
          console.error(`Module ${componentName} does not have a default export!`);
          throw new Error(`${componentName} does not have a default export`);
        }
        return module;
      })
      .catch(err => {
        console.error(`Failed to load component ${componentName}:`, err);
        // Return a fallback component instead of undefined
        return {
          default: props => (
            <ImportErrorComponent componentName={componentName} error={err} {...props} />
          )
        };
      })
  );
  
  return (props) => (
    <ErrorBoundary>
      <Suspense fallback={<LoadingComponent />}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

// Regular imports for critical screens that should load immediately
// These screens will be included in the main bundle
const OnboardingScreen = require('../screens/Onboarding').default;
const OnboardRegisterScreen = require('../screens/OnboardRegisterScreen').default;
const Home = require('../screens/Home').default;

// Public Routes with named components for better error tracking
export const publicRoutes = {
  // Immediate loaded routes for critical screens
  Onboard: OnboardingScreen,
  OnboardRegister: OnboardRegisterScreen,
  
  // Lazy loaded routes with component names for error tracking
  Login: createLazyComponent(() => import('../screens/Login'), 'Login'),
  Register: createLazyComponent(() => import('../screens/Register'), 'Register'),
  VerifyEmail: createLazyComponent(() => import('../screens/EmailVerification'), 'VerifyEmail'),
  ForgotPassword: createLazyComponent(() => import('../screens/ForgotPassword'), 'ForgotPassword'),
  ResetPassword: createLazyComponent(() => import('../screens/ResetPassword'), 'ResetPassword')
};

// User routes with named components for better error tracking
export const userRoutes = {
  Home: Home,
  Dashboard: createLazyComponent(() => import('../screens/Home'), 'Dashboard'),
  EnergySharing: createLazyComponent(() => import('../screens/EnergySharing/EnergySharing'), 'EnergySharing'),
  HelpSupport: createLazyComponent(() => import('../screens/SubmitTicket'), 'HelpSupport'),
  Recommendations: createLazyComponent(() => import('../screens/Recommendations/Recommendations'), 'Recommendations'),
  UserProfile: createLazyComponent(() => import('../screens/Profile'), 'UserProfile')
};

// Module routes with named components for better error tracking
export const moduleRoutes = {
  Solar: createLazyComponent(() => import('../features/modules/components/Solar/Solar'), 'Solar'),
  Wind: createLazyComponent(() => import('../features/modules/components/Wind/Wind'), 'Wind'),
  Geo: createLazyComponent(() => import('../features/modules/components/Geothermal/Geothermal'), 'Geo'),
  Hydro: createLazyComponent(() => import('../features/modules/components/Hydropower/Hydropower'), 'Hydro'),
  Bio: createLazyComponent(() => import('../features/modules/components/Biomass/Biomass'), 'Bio')
};