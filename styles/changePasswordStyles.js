// src/features/auth/styles/ChangePasswordStyles.js
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
  INFO: '#60A5FA',
  INFO_LIGHT: '#EFF6FF',
  INFO_DARK: '#3B82F6',
  WARNING: '#F59E0B',
  WARNING_LIGHT: '#FEF3C7',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: greenTheme.BACKGROUND,
    top: 20
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
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: greenTheme.BORDER,
    backgroundColor: greenTheme.CARD_BG,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: greenTheme.TEXT,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: greenTheme.TEXT,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: greenTheme.TEXT_LIGHT,
    marginBottom: 24,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
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
    marginTop: 16,
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
  passwordRequirements: {
    marginTop: 8,
    marginBottom: 16,
    padding: 12,
    backgroundColor: greenTheme.GRAY_LIGHT,
    borderRadius: 8,
  },
  requirementText: {
    fontSize: 13,
    color: greenTheme.TEXT_LIGHT,
    marginBottom: 4,
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
    backgroundColor: greenTheme.WARNING,
    width: '66%',
  },
  strengthStrong: {
    backgroundColor: greenTheme.SUCCESS,
    width: '100%',
  },
  strengthText: {
    fontSize: 13,
    marginBottom: 8,
  },
  googleAccountInfo: {
    padding: 16,
    backgroundColor: greenTheme.INFO_LIGHT,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: greenTheme.INFO,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: greenTheme.TEXT,
    flex: 1,
    lineHeight: 20,
  },
  successMessage: {
    padding: 16,
    backgroundColor: greenTheme.PRIMARY_LIGHT,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: greenTheme.PRIMARY,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  successText: {
    fontSize: 14,
    color: greenTheme.PRIMARY_DARK,
    flex: 1,
    lineHeight: 20,
  },
  iconContainer: {
    marginRight: 12,
  }
});

export default styles;