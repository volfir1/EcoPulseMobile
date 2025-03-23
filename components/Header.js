import React from 'react';
import { View, TouchableOpacity, TextInput, StatusBar, Platform } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';

// Import styles
import styles, { COLORS } from './styles/headerStyles';

// Button components
// const NotificationButton = ({ style, onPress, hasNotifications = true, textColor }) => (
//   <TouchableOpacity 
//     style={[styles.actionButton, style]} 
//     onPress={onPress}
//   >
//     <Ionicons
//       name="notifications-outline"
//       size={22}
//       color={textColor || COLORS.text.main}
//     />
//     {hasNotifications && <View style={styles.notificationBadge} />}
//   </TouchableOpacity>
// );

const MenuButton = ({ onPress, textColor }) => (
  <TouchableOpacity 
    style={styles.actionButton} 
    onPress={onPress}
  >
    <Feather
      name="menu"
      size={22}
      color={textColor || COLORS.text.main}
    />
  </TouchableOpacity>
);

const BackButton = ({ onPress, textColor }) => (
  <TouchableOpacity 
    style={styles.actionButton} 
    onPress={onPress}
  >
    <Feather
      name="arrow-left"
      size={22}
      color={textColor || COLORS.text.main}
    />
  </TouchableOpacity>
);

const SearchButton = ({ onPress, textColor }) => (
  <TouchableOpacity 
    style={styles.actionButton} 
    onPress={onPress}
  >
    <Feather
      name="search"
      size={20}
      color={textColor || COLORS.text.main}
    />
  </TouchableOpacity>
);

const ProfileButton = ({ onPress, textColor }) => (
  <TouchableOpacity 
    style={styles.actionButton} 
    onPress={onPress}
  >
    <Feather
      name="user"
      size={20}
      color={textColor || COLORS.text.main}
    />
  </TouchableOpacity>
);

const Header = ({
  title,
  transparent = false,
  back = false,
  search = false,
  showNotification = true,
  showProfile = false,
  onNotificationPress,
  onProfilePress,
  bgColor,
  titleColor,
  searchPlaceholder = "Search",
  onSearchChange,
  statusBarType = "default", // 'default', 'light-content', 'dark-content'
  hideStatusBar = false,     // Option to hide StatusBar component
  style = {},                // Additional style props
}) => {
  const navigation = useNavigation();
  
  // Determine text color based on background color or explicit titleColor
  const getTextColor = () => {
    if (titleColor) return titleColor;
    
    if (bgColor) {
      // Check if bgColor is dark or light to auto-determine text color
      const isLight = bgColor.match(/(f|e|d|c|b|a|9|8|7|#fff|white)/i);
      return isLight ? COLORS.text.main : COLORS.white;
    }
    
    // Default text color
    return COLORS.text.main;
  };
  
  const textColor = getTextColor();
  
  const handleLeftPress = () => {
    if (back) {
      return navigation.goBack();
    } else {
      return navigation.dispatch(DrawerActions.openDrawer());
    }
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
    if (hideStatusBar) return null;
    
    let barStyle = 'default';
    
    if (statusBarType !== 'default') {
      barStyle = statusBarType;
    } else if (textColor === COLORS.white) {
      barStyle = 'light-content';
    } else {
      barStyle = 'dark-content';
    }
    
    return <StatusBar barStyle={barStyle} backgroundColor={bgColor || COLORS.background.paper} />;
  };
  
  const renderLeft = () => (
    <View style={styles.leftSection}>
      {back ? (
        <BackButton onPress={handleLeftPress} textColor={textColor} />
      ) : (
        <MenuButton onPress={handleLeftPress} textColor={textColor} />
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
            { color: textColor }
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
    );
  };
  
  // const renderRight = () => (
  //   <View style={styles.rightSection}>
  //     {showNotification && (
  //       <NotificationButton 
  //         onPress={handleNotificationPress} 
  //         textColor={textColor}
  //       />
  //     )}
  //     {showProfile && (
  //       <ProfileButton 
  //         onPress={handleProfilePress} 
  //         textColor={textColor}
  //       />
  //     )}
  //   </View>
  // );
  
  return (
    <Surface 
      style={[
        styles.headerContainer,
        transparent && styles.transparentHeader,
        bgColor && { backgroundColor: bgColor },
        { shadowColor: bgColor || COLORS.background.paper },
        style, // Apply additional style props
      ]}
    >
      {renderStatusBar()}
      
      <View style={styles.navbar}>
        {renderLeft()}
        {renderCenter()}
        {/* {renderRight()} For Notifications if implemented */}
      </View>
    </Surface>
  );
};

export default Header;