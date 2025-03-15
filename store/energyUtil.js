/**
 * Unified Energy Data Utilities
 * 
 * This module provides standardized functions for energy data generation
 * and processing to ensure consistency between web and mobile platforms.
 */

// Energy type configurations - SHARED CONSTANTS
export const ENERGY_CONFIG = {
  solar: {
    primaryColor: '#FFB800',
    secondaryColor: '#FFCD49',
    baseValue: 3200,      // Base value for solar in GWh
    growthRate: 0.15,     // 15% annual growth
    volatility: 0.05,     // 5% random variation
    fileName: 'Solar_Power_Generation_Summary',
    endpoint: '/api/predictions/solar/',
    title: 'Solar Power Generation',
    icon: 'sunny'
  },
  hydro: {
    primaryColor: '#2E90E5',
    secondaryColor: '#4FA2EA',
    baseValue: 3800,
    growthRate: 0.06,     // 6% annual growth
    volatility: 0.07,     // 7% random variation
    fileName: 'Hydro_Power_Generation_Summary',
    endpoint: '/api/predictions/hydro/',
    title: 'Hydropower Generation',
    icon: 'water'
  },
  wind: {
    primaryColor: '#64748B',
    secondaryColor: '#94A3B8',
    baseValue: 2900,
    growthRate: 0.12,     // 12% annual growth
    volatility: 0.09,     // 9% random variation
    fileName: 'Wind_Power_Generation_Summary',
    endpoint: '/api/predictions/wind/',
    title: 'Wind Power Generation',
    icon: 'air'
  },
  biomass: {
    primaryColor: '#16A34A',
    secondaryColor: '#22C55E',
    baseValue: 2200,
    growthRate: 0.08,     // 8% annual growth
    volatility: 0.04,     // 4% random variation
    fileName: 'Biomass_Power_Generation_Summary',
    endpoint: '/api/predictions/biomass/',
    title: 'Biomass Generation',
    icon: 'leaf'
  },
  geothermal: {
    primaryColor: '#FF6B6B',
    secondaryColor: '#FF9E9E',
    baseValue: 2500,
    growthRate: 0.09,     // 9% annual growth
    volatility: 0.03,     // 3% random variation
    fileName: 'Geothermal_Power_Generation_Summary',
    endpoint: '/api/predictions/geothermal/',
    title: 'Geothermal Generation',
    icon: 'flame'
  }
};

// Reference year for all calculations
export const REFERENCE_YEAR = 2024;
export const DATA_LIMIT_YEAR = 2023;

/**
 * Get configuration for a specific energy type
 * @param {string} energyType - Energy type ('solar', 'hydro', etc.)
 * @returns {object} Configuration object for the energy type
 */
export const getEnergyConfig = (energyType) => {
  return ENERGY_CONFIG[energyType] || ENERGY_CONFIG.solar;
};

/**
 * Generate synchronized mock data for prediction with deterministic randomness
 * @param {string} energyType - Energy type ('solar', 'hydro', etc.)
 * @param {number} startYear - Start year for data
 * @param {number} endYear - End year for data
 * @returns {Array} Array of prediction data points
 */
export const generateSynchronizedMockData = (energyType = 'solar', startYear, endYear) => {
  const config = getEnergyConfig(energyType);
  const data = [];
  
  // Ensure we have valid year values
  const start = parseInt(startYear, 10);
  const end = parseInt(endYear, 10);
  
  // Deterministic random function
  const seedRandom = (year, type) => {
    // Use a simple hash of the energyType as part of the seed
    const typeHash = type.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seed = year * 1000 + typeHash;
    return ((Math.sin(seed) + 1) / 2); // Returns a value between 0-1
  };
  
  for (let year = start; year <= end; year++) {
    const yearDiff = year - REFERENCE_YEAR;
    
    // Calculate value using compound growth formula
    // baseValue * (1 + growthRate)^yearDiff
    let value = config.baseValue * Math.pow(1 + config.growthRate, yearDiff);
    
    // Add deterministic variation based on year and energy type
    const randomFactor = seedRandom(year, energyType);
    const variation = (randomFactor * 2 - 1) * (value * config.volatility);
    
    value += variation;
    
    // Round to 1 decimal place for consistency
    value = parseFloat(value.toFixed(1));
    
    // Add data point in the format expected by API
    data.push({
      Year: year,
      'Predicted Production': value,
      isPredicted: year > DATA_LIMIT_YEAR
    });
  }
  
  return data;
};

