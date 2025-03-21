import React, { useState, useEffect } from "react";
import { 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Dimensions, 
  Animated,
  StatusBar,
  Alert
} from "react-native";
import { 
  Text, 
  Divider, 
  Surface, 
  Avatar
} from "react-native-paper";
import { 
  Feather, 
  MaterialCommunityIcons, 
  Ionicons, 
  FontAwesome5,
  MaterialIcons 
} from '@expo/vector-icons';
import { useAuth } from "src/context/AuthContext";

// Import styles and theme
import styles, { THEME } from './styles/drawerStyles';

// Enhanced Icon component with appropriate icons for each section
const DrawerIcon = ({ name, size = 22, color = THEME.text.main, active = false }) => {
  // Map icon names to appropriate components and icon names
  switch (name) {
    case "dashboard":
      return <MaterialIcons name="dashboard" size={size} color={color} />;
    case "profile":
      return <Feather name="user" size={size} color={color} />;
    case "share":
      return <MaterialIcons name="bolt" size={size} color={color} />;
    case "recommendations":
      return <MaterialIcons name="lightbulb" size={size} color={color} />;
    case "help":
      return <Feather name="help-circle" size={size} color={color} />;
    case "modules":
      return <MaterialIcons name="integration-instructions" size={size} color={color} />;
    case "solar":
      return <MaterialIcons name="wb-sunny" size={size} color={color} />;
    case "wind":
      return <FontAwesome5 name="wind" size={size} color={color} />;
    case "geo":
      return <MaterialCommunityIcons name="hydraulic-oil-temperature" size={size} color={color} />;
    case "hydro":
      return <MaterialCommunityIcons name="water" size={size} color={color} />;
    case "bio":
      return <MaterialCommunityIcons name="leaf" size={size} color={color} />;
    case "settings":
      return <Feather name="settings" size={size} color={color} />;
    case "logout":
      return <MaterialIcons name="logout" size={size} color="#991b1b" />;
    case "chevronRight":
      return <MaterialIcons name="chevron-right" size={size} color={color} />;
    case "chevronDown":
      return <MaterialIcons name="keyboard-arrow-down" size={size} color={color} />;
    default:
      return <MaterialIcons name="circle" size={size} color={color} />;
  }
};

