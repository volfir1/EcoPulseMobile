// EnergyRecommendations.jsx - FIXED VERSION
import React, { useRef, useEffect } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  ScrollView,
  FlatList,
  Modal,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSingleYearPicker } from "../../../components/YearPicker/useSingleYearPicker";

// Import custom hook and styles
import { useRecommendations } from './hook';
import styles from './styles';

// Future Projections Card Component
const FutureProjectionsCard = ({ solarRecommendations }) => {
  if (!solarRecommendations?.future_projections) return null;

  const { future_projections } = solarRecommendations;

  return (
    <View style={styles.projectionsCard}>
      <View>
        <Text style={styles.projectionYearText}>{future_projections.year}</Text>
        <Text style={styles.projectionTitle}>{future_projections.title}</Text>

        <View style={styles.projectionDetails}>
          {Object.entries(future_projections)
            .filter(([key]) => !['year', 'title'].includes(key))
            .map(([key, value]) => (
              <Text key={key} style={styles.projectionDetailText}>
                {key}:{' '}
                <Text style={styles.projectionDetailValue}>{value}</Text>
              </Text>
            ))}
        </View>
      </View>
    </View>
  );
};

const EnergyRecommendations = () => {
  // Use the recommendations hook for data and functionality
  const budgetUpdateTimeout = useRef(null);
  const {
    cityData,
    solarRecommendations,
    budget,
    setBudget,
    selectedYear,
    setSelectedYear,
    handleDownloadPDF,
    isLoading,
    setIsLoading,
    forceRefresh,
    fetchSolarRecommendations,
    tempBudget,
    setTempBudget,
    handleBudgetSubmit
  } = useRecommendations();

  // Use the SingleYearPicker hook for year selection
  const {
    year: yearPickerValue,
    error: yearError,
    showPicker,
    handleYearChange: handleYearPickerChange,
    handleReset,
    togglePicker
  } = useSingleYearPicker({
    initialYear: selectedYear,
    onYearChange: (selectedYearValue) => {
      setSelectedYear(selectedYearValue);
    }
  });

  // FIX 1: Handle budget change without triggering API calls
  const handleBudgetChange = (value) => {
    // Allow empty input for clearing
    if (value === '') {
      setTempBudget('');
      return;
    }

    // Check if input is numeric
    if (/^\d+$/.test(value)) {
      // Only update the tempBudget while typing - no API calls!
      setTempBudget(value);
    }
  };

  useEffect(() => {
    return () => {
      if (budgetUpdateTimeout.current) {
        clearTimeout(budgetUpdateTimeout.current);
      }
    };
  }, []);

  // FIX 2: Update the year picker onPress handler
  const handleYearSelect = (selectedYear) => {
    // Close picker first
    togglePicker();

    // Update values
    handleYearPickerChange(selectedYear);
    setSelectedYear(selectedYear);

    // Fetch new data immediately
    setIsLoading(true);
    
    // Clear any existing timeout
    if (budgetUpdateTimeout.current) {
      clearTimeout(budgetUpdateTimeout.current);
    }

    // Fetch recommendations immediately without timeout
    fetchSolarRecommendations();
  };

  // Calculate end year for year picker (2050)
  const currentYear = new Date().getFullYear();
  const yearRange = Array.from(
    { length: 2050 - currentYear + 1 }, 
    (_, i) => currentYear + i
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Energy Recommendations</Text>
          <Ionicons name="sunny" size={18} color="#E0F2F1" style={{ marginLeft: 4 }} />
        </View>

        <TouchableOpacity
          style={styles.pdfButton}
          onPress={handleDownloadPDF}
          disabled={isLoading}
        >
          <Ionicons name="document-text-outline" size={18} color="#FFF" />
          <Text style={styles.pdfButtonText}>Download PDF</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Input Controls */}
        <View style={styles.controlsCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Budget</Text>
            <View style={styles.budgetInputContainer}>
              <Text style={styles.currencyPrefix}>₱</Text>
              <TextInput
                style={[
                  styles.budgetInput,
                  isLoading && styles.disabledInput
                ]}
                value={tempBudget}
                onChangeText={handleBudgetChange}
                onSubmitEditing={handleBudgetSubmit}
                keyboardType="numeric"
                placeholder="Enter Budget"
                editable={!isLoading}
                returnKeyType="done"
              />
            </View>
            <Text style={styles.helperText}>Minimum: ₱15,000</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Year</Text>
            <TouchableOpacity
              style={styles.yearPickerButton}
              onPress={togglePicker}
              disabled={isLoading}
            >
              <Text style={styles.yearPickerButtonText}>
                {yearPickerValue.year()}
              </Text>
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#64748B"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => {
              forceRefresh();
            }}
            disabled={isLoading}
          >
            <Ionicons name="refresh" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Energy Potential Section */}
        <Text style={styles.sectionTitle}>Renewable Energy Potential</Text>

        <View style={styles.potentialCard}>
          <View style={styles.solarHeader} />
          <View style={styles.potentialContent}>
            <View style={styles.potentialIconContainer}>
              <Ionicons name="sunny" size={24} color="#FF9800" />
            </View>
            <View style={styles.potentialInfo}>
              <Text style={styles.potentialTitle}>Solar</Text>
              <Text style={styles.potentialValue}>
                Potential: {cityData?.location?.solarPotential || 'High'}
              </Text>
              <Text style={styles.potentialDetails}>
                {solarRecommendations?.future_projections?.['Installable Solar Capacity'] ||
                  'Average 5.5 kWh/m²/day'}
              </Text>
            </View>
          </View>
        </View>

        {/* Future Projections Section */}
        <Text style={styles.sectionTitle}>Future Projections</Text>

        {solarRecommendations ? (
          <FutureProjectionsCard solarRecommendations={solarRecommendations} />
        ) : (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="small" color="#2E7D32" />
            <Text style={styles.loadingText}>Loading projections...</Text>
          </View>
        )}

        {/* Cost-Benefit Analysis Section */}
        <Text style={styles.sectionTitle}>Cost-Benefit Analysis</Text>

        {solarRecommendations?.cost_benefit_analysis ? (
          <View style={styles.costBenefitGrid}>
            {solarRecommendations.cost_benefit_analysis.map((item, index) => (
              <View key={index} style={styles.costBenefitCard}>
                <Text style={styles.costBenefitLabel}>{item.label}</Text>
                <View style={styles.costBenefitValueContainer}>
                  <Ionicons
                    name={getIconName(item.icon)}
                    size={20}
                    color="#209652"
                  />
                  <Text style={styles.costBenefitValue}>
                    {item.value}
                  </Text>
                </View>
                <Text style={styles.costBenefitDescription}>
                  {item.description}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="small" color="#2E7D32" />
            <Text style={styles.loadingText}>Loading analysis...</Text>
          </View>
        )}
      </ScrollView>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#1E8449" />
            <Text style={styles.loadingText}>Loading data...</Text>
          </View>
        </View>
      )}

      {/* Year Picker Modal - FIXED to show years until 2050 */}
      <Modal
        visible={showPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={togglePicker}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={togglePicker}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader} onStartShouldSetResponder={() => true}>
              <Text style={styles.modalTitle}>Select Year</Text>
              <TouchableOpacity onPress={togglePicker}>
                <Ionicons name="close" size={24} color="#4A5568" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={yearRange}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.yearItem,
                    item === yearPickerValue.year() &&
                    styles.selectedYearItem
                  ]}
                  onPress={() => handleYearSelect(item)}
                >
                  <Text style={[
                    styles.yearItemText,
                    item === yearPickerValue.year() &&
                    styles.selectedYearText
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
    </SafeAreaView>
  );
};

// Helper function to map web icon names to Ionicons names
export const getIconName = (webIconName) => {
  const iconMap = {
    'money': 'cash-outline',
    'savings': 'trending-up',
    'calendar': 'calendar-outline',
    'power': 'flash-outline',
    'info': 'information-circle-outline',
    'loading': 'refresh',
    'save': 'download-outline',
    'solar': 'sunny-outline',
    'location': 'location-outline'
  };

  return iconMap[webIconName] || 'help-circle-outline';
};

export default EnergyRecommendations;