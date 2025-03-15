// styles.js
import { StyleSheet } from 'react-native';

export const yearPickerStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 8,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  yearButton: {
    backgroundColor: '#fff',
    borderRadius: 100, // Rounded edges like MUI
    width: 150,
    height: 42,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  yearButtonError: {
    borderColor: '#EF4444',
  },
  yearButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  resetButton: {
    backgroundColor: '#3B82F6',
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  toText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  yearList: {
    paddingBottom: 16,
  },
  yearItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectedYearItem: {
    backgroundColor: '#EBF5FF',
  },
  yearText: {
    fontSize: 16,
    textAlign: 'center',
  },
  selectedYearText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
});

export const getPickerStyleProps = (error) => ({
  yearButtonStyle: [
    yearPickerStyles.yearButton,
    error && yearPickerStyles.yearButtonError
  ],
  yearButtonTextStyle: yearPickerStyles.yearButtonText,
});

export default yearPickerStyles;