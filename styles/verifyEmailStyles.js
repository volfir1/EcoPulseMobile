import { StyleSheet } from 'react-native';

// Green theme colors
export const greenTheme = {
  PRIMARY: '#2E7D32',
  SECONDARY: '#4CAF50',
  LIGHT: '#81C784',
  BACKGROUND: '#E8F5E9',
  TEXT: '#212121',
  WHITE: '#FFFFFF',
  GRAY: '#757575',
  LIGHT_GRAY: '#EEEEEE',
  ERROR: '#FF5252'
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: greenTheme.BACKGROUND
  },
  keyboardAvoid: {
    flex: 1
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    backgroundColor: greenTheme.WHITE,
    borderRadius: 15,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: greenTheme.TEXT,
    marginBottom: 16,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: greenTheme.GRAY,
    textAlign: 'center'
  },
  email: {
    fontSize: 16,
    fontWeight: 'bold',
    color: greenTheme.PRIMARY,
    textAlign: 'center',
    marginBottom: 24
  },
  instruction: {
    fontSize: 14,
    color: greenTheme.TEXT,
    marginBottom: 16,
    textAlign: 'center'
  },
  inputWrapper: {
    marginBottom: 24,
    width: '100%'
  },
  input: {
    backgroundColor: greenTheme.LIGHT_GRAY,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 2
  },
  errorText: {
    color: greenTheme.ERROR,
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center'
  },
  verifyButton: {
    backgroundColor: greenTheme.PRIMARY,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center'
  },
  disabledButton: {
    opacity: 0.7
  },
  verifyButtonText: {
    color: greenTheme.WHITE,
    fontSize: 16,
    fontWeight: 'bold'
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24
  },
  resendText: {
    fontSize: 14,
    color: greenTheme.GRAY
  },
  resendLink: {
    fontSize: 14,
    color: greenTheme.PRIMARY,
    fontWeight: 'bold'
  },
  countdownText: {
    fontSize: 14,
    color: greenTheme.SECONDARY
  },
  // Debug styles
  debugSection: {
    marginTop: 30,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  debugTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  debugText: {
    fontSize: 10,
    color: '#666',
    marginBottom: 3,
  }
});