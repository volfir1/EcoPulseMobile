// src/store/createEnergyStore.js
import { create } from 'zustand';
import api from '../features/modules/components/api';
import { Platform, Share } from 'react-native';
import dayjs from 'dayjs';
import { 
  getEnergyConfig, 
  generateSynchronizedMockData, 
  calculateProjection,
  processApiResponse,
  generateSupplementaryData,
  DATA_LIMIT_YEAR 
} from './energyUtil';

/**
 * Factory function to create a Zustand store for each energy type
 * @param {string} energyType - Type of energy ('solar', 'wind', etc.)
 * @returns {Function} Zustand store with state and actions
 */
const createEnergyStore = (energyType) => {
  // Get the configuration for the specified energy type
  const config = getEnergyConfig(energyType);

  return create((set, get) => ({
    // State
    energyType,
    config,
    generationData: [],
    currentProjection: null,
    loading: true,
    error: null,
    connectionStatus: 'unknown', // 'connected', 'disconnected', 'unknown'
    selectedStartYear: dayjs().year(),
    selectedEndYear: dayjs().add(5, 'year').year(),
    chartRef: null,
    additionalData: {}, // For energy-type specific data
    
    // Set chart reference
    setChartRef: (ref) => set({ chartRef: ref }),
    
    // Handle year range changes
    handleStartYearChange: (year) => {
      set({ selectedStartYear: year });
      get().fetchData(year, get().selectedEndYear);
    },
    
    handleEndYearChange: (year) => {
      set({ selectedEndYear: year });
      get().fetchData(get().selectedStartYear, year);
    },
    
    // Fetch data from API
    fetchData: async (startYear, endYear) => {
      set({ loading: true, error: null });
      
      try {
        // Check if we need to use extrapolation for future years
        if (startYear > DATA_LIMIT_YEAR || endYear > DATA_LIMIT_YEAR) {
          console.log(`Using extrapolation for future years (beyond ${DATA_LIMIT_YEAR})`);
          
          // Generate synchronized mock data for consistent values
          const mockData = generateSynchronizedMockData(energyType, startYear, endYear);
          
          // Format mock data to match expected format
          const formattedData = mockData.map(item => ({
            date: item.Year,
            value: item['Predicted Production'],
            isPredicted: item.isPredicted
          }));
          
          // Calculate current projection
          const projection = calculateProjection(formattedData);
          
          // Get supplementary data specific to energy type
          const additionalData = generateSupplementaryData(energyType);
          
          // Update state with the data
          set({ 
            generationData: formattedData,
            currentProjection: projection,
            additionalData,
            loading: false,
            error: null,
            connectionStatus: 'connected'
          });
          
          return;
        }
        
        // Make actual API call for historical data
        const response = await api.get(`${config.endpoint}?start_year=${startYear}&end_year=${endYear}`);
        
        // Process API response to consistent format
        const formattedData = processApiResponse(response);
        
        // Calculate current projection
        const projection = calculateProjection(formattedData);
        
        // Extract supplementary data from response or generate fallback
        const supData = {};
        
        if (energyType === 'hydro') {
          supData.waterFlowData = response.data.water_flow || generateSupplementaryData(energyType).waterFlowData;
          supData.turbineEfficiency = response.data.efficiency || generateSupplementaryData(energyType).turbineEfficiency;
        } else if (energyType === 'solar') {
          supData.irradianceData = response.data.irradiance || generateSupplementaryData(energyType).irradianceData;
          supData.panelPerformance = response.data.performance || generateSupplementaryData(energyType).panelPerformance;
        } else if (energyType === 'wind') {
          supData.windSpeedData = response.data.wind_speed || generateSupplementaryData(energyType).windSpeedData;
          supData.turbinePerformance = response.data.turbine_data || generateSupplementaryData(energyType).turbinePerformance;
        } else if (energyType === 'biomass') {
          supData.feedstockData = response.data.feedstock || generateSupplementaryData(energyType).feedstockData;
          supData.efficiencyData = response.data.efficiency || generateSupplementaryData(energyType).efficiencyData;
        } else if (energyType === 'geothermal') {
          supData.temperatureData = response.data.temperature || generateSupplementaryData(energyType).temperatureData;
          supData.wellPerformance = response.data.wells || generateSupplementaryData(energyType).wellPerformance;
        }
        
        // Update state with new data
        set({ 
          generationData: formattedData,
          currentProjection: projection,
          additionalData: supData,
          loading: false,
          error: null,
          connectionStatus: 'connected'
        });
      } catch (error) {
        console.error(`Error fetching ${energyType} data:`, error);
        let errorMessage = 'Unable to connect to the server.';
        
        if (error.response) {
          // Server responded with an error status
          errorMessage += ` Server error: ${error.response.status}`;
        } else if (error.request) {
          // Request made but no response received
          errorMessage += ' No response from server.';
        } else if (error instanceof SyntaxError) {
          // JSON parsing error
          errorMessage += ' Invalid data format received.';
        } else {
          // Other errors
          errorMessage += ` ${error.message || ''}`;
        }
        
        // Generate fallback data with synchronized algorithm
        const mockData = generateSynchronizedMockData(energyType, startYear, endYear);
        
        // Format the mock data to match expected format
        const formattedData = mockData.map(item => ({
          date: item.Year,
          value: item['Predicted Production'],
          isPredicted: item.isPredicted
        }));
        
        // Get projection from mock data
        const mockProjection = calculateProjection(formattedData);
        
        // Get supplementary data specific to energy type
        const additionalData = generateSupplementaryData(energyType);
        
        // Update state with fallback data
        set({ 
          generationData: formattedData,
          currentProjection: mockProjection,
          additionalData,
          loading: false,
          error: errorMessage,
          connectionStatus: 'disconnected'
        });
      }
    },
    
    // Initialize data - call this when component mounts
    initialize: () => {
      const { selectedStartYear, selectedEndYear, fetchData } = get();
      fetchData(selectedStartYear, selectedEndYear);
    },
    
    // Retry fetch after connection error
    retryFetch: () => {
      const { selectedStartYear, selectedEndYear, fetchData } = get();
      fetchData(selectedStartYear, selectedEndYear);
    },
    
    // Share data (mobile equivalent of download)
    handleDownload: async () => {
      const { 
        generationData, 
        selectedStartYear, 
        selectedEndYear, 
        currentProjection,
        config,
        energyType
      } = get();
      
      try {
        // Format the data as text for sharing
        const dataText = generationData.map(item => 
          `Year: ${item.date}, Production: ${item.value.toFixed(2)} GWh${item.isPredicted ? ' (Projected)' : ''}`
        ).join('\n');
        
        const shareText = 
          `${energyType.charAt(0).toUpperCase() + energyType.slice(1)} Energy Analysis\n` +
          `Year Range: ${selectedStartYear} - ${selectedEndYear}\n` +
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
    }
  }));
};

export default createEnergyStore;