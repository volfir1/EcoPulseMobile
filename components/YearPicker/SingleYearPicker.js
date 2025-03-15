// SingleYearPicker.native.jsx
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';  // Using Expo vector icons
import dayjs from 'dayjs';

export const SingleYearPicker = ({
  initialYear = dayjs().year(),
  onYearChange,
  style,
}) => {
  // State management
  const [singleYear, setSingleYear] = useState(dayjs(initialYear.toString()));
  const [error, setError] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  // Generate years for the picker
  const currentYear = dayjs().year();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - 10 + i);

  // Handler for year change
  const handleYearChange = useCallback((year) => {
    const newValue = dayjs(year.toString());
    if (!newValue.isValid()) {
      setError(true);
      return;
    }
    
    setSingleYear(newValue);
    onYearChange?.(newValue.year());
    setShowPicker(false);
    setError(false);
  }, [onYearChange]);

  // Reset handler
  const handleReset = useCallback(() => {
    const currentYear = dayjs().year();
    const defaultYear = dayjs(currentYear.toString());
    
    setSingleYear(defaultYear);
    onYearChange?.(defaultYear.year());
    setError(false);
  }, [onYearChange]);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.pickerRow}>
        <TouchableOpacity 
          style={[styles.yearButton, error && styles.errorBorder]}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.yearButtonText}>{singleYear.year()}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.resetButton}
          onPress={handleReset}
        >
          <MaterialIcons name="refresh" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {error && (
        <Text style={styles.errorText}>
          Invalid year
        </Text>
      )}

      <Modal
        visible={showPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Year</Text>
            <FlatList
              data={years}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.yearItem,
                    item === singleYear.year() && styles.selectedYearItem
                  ]}
                  onPress={() => handleYearChange(item)}
                >
                  <Text style={[
                    styles.yearText,
                    item === singleYear.year() && styles.selectedYearText
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.yearList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
    borderRadius: 8,
    width: 120,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  yearButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  resetButton: {
    backgroundColor: '#3B82F6',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBorder: {
    borderColor: '#D32F2F',
  },
  errorText: {
    fontSize: 12,
    color: '#D32F2F',
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
    backgroundColor: '#E6F0FF',
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

export default SingleYearPicker;