// Navigation Item Component with redesigned clean styling
const NavigationItem = ({ 
  title, 
  iconName, 
  onPress, 
  isActive = false, 
  hasChildren = false, 
  isExpanded = false,
  isChild = false,
  iconColor = null 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.navItem,
        isChild && styles.childItem,
        isActive && styles.activeItem
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.navItemContent}>
        <View style={[
          styles.iconContainer,
          isActive && styles.activeIconContainer,
          iconColor && { backgroundColor: `${iconColor}15` }
        ]}>
          <DrawerIcon 
            name={iconName} 
            size={22} 
            color={isActive ? THEME.primary.text : (iconColor || THEME.text.main)}
            active={isActive}
          />
        </View>
        
        <Text style={[
          styles.navItemText,
          isActive && styles.activeItemText
        ]}>
          {title}
        </Text>
        
        {hasChildren && (
          <View style={styles.chevronContainer}>
            <DrawerIcon
              name={isExpanded ? "chevronDown" : "chevronRight"}
              size={16}
              color={isActive ? THEME.primary.text : THEME.text.secondary}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Custom Drawer Content Component
const CustomDrawerContent = ({ navigation, state }) => {
  // Get the logout function from AuthContext
  const { user, logout } = useAuth();
  
  const [expandedModules, setExpandedModules] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Alex Johnson",
    email: "alex@ecopulse.io",
    avatarUrl: null, // Replace with actual avatar URL if available
  });
  
  // Update profile data from user context
  useEffect(() => {
    if (user) {
      setProfileData({
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        email: user.email || 'user@example.com',
        avatarUrl: user.avatar || null
      });
    }
  }, [user]);
  
  const activeRouteName = state.routes[state.index]?.name || "";
  
  // Animation for modules expansion
  const [animation] = useState(new Animated.Value(0));
  
  useEffect(() => {
    Animated.timing(animation, {
      toValue: expandedModules ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [expandedModules]);
  
  const modulesHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });

  // Updated navigation structure based on the specified requirements
  const mainNavItems = [
    { name: "Dashboard", iconName: "dashboard" },
    {
      name: "Energy Modules",
      iconName: "modules",
      hasChildren: true,
      children: [
        { 
          id: 'solar-module',
          name: "Solar Energy",
          iconName: "solar",
          displayName: "Solar Energy",
          iconColor: THEME.elements.solar
        },
        { 
          id: 'wind-module',
          name: "Wind Energy",
          iconName: "wind",
          displayName: "Wind Energy",
          iconColor: THEME.elements.wind
        },
        { 
          id: 'geo-module',
          name: "Geothermal",
          iconName: "geo",
          displayName: "Geothermal",
          iconColor: THEME.elements.geothermal
        },
        { 
          id: 'hydro-module',
          name: "Hydropower",
          iconName: "hydro",
          displayName: "Hydropower",
          iconColor: THEME.elements.hydropower
        },
        { 
          id: 'biomass-module',
          name: "Biomass",
          iconName: "bio",
          displayName: "Biomass",
          iconColor: THEME.elements.biomass
        }
      ]
    },
    { name: "Profile", iconName: "profile" },
    { name: "Energy Sharing", iconName: "share" },
    { name: "Recommendations", iconName: "recommendations" },
    { name: "Help & Support", iconName: "help" },
  ];

  // Toggle modules expansion
  const toggleModules = () => {
    setExpandedModules(!expandedModules);
  };

  // Navigate to a screen
  const navigateToScreen = (routeName, params) => {
    navigation.navigate(routeName, params);
  };

  const getDisplayName = (item) => {
    return item.displayName || item.name;
  };

  // Handle logout with auth context
  const handleLogout = async () => {
    try {
      // Show confirmation dialog
      Alert.alert(
        "Logout",
        "Are you sure you want to log out?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Logout", 
            style: "destructive",
            onPress: async () => {
              // Show loading indicator or disable button here if needed
              
              // Call the logout function from AuthContext
              const result = await logout();
              
              if (result.success) {
                // The AuthContext will handle setting isAuthenticated to false,
                // which should trigger the navigation change in AppNavigator
                console.log('Logged out successfully');
              } else {
                // Show error message if logout failed
                Alert.alert('Logout Failed', result.message || 'Something went wrong. Please try again.');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Logout Error', 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Drawer Header with Profile Info - Redesigned with clean solid color */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="leaf" size={28} color="#FFFFFF" />
          <Text style={styles.logoText}>EcoPulse</Text>
        </View>
        
        <View style={styles.profileSection}>
          {profileData.avatarUrl ? (
            <Image
              source={{ uri: profileData.avatarUrl }}
              style={styles.profileAvatar}
            />
          ) : (
            <Avatar.Text 
              size={60} 
              label={profileData.name.substr(0, 2).toUpperCase()} 
              style={styles.profileAvatar}
              labelStyle={styles.avatarLabel}
              color="#FFFFFF"
              backgroundColor="rgba(255,255,255,0.25)"
            />
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profileData.name}</Text>
            <View style={styles.emailContainer}>
              <Feather name="mail" size={12} color="rgba(255,255,255,0.8)" style={styles.emailIcon} />
              <Text style={styles.profileEmail}>{profileData.email}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Scrollable Navigation Items */}
      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Navigation Section */}
        <View style={styles.navigationSection}>
          {mainNavItems.map((item, index) => (
            item.hasChildren ? (
              <React.Fragment key={item.name}>
                <NavigationItem
                  title={getDisplayName(item)}
                  iconName={item.iconName}
                  hasChildren={true}
                  isExpanded={expandedModules}
                  onPress={toggleModules}
                />
                
                {/* Expandable modules content */}
                <Animated.View style={[styles.childrenContainer, { maxHeight: modulesHeight }]}>
                  {item.children.map((child) => (
                    <NavigationItem
                      key={child.id}
                      title={child.displayName}
                      iconName={child.iconName}
                      isActive={activeRouteName === child.name}
                      isChild={true}
                      iconColor={child.iconColor}
                      onPress={() => navigateToScreen(child.name)}
                    />
                  ))}
                </Animated.View>
                
                {index < mainNavItems.length - 1 && <Divider style={styles.itemDivider} />}
              </React.Fragment>
            ) : (
              <React.Fragment key={item.name}>
                <NavigationItem
                  title={getDisplayName(item)}
                  iconName={item.iconName}
                  isActive={activeRouteName === item.name}
                  onPress={() => navigateToScreen(item.name)}
                />
                {index < mainNavItems.length - 1 && <Divider style={styles.itemDivider} />}
              </React.Fragment>
            )
          ))}
        </View>
      </ScrollView>

      {/* Footer with logout button */}
      <Surface style={styles.footer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <DrawerIcon 
            name="logout"
            size={20}
            color="#991b1b"
          />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </Surface>
    </View>
  );
};

export default CustomDrawerContent;