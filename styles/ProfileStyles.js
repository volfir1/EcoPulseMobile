import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get("screen");

// Enhanced green theme colors with additional shades
export const greenTheme = {
  PRIMARY: '#2E7D32',
  PRIMARY_DARK: '#1B5E20', // Darker shade for pressed states
  PRIMARY_LIGHT: '#43A047', // Lighter shade for hover states
  SECONDARY: '#4CAF50',
  LIGHT: '#81C784',
  BACKGROUND: '#E8F5E9',
  TEXT: '#212121',
  TEXT_SECONDARY: '#424242',
  TEXT_LIGHT: '#757575',
  WHITE: '#FFFFFF',
  OFF_WHITE: '#F9F9F9',
  GRAY: '#757575',
  LIGHT_GRAY: '#EEEEEE',
  ERROR: '#FF5252',
  ERROR_DARK: '#D32F2F',
  SUCCESS: '#4CAF50',
  WARNING: '#FFC107',
  INFO: '#2196F3',
  OVERLAY: 'rgba(0, 0, 0, 0.5)',
  SHADOW: '#000000',
  BACKDROP: 'rgba(0, 0, 0, 0.3)'
};

// Helper function for responsive sizing
const responsiveSize = (baseSize) => {
  const shortestDimension = Math.min(width, height);
  return (baseSize / 375) * shortestDimension; // 375 is base width (iPhone X)
};

// Common shadow styles
const defaultShadow = {
  shadowColor: greenTheme.SHADOW,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 3
};

const deepShadow = {
  shadowColor: greenTheme.SHADOW,
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.2,
  shadowRadius: 15,
  elevation: 8
};

// Animation timing constants
export const ANIMATION_TIMING = {
  FAST: 200,
  MEDIUM: 300,
  SLOW: 500
};

