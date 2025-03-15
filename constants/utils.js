import { Platform, StatusBar, Dimensions } from 'react-native';

// Get screen dimensions
const { height, width } = Dimensions.get('screen');

// Define base size internally
const SIZES = {
  BASE: 16
};

export const StatusHeight = StatusBar.currentHeight;
export const HeaderHeight = (SIZES.BASE * 3.5 + (StatusHeight || 0));
export const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);