/**
 * Process API response data into a consistent format
 * @param {object} response - API response data
 * @returns {Array} Formatted data array for UI
 */
export const processApiResponse = (response) => {
  if (!response || !response.data || !response.data.predictions) {
    return [];
  }
  
  // Format the API data consistently
  return response.data.predictions.map(item => ({
    date: typeof item.Year === 'number' ? item.Year : parseInt(item.Year, 10),
    value: parseFloat(parseFloat(item['Predicted Production']).toFixed(1)),
    isPredicted: item.isPredicted || false
  }));
};

/**
 * Calculate the projection value (last year in data)
 * @param {Array} data - Data array with date and value properties
 * @returns {number|null} Projection value or null if no data
 */
export const calculateProjection = (data) => {
  if (!data || data.length === 0) return null;
  
  // Sort by date/year to ensure we get the last element
  const sortedData = [...data].sort((a, b) => {
    // Handle both formats (date or Year)
    const yearA = a.date || a.Year;
    const yearB = b.date || b.Year;
    return yearA - yearB;
  });
  
  // Get value from the last data point
  const lastDataPoint = sortedData[sortedData.length - 1];
  return lastDataPoint.value || lastDataPoint['Predicted Production'];
};

/**
 * Format a value for display with consistent precision
 * @param {number} value - Number to format
 * @param {string} unit - Optional unit (e.g., 'GWh')
 * @param {number} precision - Decimal places (default: 1)
 * @returns {string} Formatted value string
 */
export const formatValue = (value, unit = '', precision = 1) => {
  if (value === undefined || value === null) return '-';
  
  const formattedValue = parseFloat(value).toFixed(precision);
  return unit ? `${formattedValue} ${unit}` : formattedValue;
};

/**
 * Get chart visualization configurations
 * @param {string} energyType - Energy type
 * @returns {object} Chart configuration object
 */
export const getChartConfig = (energyType = 'solar') => {
  const config = getEnergyConfig(energyType);
  
  return {
    area: {
      type: "monotone",
      dataKey: "value",
      stroke: config.primaryColor,
      fill: `url(#${energyType}Gradient)`,
      strokeWidth: 2,
    },
    gradient: {
      stops: [
        { offset: "5%", color: config.primaryColor, opacity: 0.2 },
        { offset: "95%", color: config.primaryColor, opacity: 0 },
      ],
    },
    tooltip: {
      formatter: (value) => formatValue(value, 'GWh'),
      labelFormatter: (label) => `Year: ${label}`,
    },
    line: {
      stroke: config.primaryColor,
      strokeWidth: 2,
      dot: {
        r: 5,
        fill: config.primaryColor,
        stroke: '#fff',
        strokeWidth: 2
      },
      activeDot: {
        r: 7,
        fill: config.primaryColor,
        stroke: '#fff',
        strokeWidth: 2
      }
    },
    xAxis: {
      tickLine: false,
      axisLine: false,
      tick: { fill: "#64748B" }
    },
    yAxis: {
      tickLine: false,
      axisLine: false,
      tick: { fill: "#64748B" },
      width: 80,
      label: {
        value: 'Generation (GWh)',
        angle: -90,
        position: 'insideLeft',
        style: { textAnchor: 'middle' },
        offset: -5
      }
    }
  };
};

/**
 * Get consistent grid configuration for charts
 * @returns {object} Grid configuration
 */
export const getGridConfig = () => {
  return {
    cartesianGrid: {
      stroke: "#E2E8F0",
      strokeDasharray: "3 3",
      vertical: false,
    }
  };
};

