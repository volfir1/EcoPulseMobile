// src/features/auth/styles/ResetPasswordStyles.js
import { StyleSheet } from 'react-native';

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
  TRANSPARENT: 'transparent',
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
    padding: 20,
    paddingBottom: 40,
  },
  card: {
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: greenTheme.TEXT,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: greenTheme.TEXT_LIGHT,
    marginBottom: 24,
    lineHeight: 22,
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
    marginTop: 4,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  codeInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: greenTheme.BORDER,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 18,
    letterSpacing: 2,
    textAlign: 'center',
    backgroundColor: greenTheme.CARD_BG,
    marginRight: 8,
  },
  countdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontSize: 14,
    color: greenTheme.TEXT_LIGHT,
    fontWeight: '500',
  },
  resendButton: {
    padding: 10,
  },
  resendText: {
    fontSize: 14,
    color: greenTheme.PRIMARY,
    fontWeight: '600',
  },
  resendDisabled: {
    color: greenTheme.GRAY,
  },
  strengthIndicator: {
    height: 4,
    borderRadius: 2,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: greenTheme.GRAY_LIGHT,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthWeak: {
    backgroundColor: greenTheme.ERROR,
    width: '33%',
  },
  strengthMedium: {
    backgroundColor: '#FBBF24', // Amber
    width: '66%',
  },
  strengthStrong: {
    backgroundColor: greenTheme.SUCCESS,
    width: '100%',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    color: greenTheme.PRIMARY,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  successContainer: {
    alignItems: 'center',
    padding: 24,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: greenTheme.PRIMARY_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: greenTheme.TEXT,
    marginBottom: 8,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    color: greenTheme.TEXT_LIGHT,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  policyText: {
    fontSize: 14,
    color: greenTheme.TEXT_LIGHT,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 20,
  },
});

export default styles;