import { StyleSheet, Platform, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');
const isIphoneX = Platform.OS === 'ios' && (height >= 812 || width >= 812);

// Define theme colors with updated pastel greens
export const COLORS = {
  primary: {
    main: '#34d399',
    light: '#6ee7b7',
    dark: '#10b981',
    text: '#ffffff'
  },
  secondary: {
    main: '#1a5f7a',
    light: '#2a7c9c',
    dark: '#134857',
    text: '#ffffff'
  },
  background: {
    default: '#f0fdf4',
    paper: '#ffffff',
    subtle: '#f8fafc'
  },
  text: {
    main: '#0f172a',
    secondary: '#334155',
    disabled: '#94a3b8',
    hint: '#64748b'
  },
  notification: '#ef4444',
  white: '#FFFFFF',
  border: '#E2E8F0',
  divider: '#e2e8f0'
};

const styles = StyleSheet.create({
  // Header container with improved positioning
  headerContainer: {
    backgroundColor: COLORS.background.paper,
    borderBottomWidth: 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    paddingTop: Platform.OS === 'ios' ? (isIphoneX ? 44 : 20) : 0,
    height: Platform.OS === 'ios' ? (isIphoneX ? 90 : 70) : 60,
    width: '100%',
    zIndex: 100,
    position: 'relative',
  },
  
  // Transparent header
  transparentHeader: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
    borderBottomWidth: 0,
  },
  
  // Navbar styles with better adaptability
  navbar: {
    flex: 1,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  // Title with proper sizing
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.main,
    letterSpacing: 0.3,
  },
  
  // Action buttons
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  
  // Left section
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Right section
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Notification badge
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.notification,
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  
  // Center content
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Search bar
  searchContainer: {
    flex: 1,
    height: 38,
    marginHorizontal: 16,
    backgroundColor: COLORS.background.subtle,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: COLORS.text.main,
    marginLeft: 8,
  },
});

export default styles;