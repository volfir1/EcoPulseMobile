import React from 'react';
import { View, StyleSheet, Text, Dimensions, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialIcons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CustomDrawerContent from '../../components/customDrawer';

// Import your custom Header component
import Header from '../../components/Header'; // Adjust the path as needed
import { COLORS } from '../../components/styles/headerStyles' ; // Import your color theme

// Import your route definitions
import { publicRoutes, userRoutes, moduleRoutes } from '../routes/routes';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Define theme for the navigator
const THEME = {
  primary: {
    main: '#166534',
    light: '#22863a',
    dark: '#14532d',
    text: '#ffffff'
  },
  background: {
    paper: '#ffffff',
    default: '#f0fdf4'
  }
};

// Drawer Navigator for the main app
const Drawer = createDrawerNavigator();
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      drawerStyle={{
        backgroundColor: THEME.background.paper,
        width: width * 0.85,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      }}
      initialRouteName="Dashboard" // Changed initial route to Dashboard as requested
      screenOptions={({ route, navigation }) => ({
        headerShown: true,
        header: (props) => (
          <Header 
          title={route.name}
          back={false}
          showNotification={true}
          showProfile={route.name === "Profile" ? false : true}
          gradient={true}
            onNotificationPress={() => navigation.navigate('Notifications')}
            onProfilePress={() => navigation.navigate('Profile')}
          />
        ),
        drawerActiveTintColor: THEME.primary.main,
        drawerInactiveTintColor: COLORS.text.secondary,
        drawerActiveBackgroundColor: `${THEME.primary.main}10`,
        drawerLabelStyle: {
          marginLeft: -20,
          fontWeight: '500',
          fontSize: 15,
        },
        drawerItemStyle: {
          borderRadius: 10,
          marginHorizontal: 5,
          paddingLeft: 10,
        }
      })}
    >
      {/* User Routes - reordered as requested */}
      <Drawer.Screen 
        name="Dashboard" 
        component={userRoutes.Dashboard}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={22} color={color} />
          )
        }}
      />
      
      {/* Energy Modules placed right after Dashboard */}
      <Drawer.Screen 
        name="Solar Energy" 
        component={moduleRoutes.Solar}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="wb-sunny" size={22} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name="Wind Energy" 
        component={moduleRoutes.Wind}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="weather-windy" size={22} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name="Geothermal" 
        component={moduleRoutes.Geo}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="volcano" size={22} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name="Hydropower" 
        component={moduleRoutes.Hydro}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="water" size={22} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name="Biomass" 
        component={moduleRoutes.Bio}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="leaf" size={22} color={color} />
          )
        }}
      />
      
      {/* Other user routes */}
      <Drawer.Screen 
        name="Profile" 
        component={userRoutes.UserProfile}
        options={{
          drawerIcon: ({ color }) => (
            <Feather name="user" size={22} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name="Energy Sharing" 
        component={userRoutes.EnergySharing}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="bolt" size={22} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name="Recommendations" 
        component={userRoutes.Recommendations}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="lightbulb" size={22} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name="Help & Support" 
        component={userRoutes.HelpSupport}
        options={{
          drawerIcon: ({ color }) => (
            <Feather name="help-circle" size={22} color={color} />
          )
        }}
      />
    </Drawer.Navigator>
  );
}

// Stack Navigator for Notifications
const NotificationsStack = createStackNavigator();
function NotificationsNavigator() {
  return (
    <NotificationsStack.Navigator
      screenOptions={({ route, navigation }) => ({
        header: (props) => (
          <Header 
            title="Notifications"
            back={true}
            showNotification={false}
            showProfile={true}
            gradient={true}
            onProfilePress={() => navigation.navigate('Profile')}
          />
        )
      })}
    >
      <NotificationsStack.Screen name="NotificationsList" component={userRoutes.Notifications} />
    </NotificationsStack.Navigator>
  );
}

// Stack Navigator for Auth Flow
const AuthStack = createStackNavigator();
function AuthNavigator() {
  return (
    <AuthStack.Navigator 
      initialRouteName="Onboarding"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: THEME.background.default }
      }}
    >
      <AuthStack.Screen name="Onboarding" component={publicRoutes.Onboard} />
      <AuthStack.Screen name="Login" component={publicRoutes.Login} />
      <AuthStack.Screen name="Register" component={publicRoutes.Register} />
      <AuthStack.Screen name="VerifyEmail" component={publicRoutes.VerifyEmail} />
      <AuthStack.Screen name="ForgotPassword" component={publicRoutes.ForgotPassword} />
      <AuthStack.Screen name="ResetPassword" component={publicRoutes.ResetPassword} />
    </AuthStack.Navigator>
  );
}

// Root Stack that contains all navigation flows
const RootStack = createStackNavigator();
function RootNavigation() {
  // You can replace this with your actual authentication logic
  const isAuthenticated = true; // Set to true for testing the main app

  return (
    <RootStack.Navigator 
      initialRouteName={isAuthenticated ? "AppMain" : "Auth"}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: THEME.background.default },
        presentation: 'card',
      }}
    >
      <RootStack.Screen name="Auth" component={AuthNavigator} />
      <RootStack.Screen name="AppMain" component={DrawerNavigator} />
      <RootStack.Screen name="Notifications" component={NotificationsNavigator} />
    </RootStack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background.default,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: Platform.OS === 'ios' ? 100 : 70,
  },
});

export default RootNavigation;