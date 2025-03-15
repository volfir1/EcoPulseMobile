import { StyleSheet } from "react-native";

// Updated theme colors with lighter green
export const THEME = {
  primary: {
    main: '#22c55e',     // Updated to lighter green
    light: '#4ade80',    // Even lighter green
    dark: '#16a34a',     // Slightly darker but still light
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
  elements: {
    solar: '#F4D03F',
    wind: '#38BDF8',
    geothermal: '#FF7F7F',
    hydropower: '#1C556F',
    biomass: '#16a34a'   // Updated to match the green theme
  },
  divider: '#e2e8f0'
};

// Separated styles
const styles = StyleSheet.create({
  // Container and layout styles
  container: {
    flex: 1,
    backgroundColor: THEME.background.paper,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  navigationSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  
  // Header styles
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 45,
    marginBottom: 10,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    backgroundColor: THEME.primary.main, // Updated to use the new primary color
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  
  // Profile section styles
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileAvatar: {
    marginRight: 15,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  avatarLabel: {
    fontSize: 22,
    fontWeight: "bold",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailIcon: {
    marginRight: 6,
  },
  profileEmail: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  
  // Divider styles
  divider: {
    height: 1,
    backgroundColor: THEME.divider,
    marginVertical: 16,
    marginHorizontal: 20,
  },
  itemDivider: {
    height: 1,
    backgroundColor: THEME.divider,
    marginVertical: 6,
    marginHorizontal: 0,
    opacity: 0.6,
  },
  
  // Navigation item styles
  navItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginVertical: 4,
    position: 'relative',
  },
  childItem: {
    paddingLeft: 36,
    paddingVertical: 10, // Consistent vertical padding
    marginLeft: 16,
    marginVertical: 2,
  },
  activeItem: {
    backgroundColor: THEME.primary.main,
  },
  navItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(34, 197, 94, 0.1)', // Updated to match new green color
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  navItemText: {
    fontSize: 15,
    flex: 1,
    color: THEME.text.main,
    fontWeight: "500",
  },
  activeItemText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  chevronContainer: {
    width: 20,
    alignItems: 'center',
  },
  
  // Expandable content styles
  childrenContainer: {
    overflow: "hidden",
    paddingBottom: 5, // Add some padding at the bottom
  },
  
  // Footer styles
  footer: {
    borderTopWidth: 1,
    borderTopColor: THEME.divider,
    padding: 12, // Reduced from 16
    elevation: 0,
  },
  logoutButton: {
    padding: 10, // Reduced from 14
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    borderRadius: 10, // Reduced from 12
    borderWidth: 1,
    borderColor: "#FEE2E2",
    // Add width property to make it not span the full width
    width: 120, // Specific width instead of full width
    alignSelf: 'center', // Center it horizontally
  },
  logoutButtonText: {
    color: "#991b1b",
    fontSize: 14, // Reduced from 16
    fontWeight: "600",
    marginLeft: 8, // Reduced from 10
  },
});

export default styles;