// src/features/auth/styles/ForgotPasswordStyles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const greenTheme = {
  PRIMARY: '#10B981',
  PRIMARY_DARK: '#059669',
  PRIMARY_LIGHT: '#D1FAE5',
  ACCENT: '#3B82F6',
  BACKGROUND: '#F9FAFB',
  CARD_BG: '#FFFFFF',
  TEXT: '#1F2937',
  TEXT_LIGHT: '#6B7280',
  BORDER: '#E5E7EB',
  ERROR: '#EF4444',
  SUCCESS: '#10B981',
  GRAY: '#9CA3AF',
  GRAY_LIGHT: '#F3F4F6',
  INFO: '#60A5FA',
  INFO_LIGHT: '#EFF6FF',
  INFO_DARK: '#3B82F6',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: greenTheme.BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  cardsContainer: {
    width: width * 2, // Double width to hold both cards side by side
    flexDirection: 'row',
  },
  card: {
    width: width - 40, // Account for padding
    backgroundColor: greenTheme.CARD_BG,
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  backNavigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  backNavigationText: {
    fontSize: 16,
    fontWeight: '500',
    color: greenTheme.PRIMARY,
    marginLeft: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: greenTheme.CARD_BG,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: greenTheme.BORDER,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: greenTheme.PRIMARY,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: greenTheme.TEXT,
  },
  activeTabText: {
    color: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: greenTheme.TEXT,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: greenTheme.TEXT_LIGHT,
    marginBottom: 24,
    lineHeight: 22,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: greenTheme.TEXT,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: greenTheme.BORDER,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: greenTheme.CARD_BG,
    color: greenTheme.TEXT,
  },
  inputError: {
    borderColor: greenTheme.ERROR,
  },
  errorText: {
    color: greenTheme.ERROR,
    fontSize: 14,
    marginTop: 6,
  },
  button: {
    height: 50,
    borderRadius: 8,
    backgroundColor: greenTheme.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: greenTheme.GRAY,
    opacity: 0.7,
  },
  linkButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  linkText: {
    color: greenTheme.PRIMARY,
    fontSize: 16,
    fontWeight: '500',
  },
  codeContainer: {
    marginBottom: 24,
  },
  verificationInput: {
    height: 50,
    borderWidth: 1,
    borderColor: greenTheme.BORDER,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: greenTheme.CARD_BG,
  },
  codeHelp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  codeHelpText: {
    fontSize: 14,
    color: greenTheme.TEXT_LIGHT,
  },
  resendButton: {
    padding: 4,
  },
  resendText: {
    fontSize: 14,
    color: greenTheme.PRIMARY,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: greenTheme.INFO_LIGHT,
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: greenTheme.INFO,
  },
  infoText: {
    color: greenTheme.TEXT,
    fontSize: 14,
    lineHeight: 20,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: greenTheme.BORDER,
  },
  orText: {
    color: greenTheme.TEXT_LIGHT,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  manualTokenButton: {
    padding: 10,
    alignItems: 'center',
  },
  manualTokenText: {
    color: greenTheme.PRIMARY,
    fontSize: 14,
    fontWeight: '500',
  },
  // Email icon on the input
  inputIconContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 12,
    justifyContent: 'center',
  },
  // Animation for card transitions
  slide: {
    width: width - 40,
  },
  emailIcon: {
    marginBottom: 24,
    alignSelf: 'center',
  },
  // Email display in code tab
  emailDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: greenTheme.PRIMARY_LIGHT,
    padding: 8,
    borderRadius: 8,
  },
  emailDisplayText: {
    color: greenTheme.PRIMARY_DARK,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  }
});

export default styles;