export const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: greenTheme.BACKGROUND,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    top: 20
  },
  
  // Scroll container
  scrollView: {
    width: width,
    ...Platform.select({
      ios: {
        zIndex: 1,
      },
      android: {
        elevation: 1,
      }
    })
  },
  
  scrollContent: {
    paddingBottom: responsiveSize(40),
  },
  
  // Debug section
  debugContainer: {
    padding: 12,
    margin: 10,
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    borderColor: '#FFE5A0',
    borderWidth: 1,
    marginBottom: 0
  },
  
  debugText: {
    color: '#856404',
    fontSize: 12,
    lineHeight: 18
  },
  
  // Loading states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: responsiveSize(50),
  },
  
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: greenTheme.PRIMARY,
    fontWeight: '500'
  },
  
  // Profile card
  profileCard: {
    padding: responsiveSize(24),
    marginHorizontal: responsiveSize(20),
    marginTop: responsiveSize(20),
    marginBottom: responsiveSize(20),
    borderRadius: 16,
    backgroundColor: greenTheme.WHITE,
    ...defaultShadow,
  },
  
  // Avatar section - enhanced for images
  avatarContainer: {
    alignItems: 'center',
    marginVertical: responsiveSize(20),
  },
  
  avatarEditContainer: {
    position: 'relative',
    width: responsiveSize(110),
    height: responsiveSize(110),
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  avatar: {
    width: responsiveSize(100),
    height: responsiveSize(100),
    borderRadius: responsiveSize(50),
    backgroundColor: greenTheme.LIGHT_GRAY,
    borderWidth: 3,
    borderColor: greenTheme.WHITE,
    ...defaultShadow,
  },
  
  defaultAvatarImage: {
    width: responsiveSize(60),
    height: responsiveSize(60),
    borderRadius: responsiveSize(30),
    resizeMode: 'cover',
  },
  
  editAvatarBadge: {
    position: 'absolute',
    bottom: responsiveSize(2),
    right: responsiveSize(2),
    width: responsiveSize(34),
    height: responsiveSize(34),
    borderRadius: responsiveSize(17),
    backgroundColor: greenTheme.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: greenTheme.WHITE,
    ...defaultShadow,
  },
  
  avatarPlaceholder: {
    width: responsiveSize(100),
    height: responsiveSize(100),
    borderRadius: responsiveSize(50),
    backgroundColor: greenTheme.LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    ...defaultShadow,
  },
  
  avatarText: {
    fontSize: responsiveSize(32),
    fontWeight: 'bold',
    color: greenTheme.WHITE,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  letterAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: responsiveSize(50),
    justifyContent: 'center',
    alignItems: 'center',
    ...defaultShadow,
  },
  
  letterText: {
    fontSize: responsiveSize(28),
    fontWeight: 'bold',
    color: greenTheme.WHITE,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  // Avatar modal - enhanced
  avatarModal: {
    backgroundColor: greenTheme.WHITE,
    padding: responsiveSize(20),
    borderRadius: 16,
    marginBottom: responsiveSize(24),
    ...deepShadow,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  
  avatarModalTitle: {
    fontSize: responsiveSize(20),
    fontWeight: 'bold',
    marginBottom: responsiveSize(18),
    textAlign: 'center',
    color: greenTheme.TEXT,
    letterSpacing: 0.5,
  },
  
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: responsiveSize(15),
  },
  
  avatarOption: {
    width: (width - responsiveSize(120)) / 3,
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: responsiveSize(15),
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: greenTheme.LIGHT_GRAY,
    backgroundColor: greenTheme.OFF_WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    ...defaultShadow,
  },
  
  selectedAvatarOption: {
    borderColor: greenTheme.PRIMARY,
    borderWidth: 3,
    transform: [{ scale: 1.05 }],
  },
  
  avatarImage: {
    width: '80%',
    height: '80%',
    borderRadius: responsiveSize(12),
  },
  
  uploadAvatarPlaceholder: {
    width: '80%',
    height: '80%',
    backgroundColor: greenTheme.LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveSize(12),
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: greenTheme.GRAY,
  },
  
  uploadText: {
    marginTop: 6,
    fontSize: responsiveSize(12),
    color: greenTheme.PRIMARY,
    fontWeight: '600',
  },
  
  closeModalButton: {
    backgroundColor: greenTheme.PRIMARY,
    paddingVertical: responsiveSize(12),
    paddingHorizontal: responsiveSize(20),
    borderRadius: 10,
    alignItems: 'center',
    marginTop: responsiveSize(10),
    ...defaultShadow,
  },
  
  closeModalText: {
    color: greenTheme.WHITE,
    fontWeight: 'bold',
    fontSize: responsiveSize(16),
  },
  
  // Progress indicators
  progressContainer: {
    marginVertical: responsiveSize(15),
    backgroundColor: greenTheme.LIGHT_GRAY,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  
  progressBar: {
    height: '100%',
    backgroundColor: greenTheme.PRIMARY,
  },
  
  progressText: {
    textAlign: 'center',
    fontSize: responsiveSize(12),
    color: greenTheme.PRIMARY,
    marginTop: 5,
    fontWeight: '500',
  },
  
  // User info section
  userInfoSection: {
    alignItems: 'center',
    marginVertical: responsiveSize(20),
  },
  
  nameContainer: {
    alignItems: 'center',
  },
  
  nameText: {
    fontSize: responsiveSize(26),
    fontWeight: 'bold',
    color: greenTheme.TEXT,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  
  emailText: {
    fontSize: responsiveSize(16),
    color: greenTheme.PRIMARY,
    marginBottom: 10,
    textAlign: 'center',
  },
  
  editButton: {
    marginTop: responsiveSize(15),
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: greenTheme.LIGHT,
    borderRadius: 20,
    ...defaultShadow,
  },
  
  editButtonText: {
    color: greenTheme.PRIMARY,
    fontWeight: 'bold',
    fontSize: responsiveSize(14),
  },
  
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: greenTheme.LIGHT_GRAY,
    marginVertical: responsiveSize(15),
  },
  
  // Settings section
  settingsSection: {
    marginTop: responsiveSize(10),
  },
  
  settingOption: {
    paddingVertical: responsiveSize(15),
  },
  
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveSize(10),
  },
  
  settingText: {
    fontSize: responsiveSize(16),
    color: greenTheme.TEXT,
    fontWeight: '500',
  },
  
  chevron: {
    fontSize: responsiveSize(22),
    color: greenTheme.SECONDARY,
    fontWeight: '600',
  },
  
  // Form elements - enhanced
  formContainer: {
    marginTop: responsiveSize(20),
  },
  
  formLabel: {
    fontSize: responsiveSize(14),
    color: greenTheme.GRAY,
    marginBottom: 5,
    marginLeft: 5,
    fontWeight: '500',
  },
  
  textInput: {
    backgroundColor: greenTheme.LIGHT_GRAY,
    paddingHorizontal: responsiveSize(15),
    paddingVertical: responsiveSize(12),
    borderRadius: 10,
    marginBottom: responsiveSize(15),
    fontSize: responsiveSize(16),
    color: greenTheme.TEXT,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  
  textInputFocused: {
    borderColor: greenTheme.PRIMARY,
    backgroundColor: greenTheme.WHITE,
  },
  
  textInputError: {
    borderColor: greenTheme.ERROR,
    backgroundColor: 'rgba(255, 82, 82, 0.05)',
  },
  
  errorText: {
    color: greenTheme.ERROR,
    fontSize: responsiveSize(12),
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
  },
  
  // Buttons
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsiveSize(15),
  },
  
  button: {
    paddingVertical: responsiveSize(14),
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
    ...defaultShadow,
  },
  
  cancelButton: {
    backgroundColor: greenTheme.LIGHT_GRAY,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  
  saveButton: {
    backgroundColor: greenTheme.PRIMARY,
  },
  
  disabledButton: {
    backgroundColor: greenTheme.LIGHT_GRAY,
    opacity: 0.7,
  },
  
  buttonText: {
    fontSize: responsiveSize(16),
    fontWeight: 'bold',
    color: greenTheme.TEXT,
  },
  
  saveButtonText: {
    color: greenTheme.WHITE,
  },
  
  disabledButtonText: {
    color: greenTheme.GRAY,
  },
  
  // Additional avatar styles
  avatarPreview: {
    width: responsiveSize(120),
    height: responsiveSize(120),
    borderRadius: responsiveSize(60),
    marginBottom: responsiveSize(20),
    alignSelf: 'center',
    borderWidth: 4,
    borderColor: greenTheme.WHITE,
    ...deepShadow,
  },
  
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveSize(60),
  },
  
  avatarSelectionContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: greenTheme.BACKDROP,
    zIndex: 1000,
  },
  
  avatarSelectionInner: {
    width: width * 0.85,
    backgroundColor: greenTheme.WHITE,
    borderRadius: 16,
    paddingVertical: responsiveSize(20),
    ...deepShadow,
  },
  
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: responsiveSize(30),
    height: responsiveSize(30),
    borderRadius: responsiveSize(15),
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  
  // Section titles
  sectionTitle: {
    fontSize: responsiveSize(18),
    fontWeight: 'bold',
    color: greenTheme.TEXT,
    marginVertical: responsiveSize(15),
    paddingHorizontal: responsiveSize(5),
  },
  
  // Responsive image grid
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: responsiveSize(10),
  },
  
  gridItem: {
    width: (width - responsiveSize(80)) / 3,
    aspectRatio: 1,
    margin: responsiveSize(5),
    borderRadius: 8,
    overflow: 'hidden',
    ...defaultShadow,
  },
  
  // Feedback states
  successMessage: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: responsiveSize(12),
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: greenTheme.SUCCESS,
    marginVertical: responsiveSize(10),
  },
  
  errorMessage: {
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
    padding: responsiveSize(12),
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: greenTheme.ERROR,
    marginVertical: responsiveSize(10),
  },
  
  infoMessage: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    padding: responsiveSize(12),
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: greenTheme.INFO,
    marginVertical: responsiveSize(10),
  },
  
  messageText: {
    fontSize: responsiveSize(14),
    color: greenTheme.TEXT,
    lineHeight: responsiveSize(20),
  },
  
  // Upload button
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: greenTheme.LIGHT,
    paddingVertical: responsiveSize(12),
    paddingHorizontal: responsiveSize(20),
    borderRadius: 10,
    marginTop: responsiveSize(10),
    borderWidth: 1,
    borderColor: greenTheme.PRIMARY,
    ...defaultShadow,
  },
  
  uploadButtonText: {
    marginLeft: 8,
    fontSize: responsiveSize(14),
    color: greenTheme.PRIMARY,
    fontWeight: 'bold',
  },
  genderOption: {
    flex: 1,
    paddingVertical: responsiveSize(10),
    paddingHorizontal: responsiveSize(5),
    backgroundColor: greenTheme.LIGHT_GRAY,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  
  genderOptionSelected: {
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    borderColor: greenTheme.PRIMARY,
  },
  
  genderText: {
    fontSize: responsiveSize(12),
    color: greenTheme.GRAY,
    textAlign: 'center',
  },
  
  genderTextSelected: {
    color: greenTheme.PRIMARY,
    fontWeight: '600',
  },
});

export default styles;