import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  ScrollView,
  StatusBar,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ViewShot from "react-native-view-shot";
import YearRangePicker from "@components/YearPicker/useYearPicker";import SimpleChart from './Chart';
import useEnergyAnalytics from "../../../../../store/useEnergyAnalytics";
import Header from "@components/Header";
// Import updated styles - make sure the path is correct
import styles from './styles';

const { width } = Dimensions.get("screen");

const BiomassEnergy = () => {
  // Define energy type for this screen
  const ENERGY_TYPE = 'biomass';
  
  // Use our unified hook with 'biomass' as the energy type
  const {
    generationData,
    currentProjection,
    loading,
    error,
    connectionStatus,
    startYear,
    endYear,
    handleStartYearChange,
    handleEndYearChange,
    handleDownload,
    handleDownloadPDF,
    handleShareText,
    pdfGenerating,
    chartRef,
    config
  } = useEnergyAnalytics(ENERGY_TYPE);

  // Store formatted years in state to avoid calculations during render
  const [yearValues, setYearValues] = useState({
    startYear: 0,
    endYear: 0,
    yearDiff: 0
  });
  
  // Format year values in effect, not during render
  useEffect(() => {
    // Safely get year values
    const getYearValue = (dateObj) => {
      if (typeof dateObj === 'undefined') return new Date().getFullYear();
      if (typeof dateObj === 'number') return dateObj;
      if (dateObj && typeof dateObj.year === 'function') return dateObj.year();
      return new Date().getFullYear();
    };
    
    const startYearValue = getYearValue(startYear);
    const endYearValue = getYearValue(endYear);
    
    setYearValues({
      startYear: startYearValue,
      endYear: endYearValue,
      yearDiff: endYearValue - startYearValue
    });
  }, [startYear, endYear]);

  // Handle loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <ActivityIndicator size="large" color="#16A34A" />
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title={'Biomass'}/>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.titleRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="leaf" size={24} color="#16A34A" />
            </View>
            <Text style={styles.headerTitle}>Biomass Energy</Text>
          </View>
          
          {connectionStatus === 'disconnected' && (
            <View style={styles.connectionCard}>
              <View style={styles.connectionIndicator}>
                <View style={[styles.connectionDot, { backgroundColor: '#FF6B6B' }]} />
                <Text style={styles.connectionText}>Using demo data</Text>
              </View>
            </View>
          )}
          
          <Text style={styles.selectedRange}>
            Selected Range: {yearValues.startYear} - {yearValues.endYear} ({yearValues.yearDiff} years)
          </Text>
        </View>

        {/* Year Range Picker */}
        <View style={styles.pickerCard}>
          <YearRangePicker
            initialStartYear={yearValues.startYear}
            initialEndYear={yearValues.endYear}
            onStartYearChange={handleStartYearChange}
            onEndYearChange={handleEndYearChange}
            style={styles.yearPicker}
            primaryColor="#16A34A"
          />
        </View>

        {/* Power Generation Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Power Generation Trend</Text>
          <Text style={[styles.generationValue, { color: "#16A34A" }]}>
            {currentProjection ? currentProjection.toFixed(1) : '--'} GWh
          </Text>
          <Text style={styles.cardSubtitle}>
            Predictive Analysis Generation projection
          </Text>

          {/* Chart Component with ViewShot wrapper */}
          {generationData && generationData.length > 0 ? (
            <ViewShot ref={chartRef} options={{format: 'png', quality: 0.8}}>
              <SimpleChart
                data={generationData}
                width={width - 40}
                height={220}
              />
            </ViewShot>
          ) : (
            <View style={styles.noDataContainer}>
              <Ionicons name="analytics-outline" size={40} color="#CBD5E1" />
              <Text style={styles.noDataText}>No data available for selected years</Text>
            </View>
          )}
        </View>
        
        {/* Share/Download Buttons */}
        <View style={styles.actionButtonsContainer}>
          {/* PDF Download Button */}
          <TouchableOpacity
            style={[styles.pdfButton, pdfGenerating && styles.disabledButton]}
            onPress={handleDownloadPDF}
            activeOpacity={0.8}
            disabled={pdfGenerating}
          >
            {pdfGenerating ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="document-text-outline" size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>Download PDF</Text>
              </>
            )}
          </TouchableOpacity>
          
          {/* Share Button */}
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShareText}
            activeOpacity={0.8}
          >
            <Ionicons name="share-outline" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Share Summary</Text>
          </TouchableOpacity>
        </View>
        
        {/* Error message if present */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        {/* Data Source Information */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            <Ionicons name="information-circle-outline" size={14} /> Data Source
          </Text>
          <Text style={styles.infoText}>
            {yearValues.startYear > 2023 || yearValues.endYear > 2023 ? 
              "Historical data (2019-2023) used to project values for future years." :
              "Data from official energy generation records."
            }
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BiomassEnergy;