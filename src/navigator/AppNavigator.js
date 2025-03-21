// src/navigator/AppNavigator.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import Header from '@components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import routes from route definitions
import { publicRoutes, userRoutes, moduleRoutes } from '../routes/routes';

// Import custom drawer content
import CustomDrawerContent from '@components/customDrawer';

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Custom header for all screens
const getScreenOptions = ({ route, navigation }) => {
  // Define which screens should have gradient headers
  const gradientScreens = ['Dashboard', 'Main',, 'Solar Energy'];
  const hideHeaderScreens = ['Login', 'Register', 'ForgotPassword', 'Onboard', 'OnboardRegister', 'Home']; 
  
  // Check if current screen should hide header
  if (hideHeaderScreens.includes(route.name)) {
    return {
      header: () => null
    };
  }
  
  // Check if current screen should use gradient header
  const useGradient = gradientScreens.includes(route.name);
  
  // Return custom header
  return {
    header: ({ navigation, route, options, back }) => (
      <Header
        title={route.name}
        gradient={useGradient}
        white={useGradient}
        back={back}
        showNotification={true}
      />
    )
  };
};

// Main app tab navigator
const AppTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false, // Hide all tab headers
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Dashboard') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        } else if (route.name === 'Settings') {
          iconName = focused ? 'settings' : 'settings-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#4CAF50',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Dashboard" component={userRoutes.Dashboard} />
    <Tab.Screen name="Profile" component={userRoutes.UserProfile} />
  </Tab.Navigator>
);
// Drawer Navigator that wraps the Tab Navigator
const AppDrawer = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={({ route, navigation }) => ({
      headerShown: false, // Hide all drawer headers
      drawerStyle: {
        width: 280,
      },
    })}
  >
    {/* Main tabs wrapped in drawer */}
    <Drawer.Screen name="Main" component={AppTabs} />
    
    {/* User routes */}
    <Drawer.Screen name="Dashboard" component={userRoutes.Dashboard} />
    <Drawer.Screen name="Profile" component={userRoutes.UserProfile} />
    <Drawer.Screen name="Energy Sharing" component={userRoutes.EnergySharing} />
    <Drawer.Screen name="Recommendations" component={userRoutes.Recommendations} />
    <Drawer.Screen name="Help & Support" component={userRoutes.HelpSupport} />
    
    {/* Energy module routes */}
    <Drawer.Screen name="Solar Energy" component={moduleRoutes.Solar} />
    <Drawer.Screen name="Wind Energy" component={moduleRoutes.Wind} />
    <Drawer.Screen name="Geothermal" component={moduleRoutes.Geo} />
    <Drawer.Screen name="Hydropower" component={moduleRoutes.Hydro} />
    <Drawer.Screen name="Biomass" component={moduleRoutes.Bio} />
  </Drawer.Navigator>
);

// Auth navigator with login/register flows
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={({ route, navigation }) => getScreenOptions({ route, navigation })}
  >
    <Stack.Screen name="Login" component={publicRoutes.Login} />
    <Stack.Screen name="Register" component={publicRoutes.Register} />
    <Stack.Screen name="ForgotPassword" component={publicRoutes.ForgotPassword} />
    <Stack.Screen name="ResetPassword" component={publicRoutes.ResetPassword} />
    <Stack.Screen name="VerifyEmail" component={publicRoutes.VerifyEmail} />
    
    {/* Keep this OnboardRegister in the AuthStack for navigation from verification */}
    <Stack.Screen 
      name="OnboardRegister" 
      component={publicRoutes.OnboardRegister} 
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