// Generate mock data for supplementary metrics based on energy type
export const generateSupplementaryData = (energyType) => {
  switch(energyType) {
    case 'solar':
      return {
        irradianceData: getSolarIrradianceData(),
        panelPerformance: getPanelPerformance()
      };
    case 'hydro':
      return {
        waterFlowData: getWaterFlowData(),
        turbineEfficiency: getTurbineEfficiency()
      };
    case 'wind':
      return {
        windSpeedData: getWindSpeedData(),
        turbinePerformance: getTurbinePerformance()
      };
    case 'biomass':
      return {
        feedstockData: getFeedstockData(),
        efficiencyData: getEfficiencyData()
      };
    case 'geothermal':
      return {
        temperatureData: getTemperatureData(),
        wellPerformance: getWellPerformance()
      };
    default:
      return {};
  }
};

// Mock data generator functions
export const getSolarIrradianceData = () => Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  irradiance: 800 + Math.sin(i * 0.8) * 200 + Math.random() * 100,
  power: 4200 + Math.sin(i * 0.8) * 800 + Math.random() * 400
}));

export const getPanelPerformance = () => Array.from({ length: 6 }, (_, i) => ({
  array: `Array ${i + 1}`,
  efficiency: 95 + Math.sin(i * 0.5) * 3 + Math.random() * 2,
  output: 2500 + Math.sin(i * 0.5) * 300 + Math.random() * 200
}));

export const getWaterFlowData = () => Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  flow: 4200 + Math.sin(i * 0.8) * 800 + Math.random() * 400,
  generation: 3800 + Math.sin(i * 0.8) * 600 + Math.random() * 300
}));

export const getTurbineEfficiency = () => Array.from({ length: 8 }, (_, i) => ({
  turbine: `T${i + 1}`,
  efficiency: 85 + Math.sin(i * 0.5) * 10 + Math.random() * 5,
  output: 2800 + Math.sin(i * 0.7) * 400 + Math.random() * 200
}));

export const getWindSpeedData = () => Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  speed: 15 + Math.sin(i * 0.8) * 5 + Math.random() * 3,
  power: 3500 + Math.sin(i * 0.8) * 800 + Math.random() * 500
}));

export const getTurbinePerformance = () => Array.from({ length: 6 }, (_, i) => ({
  turbine: `Turbine ${i + 1}`,
  efficiency: 92 + Math.sin(i * 0.7) * 5 + Math.random() * 3,
  output: 2200 + Math.sin(i * 0.6) * 400 + Math.random() * 200
}));

export const getFeedstockData = () => Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  agricultural: 2800 + Math.sin(i * 0.8) * 500 + Math.random() * 300,
  forestry: 2200 + Math.cos(i * 0.8) * 400 + Math.random() * 250
}));

export const getEfficiencyData = () => Array.from({ length: 6 }, (_, i) => ({
  source: ['Wood', 'Crop', 'Waste', 'Biogas', 'Pellets', 'Other'][i],
  efficiency: 75 + Math.sin(i * 0.7) * 15 + Math.random() * 10,
  output: 2400 + Math.sin(i * 0.6) * 500 + Math.random() * 300
}));

export const getTemperatureData = () => Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  temperature: 220 + Math.sin(i * 0.3) * 30 + Math.random() * 15,
  output: 3200 + Math.sin(i * 0.3) * 500 + Math.random() * 250
}));

export const getWellPerformance = () => Array.from({ length: 5 }, (_, i) => ({
  well: `Well ${i + 1}`,
  temperature: 240 + Math.sin(i * 0.6) * 40 + Math.random() * 20,
  pressure: 85 + Math.sin(i * 0.4) * 10 + Math.random() * 5,
  output: 2600 + Math.sin(i * 0.5) * 400 + Math.random() * 300
}));

export default {
  ENERGY_CONFIG,
  REFERENCE_YEAR,
  DATA_LIMIT_YEAR,
  getEnergyConfig,
  generateSynchronizedMockData,
  processApiResponse,
  calculateProjection,
  formatValue,
  getChartConfig,
  getGridConfig,
  generateSupplementaryData,
  getSolarIrradianceData,
  getPanelPerformance,
  getWaterFlowData,
  getTurbineEfficiency,
  getWindSpeedData,
  getTurbinePerformance,
  getFeedstockData,
  getEfficiencyData,
  getTemperatureData,
  getWellPerformance
};