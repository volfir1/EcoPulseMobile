import React from 'react';
import * as Font from 'expo-font';
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import argonConfig from '../assets/config/argon.json';
const ArgonExtra = require('../assets/font/argon.ttf');
const IconArgonExtra = createIconSetFromIcoMoon(argonConfig, 'ArgonExtra');

const CustomIcon = ({ 
  name = '', 
  family = '',
  size = 14,
  color = 'black',
  ...rest 
}) => {
  const [fontLoaded, setFontLoaded] = React.useState(false);

  React.useEffect(() => {
    async function loadFont() {
      try {
        await Font.loadAsync({ ArgonExtra: ArgonExtra });
        setFontLoaded(true);
        console.log("ArgonExtra font loaded successfully");
      } catch (error) {
        console.error("Failed to load ArgonExtra font:", error);
      }
    }
    
    loadFont();
  }, []);

  // If the font is loaded and we're using ArgonExtra, use the custom icon set
  if (family === 'ArgonExtra' && fontLoaded) {
    return <IconArgonExtra name={name} family={family} size={size} color={color} {...rest} />;
  }
  
  // Convert any Ionicons naming pattern to Material Icons equivalents
  if (name.includes('-outline')) {
    const baseName = name.replace('-outline', '');
    switch (baseName) {
      case 'home':
        return <MaterialIcons name="home" size={size} color={color} {...rest} />;
      case 'share':
        return <MaterialIcons name="share" size={size} color={color} {...rest} />;
      case 'bulb':
        return <MaterialIcons name="lightbulb" size={size} color={color} {...rest} />;
      case 'settings':
        return <MaterialIcons name="settings" size={size} color={color} {...rest} />;
      case 'document-text':
        return <MaterialIcons name="description" size={size} color={color} {...rest} />;
      case 'sunny':
        return <MaterialIcons name="wb-sunny" size={size} color={color} {...rest} />;
      case 'thunderstorm':
        return <MaterialIcons name="air" size={size} color={color} {...rest} />;
      case 'flame':
        return <MaterialIcons name="local-fire-department" size={size} color={color} {...rest} />;
      case 'water':
        return <MaterialIcons name="water-drop" size={size} color={color} {...rest} />;
      case 'leaf':
        return <MaterialIcons name="eco" size={size} color={color} {...rest} />;
      case 'grid':
        return <MaterialIcons name="dashboard" size={size} color={color} {...rest} />;
      case 'help-circle':
        return <MaterialIcons name="help" size={size} color={color} {...rest} />;
      default:
        return <MaterialIcons name="circle" size={size} color={color} {...rest} />;
    }
  }
  
  // Direct MaterialIcons usage
  if (family === 'MaterialIcons') {
    return <MaterialIcons name={name} size={size} color={color} {...rest} />;
  }
  
  // Handle 'menu' and 'chevron-left' icons used in the Header component
  if (name === 'menu') {
    return <MaterialIcons name="menu" size={size} color={color} {...rest} />;
  }
  
  if (name === 'chevron-left') {
    return <MaterialIcons name="chevron-left" size={size} color={color} {...rest} />;
  }
  
  // Map common icon names to MaterialIcons
  switch (name) {
    case 'home':
      return <MaterialIcons name="home" size={size} color={color} {...rest} />;
    case 'dashboard':
      return <MaterialIcons name="dashboard" size={size} color={color} {...rest} />;
    case 'wb-sunny':
      return <MaterialIcons name="wb-sunny" size={size} color={color} {...rest} />;
    case 'air':
      return <MaterialIcons name="air" size={size} color={color} {...rest} />;
    case 'local-fire-department':
      return <MaterialIcons name="local-fire-department" size={size} color={color} {...rest} />;
    case 'water-drop':
      return <MaterialIcons name="water-drop" size={size} color={color} {...rest} />;
    case 'eco':
      return <MaterialIcons name="eco" size={size} color={color} {...rest} />;
    case 'people':
      return <MaterialIcons name="people" size={size} color={color} {...rest} />;
    case 'bar-chart':
      return <MaterialIcons name="bar-chart" size={size} color={color} {...rest} />;
    case 'help':
      return <MaterialIcons name="help" size={size} color={color} {...rest} />;
    case 'logout':
      return <MaterialIcons name="logout" size={size} color={color} {...rest} />;
    case 'settings':
      return <MaterialIcons name="settings" size={size} color={color} {...rest} />;
    case 'share':
      return <MaterialIcons name="share" size={size} color={color} {...rest} />;
    case 'lightbulb':
      return <MaterialIcons name="lightbulb" size={size} color={color} {...rest} />;
    case 'keyboard-arrow-down':
      return <MaterialIcons name="keyboard-arrow-down" size={size} color={color} {...rest} />;
    case 'keyboard-arrow-right':
      return <MaterialIcons name="keyboard-arrow-right" size={size} color={color} {...rest} />;
    
    // Map ArgonExtra icons to MaterialIcons
    case 'shop':
      return <MaterialIcons name="storefront" size={size} color={color} {...rest} />;
    case 'map-big':
      return <MaterialIcons name="map" size={size} color={color} {...rest} />;
    case 'spaceship':
      return <MaterialIcons name="rocket" size={size} color={color} {...rest} />;
    case 'chart-pie-35':
      return <MaterialIcons name="pie-chart" size={size} color={color} {...rest} />;
    case 'calendar-date':
      return <MaterialIcons name="event" size={size} color={color} {...rest} />;
    case 'profile-circle':
      return <MaterialIcons name="account-circle" size={size} color={color} {...rest} />;
    case 'cart':
      return <MaterialIcons name="shopping-cart" size={size} color={color} {...rest} />;
    case 'settings-gear-65':
      return <MaterialIcons name="settings" size={size} color={color} {...rest} />;
    case 'bell':
      return <MaterialIcons name="notifications" size={size} color={color} {...rest} />;
    case 'basket':
      return <MaterialIcons name="shopping-basket" size={size} color={color} {...rest} />;
    case 'search-zoom-in':
      return <MaterialIcons name="search" size={size} color={color} {...rest} />;
      
    // For any other icon, use a default circle
    default:
      return <MaterialIcons name="circle" size={size} color={color} {...rest} />;
  }
};

export default CustomIcon;