// Main AppNavigator
const AppNavigator = () => {
  // Get auth context
  const { isAuthenticated, loading, user } = useAuth();
  
  // State for app status
  const [appStatus, setAppStatus] = useState({
    isFirstLaunch: true,
    hasSeenIntro: false,
    hasCompletedOnboarding: false,
    isLoading: true
  });
  
  // Add a state to track forced reloads
  const [forceReloadTimestamp, setForceReloadTimestamp] = useState(null);
  
  // Function to check app status - making it reusable
  const checkAppStatus = useCallback(async () => {
    try {
      console.log('Checking app status...');
      
      // Check if app has been launched before
      const hasLaunchedBefore = await AsyncStorage.getItem('ecopulse_has_launched_before');
      
      // Check if intro has been seen
      const introSeen = await AsyncStorage.getItem('ecopulse_has_seen_intro');
      
      // Check if onboarding is complete - read from multiple sources
      const onboardingComplete = await AsyncStorage.getItem('ecopulse_has_completed_onboarding');
      
      // Check user data
      const userData = await AsyncStorage.getItem('ecopulse_user');
      let userOnboardingComplete = false;
      let hasVerifiedEmail = false;
      
      // Parse user data if available
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          // Use user-level onboarding flag
          userOnboardingComplete = parsedUser.hasCompletedOnboarding === true;
          
          // Check email verification status
          hasVerifiedEmail = parsedUser.emailVerified === true || parsedUser.isVerified === true;
          
          console.log('User onboarding status from AsyncStorage:', {
            hasCompletedOnboarding: parsedUser.hasCompletedOnboarding,
            emailVerified: parsedUser.emailVerified,
            isVerified: parsedUser.isVerified
          });
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
        }
      }
      
      // Check if email is verified separately
      const emailVerified = await AsyncStorage.getItem('ecopulse_email_verified');
      
      // Log detailed state for debugging
      console.log('App navigation state detection:', {
        userOnboardingComplete,
        onboardingComplete,
        hasVerifiedEmail,
        emailVerified,
        isAuthenticated
      });

      // IMPORTANT: Prioritize the explicit onboarding flag
      // This ensures that if hasCompletedOnboarding is false, we show the onboarding
      // regardless of other factors
      const hasCompletedOnboardingFlag = 
        onboardingComplete === 'true' || 
        userOnboardingComplete === true;

      // Update app status
      setAppStatus({
        isFirstLaunch: hasLaunchedBefore !== 'true',
        hasSeenIntro: introSeen === 'true',
        hasCompletedOnboarding: hasCompletedOnboardingFlag,
        emailVerified: emailVerified === 'true' || hasVerifiedEmail,
        isLoading: false
      });
      
      // Set the first launch flag for future launches
      if (hasLaunchedBefore !== 'true') {
        await AsyncStorage.setItem('ecopulse_has_launched_before', 'true');
      }
    } catch (error) {
      console.error('Error checking app status:', error);
      setAppStatus(prev => ({ ...prev, isLoading: false }));
    }
  }, [isAuthenticated]);
  
  // Check AsyncStorage for app status when auth state changes
  useEffect(() => {
    checkAppStatus();
  }, [isAuthenticated, checkAppStatus]);
  
  // Add a polling mechanism to detect forced reloads
  useEffect(() => {
    const checkForForcedReload = async () => {
      try {
        const forceReload = await AsyncStorage.getItem('ecopulse_force_reload');
        if (forceReload && forceReload !== forceReloadTimestamp) {
          console.log('Force reload detected with timestamp:', forceReload);
          setForceReloadTimestamp(forceReload);
          
          // Re-check app status when forced reload is detected
          checkAppStatus();
          
          // Clear the flag to prevent infinite loops
          await AsyncStorage.removeItem('ecopulse_force_reload');
        }
      } catch (error) {
        console.error('Error checking for forced reload:', error);
      }
    };
    
    // Check for forced reloads every 1 second
    const interval = setInterval(checkForForcedReload, 1000);
    
    // Clear interval on unmount
    return () => clearInterval(interval);
  }, [forceReloadTimestamp, checkAppStatus]);
  
  // Loading state
  if (loading || appStatus.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }
  
  // Determine which screen to show
  const showOnboarding = appStatus.isFirstLaunch || !appStatus.hasSeenIntro;
  const showOnboardingRegister = isAuthenticated && !appStatus.hasCompletedOnboarding;
  const showAuthStack = !isAuthenticated && !showOnboarding;
  const showMainApp = isAuthenticated && appStatus.hasCompletedOnboarding;
  
  // For debugging
  console.log('Navigation state:', { 
    isAuthenticated,
    showOnboarding,
    showOnboardingRegister,
    showAuthStack,
    showMainApp,
    ...appStatus
  });

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Decide which flow to show based on app state */}
        {showOnboarding && (
          <Stack.Screen name="Onboard" component={publicRoutes.Onboard} />
        )}
        
        {showOnboardingRegister && (
          <Stack.Screen name="OnboardRegister" component={publicRoutes.OnboardRegister} />
        )}
        
        {showAuthStack && (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
        
        {showMainApp && (
          <Stack.Screen name="Home" component={AppDrawer} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;