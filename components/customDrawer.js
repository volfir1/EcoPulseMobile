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
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import styles and theme
import styles, { THEME } from './styles/drawerStyles';

// Import default avatar images - USE THE SAME PATHS AS IN YOUR useProfile.js file
import avatar1 from 'assets/avatars/png/1.png';
import avatar2 from 'assets/avatars/png/2.png';
import avatar3 from 'assets/avatars/png/3.png';
import avatar4 from 'assets/avatars/4.png';
import avatar5 from 'assets/avatars/png/5.png';
import avatar6 from 'assets/avatars/png/6.png';
import avatar7 from 'assets/avatars/png/7.png';

// Default avatars with image sources - MUST MATCH YOUR useProfile.js
const defaultAvatars = [
  { id: 'avatar-1', image: avatar1, name: 'Avatar A' },
  { id: 'avatar-2', image: avatar2, name: 'Avatar B' },
  { id: 'avatar-3', image: avatar3, name: 'Avatar C' },
  { id: 'avatar-4', image: avatar4, name: 'Avatar D' },
  { id: 'avatar-5', image: avatar5, name: 'Avatar E' },
  { id: 'avatar-6', image: avatar6, name: 'Avatar F' },
  { id: 'avatar-7', image: avatar7, name: 'Avatar G' },
];

// Enhanced Icon component
const DrawerIcon = ({ name, size = 22, color = THEME.text.main, active = false }) => {
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

// Navigation Item Component
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
        
        <View style={styles.titleContainer}>
          <Text style={[
            styles.navItemText,
            isActive && styles.activeItemText
          ]}>
            {title}
          </Text>
        </View>
        
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
  // Get the useAuth hook data
  const { user, logout } = useAuth();
  
  const [expandedModules, setExpandedModules] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Alex Johnson",
    email: "alex@ecopulse.io",
    avatarId: null,
    initials: "AJ"
  });
  
  // Helper function to get initials from name
  const getInitials = (user) => {
    if (!user) return 'U';
    
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    
    if (firstName && lastName) {
      return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase();
    } else if (lastName) {
      return lastName.charAt(0).toUpperCase();
    } else if (user.email) {
      return user.email.charAt(0).toUpperCase();
    } else {
      return 'U';
    }
  };
  
  // Update profile data from user context
  useEffect(() => {
    if (user) {
      console.log('Setting profile data from user:', user);
      setProfileData({
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        email: user.email || 'user@example.com',
        avatarId: user.avatar || null,
        initials: getInitials(user)
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

  // Updated navigation structure
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
      Alert.alert(
        "Logout",
        "Are you sure you want to log out?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Logout", 
            style: "destructive",
            onPress: async () => {
              const result = await logout();
              
              if (result.success) {
                console.log('Logged out successfully');
              } else {
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

  // Find default avatar image source by ID
  const getDefaultAvatarSource = (avatarId) => {
    if (!avatarId || typeof avatarId !== 'string') return null;
    
    const avatar = defaultAvatars.find(a => a.id === avatarId);
    return avatar ? avatar.image : null;
  };

  // Render avatar based on available data
  const renderAvatar = () => {
    const { avatarId } = profileData;
    console.log('Rendering avatar with ID:', avatarId);
    
    // If avatar ID refers to a default avatar
    if (avatarId && avatarId.startsWith('avatar-')) {
      const avatarSource = getDefaultAvatarSource(avatarId);
      
      if (avatarSource) {
        console.log('Found default avatar image for:', avatarId);
        return (
          <Image
            source={avatarSource}
            style={styles.profileAvatar}
            resizeMode="cover"
          />
        );
      }
    }
    
    // If avatar ID is a URL (not starting with avatar-)
    if (avatarId && !avatarId.startsWith('avatar-')) {
      console.log('Using URL for avatar:', avatarId);
      return (
        <Image
          source={{ uri: avatarId }}
          style={styles.profileAvatar}
        />
      );
    }
    
    // Fallback to text avatar
    console.log('Using initials fallback for avatar:', profileData.initials);
    return (
      <Avatar.Text 
        size={50} 
        label={profileData.initials || 'U'} 
        style={styles.profileAvatar}
        labelStyle={styles.avatarLabel}
        color="#FFFFFF"
        backgroundColor="rgba(255,255,255,0.25)"
      />
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Drawer Header with Profile Info */}
      <View style={[styles.header, { backgroundColor: '#37A633' }]}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="leaf" size={28} color="#FFFFFF" />
          <Text style={styles.logoText}>EcoPulse</Text>
        </View>
        
        <View style={styles.profileSection}>
          {renderAvatar()}
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