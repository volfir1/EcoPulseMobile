// src/routes/routes.js
import React, { lazy, Suspense } from 'react';
import { ActivityIndicator } from 'react-native';

// Suspense fallback component
const LoadingComponent = () => (
  <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center' }} />
);

// Create a wrapper for lazy components
const createLazyComponent = (importFunc) => {
  const LazyComponent = lazy(importFunc);
  return (props) => (
    <Suspense fallback={<LoadingComponent />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Regular imports for critical screens that should load immediately
// These screens will be included in the main bundle
const OnboardingScreen = require('../screens/Onboarding').default;
const Home = require('../screens/Home').default;

// Lazy loaded routes using proper React.lazy
// Public Routes
export const publicRoutes = {
  // Immediate loaded routes for critical screens
  Onboard: OnboardingScreen,
  
  // Lazy loaded routes using React.lazy
  Login: createLazyComponent(() => import('../screens/Login')),
  Register: createLazyComponent(() => import('../screens/Register')),
  VerifyEmail: createLazyComponent(() => import('../screens/EmailVerification')),
  ForgotPassword: createLazyComponent(() => import('../screens/ForgotPassword')),
  ResetPassword: createLazyComponent(() => import('../screens/ResetPassword'))
};

// User Dashboard & Features
export const userRoutes = {
  // Critical user screens load immediately
  Home: Home,
  
  // Lazy loaded user screens
  Dashboard: createLazyComponent(() => import('../screens/Home')),
  EnergySharing: createLazyComponent(() => import('../screens/EnergySharing/EnergySharing')),
  HelpSupport: createLazyComponent(() => import('../screens/SubmitTicket')),
  Recommendations: createLazyComponent(() => import('../screens/Recommendations/Recommendations')),
  UserProfile: createLazyComponent(() => import('../screens/Profile'))
};

// Energy Modules - all lazy loaded
export const moduleRoutes = {
  Solar: createLazyComponent(() => import('../features/modules/components/Solar/Solar')),
  Wind: createLazyComponent(() => import('../features/modules/components/Wind/Wind')),
  Geo: createLazyComponent(() => import('../features/modules/components/Geothermal/Geothermal')),
  Hydro: createLazyComponent(() => import('../features/modules/components/Hydropower/Hydropower')),
  Bio: createLazyComponent(() => import('../features/modules/components/Biomass/Biomass'))
};

// Error Pages
// export const errorRoutes = {
//   NotFound: createLazyComponent(() => import('../screens/errors/NotFound'))
// };