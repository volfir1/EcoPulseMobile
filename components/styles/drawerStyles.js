import { StyleSheet } from "react-native";

// Updated theme colors with modern approach
export const THEME = {
  primary: {
    main: '#22c55e',
    light: '#4ade80',
    dark: '#16a34a',
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
    biomass: '#16a34a'
  },
  divider: '#e2e8f0'
};

// Redesigned styles with clean professional look
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
    paddingTop: 16,
  },
  
  // Header styles - redesigned with flat color
  header: {
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 20,
    backgroundColor: THEME.primary.main,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
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
  
  // Profile section styles - cleaner design
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileAvatar: {
    marginRight: 15,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
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
    color: "rgba(255,255,255,0.9)",
  },
  
  // Divider styles - refined
  divider: {
    height: 1,
    backgroundColor: THEME.divider,
    marginVertical: 16,
    marginHorizontal: 20,
  },
  itemDivider: {
    height: 1,
    backgroundColor: THEME.divider,
    marginVertical: 8,
    marginHorizontal: 0,
    opacity: 0.5,
  },
  
  // Navigation item styles - cleaner approach
  navItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 4,
    position: 'relative',
  },
  childItem: {
    paddingLeft: 36,
    paddingVertical: 10,
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
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
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
  
  // Expandable content styles - smoother
  childrenContainer: {
    overflow: "hidden",
    paddingBottom: 4,
  },
  
  // Footer styles - redesigned
  footer: {
    borderTopWidth: 1,
    borderTopColor: THEME.divider,
    padding: 12,
    elevation: 0,
    backgroundColor: THEME.background.paper,
  },
  logoutButton: {
    padding: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    width: 110,
    alignSelf: 'center',
    elevation: 1,
    shadowColor: "#D70000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logoutButtonText: {
    color: "#991b1b",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default styles;