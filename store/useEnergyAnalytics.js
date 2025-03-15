// src/store/useEnergyAnalytics.js
import { useEffect, useRef, useState } from 'react';
import { Share, Platform, Alert } from 'react-native';
import dayjs from 'dayjs';
import api from '../src/features/modules/components/api';

// Import our utilities
import { generateSynchronizedMockData, calculateProjection, getEnergyConfig, DATA_LIMIT_YEAR } from './energyUtil';

// Import PDF utilities - Make sure these paths match your project structure!
// Adjust these imports based on where you placed the files
import mobilePdfGenerator from '../utils/mobilePdfGenerator';
import { captureChartAsBase64 } from '../utils/captureChartImage';

/**
 * Custom hook for energy data analytics with PDF support
 * @param {string} energyType - Type of energy ('solar', 'wind', etc.)
 * @returns {object} State and methods for handling energy data
 */
const useEnergyAnalytics = (energyType = 'solar') => {
  // Get energy type config
  const config = getEnergyConfig(energyType);
  
  // State for chart data
  const [generationData, setGenerationData] = useState([]);
  const [currentProjection, setCurrentProjection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('unknown');
  const [additionalData, setAdditionalData] = useState({});
  const [pdfGenerating, setPdfGenerating] = useState(false);
  
  // Chart reference
  const chartRef = useRef(null);
  
  // Year state with dayjs for compatibility with UI
  const [startYear, setStartYear] = useState(dayjs().year(new Date().getFullYear()));
  const [endYear, setEndYear] = useState(dayjs().year(new Date().getFullYear() + 5));
  
  // Generate supplementary data based on energy type
  const getSupplementaryData = (type) => {
    switch(type) {
      case 'solar':
        return {
          irradianceData: getSolarIrradianceData(),
          panelPerformance: getPanelPerformance()
        };
      case 'wind':
        return {
          windSpeedData: getWindSpeedData(),
          turbinePerformance: getTurbinePerformance()
        };
      case 'hydro':
        return {
          waterFlowData: getWaterFlowData(),
          turbineEfficiency: getTurbineEfficiency()
        };
      // Add other energy types as needed
      default:
        return {};
    }
  };

  // Mock data generators - kept for fallback only
  const getSolarIrradianceData = () => Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    irradiance: 800 + Math.sin(i * 0.8) * 200 + Math.random() * 100,
    power: 4200 + Math.sin(i * 0.8) * 800 + Math.random() * 400
  }));
  
  const getPanelPerformance = () => Array.from({ length: 6 }, (_, i) => ({
    array: `Array ${i + 1}`,
    efficiency: 95 + Math.sin(i * 0.5) * 3 + Math.random() * 2,
    output: 2500 + Math.sin(i * 0.5) * 300 + Math.random() * 200
  }));
  
  const getWindSpeedData = () => Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    speed: 15 + Math.sin(i * 0.8) * 5 + Math.random() * 3,
    power: 3500 + Math.sin(i * 0.8) * 800 + Math.random() * 500
  }));
  
  const getTurbinePerformance = () => Array.from({ length: 6 }, (_, i) => ({
    turbine: `Turbine ${i + 1}`,
    efficiency: 92 + Math.sin(i * 0.7) * 5 + Math.random() * 3,
    output: 2200 + Math.sin(i * 0.6) * 400 + Math.random() * 200
  }));
  
  const getWaterFlowData = () => Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    flow: 4200 + Math.sin(i * 0.8) * 800 + Math.random() * 400,
    generation: 3800 + Math.sin(i * 0.8) * 600 + Math.random() * 300
  }));
  
  const getTurbineEfficiency = () => Array.from({ length: 8 }, (_, i) => ({
    turbine: `T${i + 1}`,
    efficiency: 85 + Math.sin(i * 0.5) * 10 + Math.random() * 5,
    output: 2800 + Math.sin(i * 0.7) * 400 + Math.random() * 200
  }));

  // Helper to transform API data into UI-friendly format
  const processApiData = (data) => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => ({
      date: typeof item.Year === 'number' ? item.Year : parseInt(item.Year, 10),
      value: parseFloat(parseFloat(item['Predicted Production']).toFixed(1)),
      isPredicted: item.isPredicted || false
    }));
  };
  
  // Fetch data when years change
  const fetchEnergyData = async (start, end) => {
    setLoading(true);
    setError(null);
    
    try {
      const startYearInt = parseInt(start, 10);
      const endYearInt = parseInt(end, 10);
      
      console.log(`Fetching ${energyType} data for ${startYearInt}-${endYearInt}`);

      // ALWAYS try to load real data first - regardless of year range
      try {
        // Use correct API endpoint format
        const endpoint = energyType === undefined ? 'solar' : energyType.toLowerCase();
        const apiUrl = `/api/predictions/${endpoint}/?start_year=${startYearInt}&end_year=${endYearInt}`;
        
        console.log(`Making API request to: ${apiUrl}`);
        const response = await api.get(apiUrl);
        
        console.log(`API response status: ${response.status}`);
        
        // Make sure we have valid data
        if (response.data && response.data.predictions) {
          console.log(`Found ${response.data.predictions.length} predictions in API response`);
          
          // Process the API data
          const formattedData = processApiData(response.data.predictions);
          
          if (formattedData.length > 0) {
            console.log(`Successfully formatted ${formattedData.length} data points`);
            
            // Set the formatted data
            setGenerationData(formattedData);
            
            // Calculate projection from last data point
            const lastItem = formattedData[formattedData.length - 1];
            setCurrentProjection(lastItem.value);
            
            // Set supplementary data
            setAdditionalData(getSupplementaryData(energyType));
            
            setConnectionStatus('connected');
            setLoading(false);
            return; // Exit early - we got real data successfully
          }
        } else {
          console.log('API response missing predictions array');
          throw new Error('API response missing predictions array');
        }
      } catch (apiError) {
        console.log(`API request failed: ${apiError.message}`);
        
        // Only fall back to mock data if the real data request failed
        // or if we're explicitly requesting future data
        if (startYearInt > DATA_LIMIT_YEAR || endYearInt > DATA_LIMIT_YEAR) {
          console.log(`Using mock data for future years (beyond ${DATA_LIMIT_YEAR})`);
        } else {
          console.log('Falling back to mock data due to API error');
        }
        
        throw apiError; // Rethrow to be caught by the outer catch
      }
    } catch (error) {
      console.log(`Using mock data due to: ${error.message}`);
      
      // Generate mock data as fallback
      const startYearInt = parseInt(start, 10);
      const endYearInt = parseInt(end, 10);
      
      const mockData = generateSynchronizedMockData(energyType, startYearInt, endYearInt);
      
      const formattedData = mockData.map(item => ({
        date: item.Year,
        value: item['Predicted Production'],
        isPredicted: item.isPredicted || startYearInt > DATA_LIMIT_YEAR
      }));
      
      setGenerationData(formattedData);
      
      // Set current projection from last data point
      const lastItem = formattedData[formattedData.length - 1];
      setCurrentProjection(lastItem.value);
      
      setAdditionalData(getSupplementaryData(energyType));
      
      setError(`Using demo data: ${error.message}`);
      setConnectionStatus('disconnected');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle year changes
  const handleStartYearChange = (year) => {
    const yearValue = parseInt(year, 10);
    console.log(`Setting start year to: ${yearValue}`);
    
    const newStartYear = dayjs().year(yearValue);
    setStartYear(newStartYear);
    
    // Get end year value 
    const endYearValue = typeof endYear === 'object' && typeof endYear.year === 'function' 
      ? endYear.year() 
      : (typeof endYear === 'number' ? endYear : new Date().getFullYear() + 5);
    
    if (endYearValue < yearValue) {
      const newEndYear = dayjs().year(yearValue);
      setEndYear(newEndYear);
      fetchEnergyData(yearValue, yearValue);
    } else {
      fetchEnergyData(yearValue, endYearValue);
    }
  };
  
  const handleEndYearChange = (year) => {
    const yearValue = parseInt(year, 10);
    console.log(`Setting end year to: ${yearValue}`);
    
    const newEndYear = dayjs().year(yearValue);
    setEndYear(newEndYear);
    
    // Get start year value
    const startYearValue = typeof startYear === 'object' && typeof startYear.year === 'function'
      ? startYear.year()
      : (typeof startYear === 'number' ? startYear : new Date().getFullYear());
    
    if (startYearValue > yearValue) {
      const newStartYear = dayjs().year(yearValue);
      setStartYear(newStartYear);
      fetchEnergyData(yearValue, yearValue);
    } else {
      fetchEnergyData(startYearValue, yearValue);
    }
  };
  
  // Refresh data
  const handleRefresh = () => {
    const startYearValue = typeof startYear === 'object' && typeof startYear.year === 'function'
      ? startYear.year()
      : (typeof startYear === 'number' ? startYear : new Date().getFullYear());
    
    const endYearValue = typeof endYear === 'object' && typeof endYear.year === 'function'
      ? endYear.year()
      : (typeof endYear === 'number' ? endYear : new Date().getFullYear() + 5);
    
    fetchEnergyData(startYearValue, endYearValue);
  };
  
  // Initial data load
  useEffect(() => {
    const startYearValue = typeof startYear === 'object' && typeof startYear.year === 'function'
      ? startYear.year()
      : (typeof startYear === 'number' ? startYear : new Date().getFullYear());
    
    const endYearValue = typeof endYear === 'object' && typeof endYear.year === 'function'
      ? endYear.year()
      : (typeof endYear === 'number' ? endYear : new Date().getFullYear() + 5);
    
    fetchEnergyData(startYearValue, endYearValue);
  }, [energyType]);
  
  // Download/Share as PDF function
  const handleDownloadPDF = async () => {
    try {
      setPdfGenerating(true);
      
      // If we have a chart reference, capture it as an image
      let chartImageBase64 = null;
      if (chartRef && chartRef.current) {
        console.log('Attempting to capture chart image');
        try {
          chartImageBase64 = await captureChartAsBase64(chartRef);
          if (chartImageBase64) {
            console.log('Chart image captured successfully');
          }
        } catch (imageError) {
          console.error('Failed to capture chart image:', imageError);
          // Continue without the chart image
        }
      }
      
      const startYearValue = typeof startYear === 'object' && typeof startYear.year === 'function'
        ? startYear.year()
        : (typeof startYear === 'number' ? startYear : new Date().getFullYear());
      
      const endYearValue = typeof endYear === 'object' && typeof endYear.year === 'function'
        ? endYear.year()
        : (typeof endYear === 'number' ? endYear : new Date().getFullYear() + 5);
      
      // Generate and share the PDF
      const result = await mobilePdfGenerator.generateAndSharePDF({
        energyType,
        data: generationData,
        startYear: startYearValue,
        endYear: endYearValue,
        currentProjection,
        config,
        chartImageBase64
      });
      
      if (result.success) {
        if (!result.shared) {
          // If sharing wasn't available but PDF was generated
          Alert.alert(
            'PDF Generated',
            `PDF saved to ${result.uri}`,
            [{ text: 'OK' }]
          );
        }
        return { success: true };
      } else {
        throw new Error(result.error || 'Failed to generate PDF');
      }
    } catch (error) {
      console.error('PDF error:', error);
      Alert.alert(
        'PDF Generation Failed',
        error.message || 'Failed to generate PDF',
        [{ text: 'OK' }]
      );
      return { success: false, error };
    } finally {
      setPdfGenerating(false);
    }
  };
  
  // Legacy text-based Share function
  const handleShareText = async () => {
    try {
      // Format the data as text for sharing
      const dataText = generationData.map(item => 
        `Year: ${item.date}, Production: ${item.value.toFixed(2)} GWh${item.isPredicted ? ' (Projected)' : ''}`
      ).join('\n');
      
      const startYearValue = typeof startYear === 'object' && typeof startYear.year === 'function'
        ? startYear.year()
        : (typeof startYear === 'number' ? startYear : new Date().getFullYear());
      
      const endYearValue = typeof endYear === 'object' && typeof endYear.year === 'function'
        ? endYear.year()
        : (typeof endYear === 'number' ? endYear : new Date().getFullYear() + 5);
      
      const shareText = 
        `${energyType.charAt(0).toUpperCase() + energyType.slice(1)} Energy Analysis\n` +
        `Year Range: ${startYearValue} - ${endYearValue}\n` +
        `Current Projection: ${currentProjection ? currentProjection.toFixed(2) : 'N/A'} GWh\n\n` +
        `Data:\n${dataText}`;
      
      // Share the data
      await Share.share({
        title: config.fileName,
        message: shareText
      });
      
      return { success: true };
    } catch (error) {
      console.error('Share error:', error);
      return { success: false, error };
    }
  };
  
  // Combined download function (uses PDF if available, falls back to text)
  const handleDownload = async () => {
    // Try PDF first
    try {
      return await handleDownloadPDF();
    } catch (pdfError) {
      console.error('PDF failed, falling back to text share:', pdfError);
      // Fall back to text-based sharing
      return await handleShareText();
    }
  };
  
  return {
    generationData,
    currentProjection,
    loading,
    error,
    connectionStatus,
    startYear,
    endYear,
    handleStartYearChange,
    handleEndYearChange,
    handleRefresh,
    handleDownload,
    handleDownloadPDF,
    handleShareText,
    pdfGenerating,
    chartRef,
    config,
    additionalData
  };
};

export default useEnergyAnalytics;