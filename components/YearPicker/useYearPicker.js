// src/components/YearRangePicker/index.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const YearRangePicker = ({
  initialStartYear = new Date().getFullYear(),
  initialEndYear = new Date().getFullYear() + 5,
  minYear = 2010,
  maxYear = 2050,
  onStartYearChange,
  onEndYearChange,
  primaryColor = '#2E90E5',
  style
}) => {
  // State for selected years
  const [startYear, setStartYear] = useState(initialStartYear);
  const [endYear, setEndYear] = useState(initialEndYear);
  
  // State for modals
  const [startYearModalVisible, setStartYearModalVisible] = useState(false);
  const [endYearModalVisible, setEndYearModalVisible] = useState(false);
  
  // Generate array of years between min and max
  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i
  );
  
  // Handle start year selection
  const handleStartYearSelect = (year) => {
    // For UI consistency, allow any selection, but tell parent about constraints
    setStartYear(year);
    setStartYearModalVisible(false);
    console.log(`Start year selected: ${year}`);
    if (onStartYearChange) {
      onStartYearChange(year);
    }
  };
  
  // Handle end year selection
  const handleEndYearSelect = (year) => {
    // For UI consistency, allow any selection, but tell parent about constraints
    setEndYear(year);
    setEndYearModalVisible(false);
    console.log(`End year selected: ${year}`);
    if (onEndYearChange) {
      onEndYearChange(year);
    }
  };
  
  // Year picker modal
  const YearPickerModal = ({ visible, onClose, onSelect, selectedYear, title }) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={years}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.yearItem,
                    item === selectedYear && {
                      backgroundColor: `${primaryColor}20`, // 20% opacity
                      borderColor: primaryColor
                    }
                  ]}
                  onPress={() => onSelect(item)}
                >
                  <Text
                    style={[
                      styles.yearText,
                      item === selectedYear && { color: primaryColor, fontWeight: 'bold' }
                    ]}
                  >
                    {item}
                  </Text>
                  {item === selectedYear && (
                    <Ionicons name="checkmark" size={18} color={primaryColor} />
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              initialScrollIndex={years.findIndex(year => year === selectedYear)}
              getItemLayout={(data, index) => (
                { length: 50, offset: 50 * index, index }
              )}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
  
  return (
    <View style={[styles.container, style]}>
      {/* Start Year Button */}
      <TouchableOpacity
        style={styles.yearButton}
        onPress={() => setStartYearModalVisible(true)}
      >
        <Text style={styles.yearButtonLabel}>Start Year</Text>
        <View style={styles.yearValueContainer}>
          <Text style={styles.yearValue}>{startYear}</Text>
          <Ionicons name="calendar-outline" size={16} color="#6B7280" />
        </View>
      </TouchableOpacity>
      
      {/* Divider */}
      <View style={styles.divider}>
        <Text style={styles.dividerText}>to</Text>
      </View>
      
      {/* End Year Button */}
      <TouchableOpacity
        style={styles.yearButton}
        onPress={() => setEndYearModalVisible(true)}
      >
        <Text style={styles.yearButtonLabel}>End Year</Text>
        <View style={styles.yearValueContainer}>
          <Text style={styles.yearValue}>{endYear}</Text>
          <Ionicons name="calendar-outline" size={16} color="#6B7280" />
        </View>
      </TouchableOpacity>
      
      {/* Modals */}
      <YearPickerModal
        visible={startYearModalVisible}
        onClose={() => setStartYearModalVisible(false)}
        onSelect={handleStartYearSelect}
        selectedYear={startYear}
        title="Select Start Year"
      />
      
      <YearPickerModal
        visible={endYearModalVisible}
        onClose={() => setEndYearModalVisible(false)}
        onSelect={handleEndYearSelect}
        selectedYear={endYear}
        title="Select End Year"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  yearButton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  yearButtonLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  yearValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  yearValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  divider: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerText: {
    color: '#6B7280',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    maxHeight: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  yearItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  yearText: {
    fontSize: 16,
    color: '#374151',
  },
});

export default YearRangePicker;