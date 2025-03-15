import React from 'react';
import { Dimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import CustomDrawerContent from './customDrawer';

// Import routes
import { userRoutes, moduleRoutes } from '../src/routes/routes';

// Import vector icons
import { 
  Feather, 
  MaterialCommunityIcons, 
  Ionicons, 
  FontAwesome5 
} from '@expo/vector-icons';

// Custom theme colors
const THEME = {
  primary: "#4D7C0F",       // Olive green
  primaryDark: "#3F6212",   // Darker olive
  primaryLight: "#65A30D",  // Lighter olive
  accent: "#84CC16",        // Lime
  secondary: "#84D2F6",     // Sky blue accent
  background: "#FFFFFF",    // White background
  surface: "#FFFFFF",
  card: "#F7FEE7",          // Very light lime
  text: "#365314",          // Dark olive text
  textLight: "#84CC16",     // Light text
  divider: "#D9F99D"        // Light lime divider
};

// Create custom Paper theme
const paperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: THEME.primary,
    accent: THEME.accent,
    background: THEME.background,
    surface: THEME.surface,
    text: THEME.text,
  },
};

const Drawer = createDrawerNavigator();

// Get icon for drawer item
const getDrawerIcon = (name) => {
  return ({ focused, color, size }) => {
    switch (name) {
      case "Home":
        return <Feather name="home" size={size} color={color} />;
      case "Dashboard":
        return <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />;
      case "UserProfile":
        return <Feather name="user" size={size} color={color} />;
      case "EnergySharing":
        return <Ionicons name="flash-outline" size={size} color={color} />;
      case "Recommendations":
        return <Feather name="search" size={size} color={color} />;
      case "HelpSupport":
        return <Feather name="help-circle" size={size} color={color} />;
      case "Solar":
        return <Ionicons name="sunny-outline" size={size} color={color} />;
      case "Wind":
        return <FontAwesome5 name="wind" size={size} color={color} />;
      case "Geo":
        return <MaterialCommunityIcons name="volcano" size={size} color={color} />;
      case "Hydro":
        return <Ionicons name="water-outline" size={size} color={color} />;
      case "Bio":
        return <MaterialCommunityIcons name="leaf" size={size} color={color} />;
      default:
        return <Feather name="circle" size={size} color={color} />;
    }
  };
};

// Get display name for route
const getDisplayName = (name) => {
  const nameMap = {
    UserProfile: "Profile",
    EnergySharing: "Energy Sharing",
    HelpSupport: "Help & Support",
    Geo: "Geothermal",
    Hydro: "Hydropower",
    Bio: "Biomass"
  };
  
  return nameMap[name] || name;
};

const DrawerNavigator = () => {
  const { width } = Dimensions.get('window');
  
  // Configure drawer style
  const drawerStyle = {
    backgroundColor: '#FFFFFF',
    width: width * 0.85,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  };
  
  return (
    <PaperProvider theme={paperTheme}>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        initialRouteName="Home"
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: THEME.primary,
            elevation: 0,
            shadowOpacity: 0,
            height: 60,
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          drawerStyle: drawerStyle,
          drawerActiveBackgroundColor: THEME.primary,
          drawerActiveTintColor: '#FFFFFF',
          drawerInactiveTintColor: THEME.text,
          drawerLabelStyle: {
            marginLeft: -20,
            fontWeight: '500',
            fontSize: 15,
          },
          headerShadowVisible: false,
        }}
      >
        {/* User Routes */}
        {Object.entries(userRoutes).map(([name, component]) => (
          <Drawer.Screen 
            key={name}
            name={name} 
            component={component}
            options={{
              title: getDisplayName(name),
              drawerIcon: getDrawerIcon(name),
              headerTitle: getDisplayName(name),
            }}
          />
        ))}
        
        {/* Module Routes */}
        {Object.entries(moduleRoutes).map(([name, component]) => (
          <Drawer.Screen 
            key={name}
            name={name} 
            component={component}
            options={{
              title: getDisplayName(name),
              drawerIcon: getDrawerIcon(name),
              headerTitle: getDisplayName(name),
            }}
          />
        ))}
      </Drawer.Navigator>
    </PaperProvider>
  );
};

export default DrawerNavigator;