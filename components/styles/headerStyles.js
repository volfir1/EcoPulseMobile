import { StyleSheet, Platform, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');
const isIphoneX = Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);

// Define theme colors with updated pastel greens
export const COLORS = {
    primary: {
        main: '#34d399',    // Pastel mint green
        light: '#6ee7b7',   // Lighter pastel green
        dark: '#10b981',    // Slightly darker but still pastel
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
  // Header container - made thicker
  headerContainer: {
    backgroundColor: COLORS.background.paper,
    borderBottomWidth: 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginTop: Platform.OS === 'ios' ? 40 : 10,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 15,
    overflow: 'hidden',
    height: 70, // Increased height to make header thicker
    top: 8,
    width: '100%',
    right: 10
  },
  
  // Transparent header
  transparentHeader: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
    borderBottomWidth: 0,
  },
  
  // Navbar styles - adjusted for thicker header
  navbar: {
    paddingHorizontal: 12, // More horizontal padding
    height: 70, // Match the container height
    paddingTop: isIphoneX ? 44 : Platform.OS === 'ios' ? 20 : 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    elevation: 0,
    borderBottomWidth: 0,
    width: 'auto'
  },
  
  // Title - adjusted for thicker header
  title: {
    fontSize: 19, // Slightly larger
    fontWeight: '600',
    color: COLORS.text.main,
    letterSpacing: 0.3,
  },
  titleWhite: {
    color: COLORS.white,
  },
  
  // Action buttons - adjusted for thicker header
  actionButton: {
    width: 42, // Slightly larger
    height: 42, // Slightly larger
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
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
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.notification,
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  
  // Center content
  centerSection: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 2, // Slight adjustment for vertical centering
  },
  
  // Custom gradient header - adjusted for thicker header and updated colors
  gradientHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 70, // Match the container height
    borderRadius: 15,
  },
  
  // Search bar
  searchContainer: {
    flex: 1,
    height: 40, // Slightly taller
    marginHorizontal: 16,
    backgroundColor: COLORS.background.subtle,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
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