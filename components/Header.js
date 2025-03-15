import React from 'react';
import { View, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';

// Import styles
import styles, { COLORS } from './styles/headerStyles';

// Button components
const NotificationButton = ({ style, onPress, hasNotifications = true, white }) => (
  <TouchableOpacity 
    style={[styles.actionButton, style]} 
    onPress={onPress}
  >
    <Ionicons
      name="notifications-outline"
      size={22}
      color={white ? COLORS.white : COLORS.text.main}
    />
    {hasNotifications && <View style={styles.notificationBadge} />}
  </TouchableOpacity>
);

const MenuButton = ({ onPress, white }) => (
  <TouchableOpacity 
    style={styles.actionButton} 
    onPress={onPress}
  >
    <Feather
      name="menu"
      size={22}
      color={white ? COLORS.white : COLORS.text.main}
    />
  </TouchableOpacity>
);

const BackButton = ({ onPress, white }) => (
  <TouchableOpacity 
    style={styles.actionButton} 
    onPress={onPress}
  >
    <Feather
      name="arrow-left"
      size={22}
      color={white ? COLORS.white : COLORS.text.main}
    />
  </TouchableOpacity>
);

const SearchButton = ({ onPress, white }) => (
  <TouchableOpacity 
    style={styles.actionButton} 
    onPress={onPress}
  >
    <Feather
      name="search"
      size={20}
      color={white ? COLORS.white : COLORS.text.main}
    />
  </TouchableOpacity>
);

const ProfileButton = ({ onPress, white }) => (
  <TouchableOpacity 
    style={styles.actionButton} 
    onPress={onPress}
  >
    <Feather
      name="user"
      size={20}
      color={white ? COLORS.white : COLORS.text.main}
    />
  </TouchableOpacity>
);

const Header = ({
  title,
  transparent = false,
  white = false,
  back = false,
  search = false,
  gradient = false,
  showNotification = true,
  showProfile = false,
  onNotificationPress,
  onProfilePress,
  bgColor,
  titleColor,
  searchPlaceholder = "Search",
  onSearchChange,
  statusBarType = "default", // 'default', 'light-content', 'dark-content'
}) => {
  const navigation = useNavigation();
  
  const handleLeftPress = () => {
    return back ? navigation.goBack() : navigation.openDrawer();
  };
  
  const handleNotificationPress = () => {
    if (onNotificationPress) {
      return onNotificationPress();
    }
    return navigation.navigate('Notifications');
  };
  
  const handleProfilePress = () => {
    if (onProfilePress) {
      return onProfilePress();
    }
    return navigation.navigate('Profile');
  };
  
  const renderStatusBar = () => {
    let barStyle = 'default';
    
    if (statusBarType !== 'default') {
      barStyle = statusBarType;
    } else if (white || gradient) {
      barStyle = 'light-content';
    } else {
      barStyle = 'dark-content';
    }
    
    return <StatusBar barStyle={barStyle} />;
  };
  
  const renderLeft = () => (
    <View style={styles.leftSection}>
      {back ? (
        <BackButton onPress={handleLeftPress} white={white} />
      ) : (
        <MenuButton onPress={handleLeftPress} white={white} />
      )}
    </View>
  );
  
  const renderCenter = () => {
    if (search) {
      return (
        <View style={styles.searchContainer}>
          <Feather name="search" size={16} color={COLORS.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={searchPlaceholder}
            placeholderTextColor={COLORS.text.disabled}
            onChangeText={onSearchChange}
          />
        </View>
      );
    }
    
    return (
      <View style={styles.centerSection}>
        <Text 
          style={[
            styles.title, 
            white && styles.titleWhite,
            titleColor && { color: titleColor }
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
    );
  };
  
  const renderRight = () => (
    <View style={styles.rightSection}>
      {showNotification && (
        <NotificationButton 
          onPress={handleNotificationPress} 
          white={white} 
        />
      )}
      {showProfile && (
        <ProfileButton 
          onPress={handleProfilePress} 
          white={white} 
        />
      )}
    </View>
  );
  
  return (
    <Surface style={[
      styles.headerContainer,
      transparent && styles.transparentHeader,
      bgColor && { backgroundColor: bgColor }
    ]}>
      {renderStatusBar()}
      
      {gradient && (
        <LinearGradient
        colors={[COLORS.primary.light, COLORS.primary.main]}  // Lighter green gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientHeader}
      />
      )}
      
      <View style={styles.navbar}>
        {renderLeft()}
        {renderCenter()}
        {renderRight()}
      </View>
    </Surface>
  );
};

export default Header;