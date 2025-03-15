// YearRangePicker.native.jsx
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';  // Using Expo vector icons
import dayjs from 'dayjs';

export const YearRangePicker = ({
  initialStartYear = dayjs().year(),
  initialEndYear = dayjs().add(1, 'year').year(),
  onStartYearChange,
  onEndYearChange,
  style,
}) => {
  // State management
  const [startYear, setStartYear] = useState(dayjs(initialStartYear.toString()));
  const [endYear, setEndYear] = useState(dayjs(initialEndYear.toString()));
  const [error, setError] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Generate years for the picker
  const currentYear = dayjs().year();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - 10 + i);

  // Handlers for year changes
  const handleStartYearChange = useCallback((year) => {
    const newValue = dayjs(year.toString());
    if (!newValue.isValid()) {
      setError(true);
      return;
    }
    
    setStartYear(newValue);
    onStartYearChange?.(newValue.year());
    setShowStartPicker(false);
    setError(false);
  }, [onStartYearChange]);

  const handleEndYearChange = useCallback((year) => {
    const newValue = dayjs(year.toString());
    if (!newValue.isValid()) {
      setError(true);
      return;
    }
    
    // Validate that end year is after start year
    if (year < startYear.year()) {
      setError(true);
      return;
    }
    
    setEndYear(newValue);
    onEndYearChange?.(newValue.year());
    setShowEndPicker(false);
    setError(false);
  }, [onEndYearChange, startYear]);

  // Reset handler
  const handleReset = useCallback(() => {
    const currentYear = dayjs().year();
    const defaultStartYear = dayjs(currentYear.toString());
    const defaultEndYear = dayjs((currentYear + 1).toString());
    
    setStartYear(defaultStartYear);
    setEndYear(defaultEndYear);
    onStartYearChange?.(defaultStartYear.year());
    onEndYearChange?.(defaultEndYear.year());
    setError(false);
  }, [onStartYearChange, onEndYearChange]);

  // Year picker modal
  const renderYearPicker = (visible, onClose, onSelect, selectedYear) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
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
                  item === selectedYear.year() && styles.selectedYearItem
                ]}
                onPress={() => onSelect(item)}
              >
                <Text style={[
                  styles.yearText,
                  item === selectedYear.year() && styles.selectedYearText
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
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.pickerRow}>
        <TouchableOpacity 
          style={[styles.yearButton, error && styles.errorBorder]}
          onPress={() => setShowStartPicker(true)}
        >
          <Text style={styles.yearButtonText}>{startYear.year()}</Text>
        </TouchableOpacity>

        <Text style={styles.toText}>to</Text>

        <TouchableOpacity 
          style={[styles.yearButton, error && styles.errorBorder]}
          onPress={() => setShowEndPicker(true)}
        >
          <Text style={styles.yearButtonText}>{endYear.year()}</Text>
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
          Invalid year range
        </Text>
      )}

      {renderYearPicker(
        showStartPicker, 
        () => setShowStartPicker(false), 
        handleStartYearChange, 
        startYear
      )}

      {renderYearPicker(
        showEndPicker, 
        () => setShowEndPicker(false), 
        handleEndYearChange, 
        endYear
      )}
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
  toText: {
    fontSize: 14,
    color: '#64748B',
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

export default YearRangePicker;