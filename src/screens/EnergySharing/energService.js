import api from "../../features/modules/components/api";

// Mock data for fallback
const generateMockData = (year) => {
  const regions = ["Bohol", "Cebu", "Negros", "Panay", "Leyte-Samar"];
  const energyTypes = [
    "Total Power Generation (GWh)",
    "Estimated Consumption (GWh)",
    "Solar (GWh)",
    "Wind (GWh)",
    "Hydro (GWh)",
    "Geothermal (GWh)",
    "Biomass (GWh)"
  ];

  return {
    predictions: regions.flatMap(place => 
      energyTypes.map(type => ({
        Place: place,
        Year: year,
        "Energy Type": type,
        "Predicted Value": type.includes("Consumption") 
          ? 2000 + Math.random() * 1000
          : type === "Total Power Generation (GWh)"
          ? 2500 + Math.random() * 1500
          : 300 + Math.random() * 700
      }))
    )
  };
};

const energyService = {
  // Get peer-to-peer energy sharing data
  getPeerToPeerData: async (year) => {
    try {
      console.log(`Attempting to fetch peer-to-peer data for year: ${year}`);
      const response = await api.get(`/api/peertopeer/?year=${year}`);
      console.log('API request successful');
      return response.data;
    } catch (error) {
      // Provide more detailed error logging
      const errorMessage = error.response 
        ? `API error: ${error.response.status} - ${error.response.statusText}`
        : `Network error: ${error.message}`;
      
      console.log(`Falling back to mock data: ${errorMessage}`);
      
      // Return mock data as fallback
      return generateMockData(year);
    }
  },

  // Get summary statistics
  getEnergySummary: async (year) => {
    try {
      console.log(`Attempting to fetch energy summary for year: ${year}`);
      const response = await api.get(`/api/energy-summary?year=${year}`);
      console.log('Energy summary request successful');
      return response.data;
    } catch (error) {
      // Provide more detailed error logging
      const errorMessage = error.response 
        ? `API error: ${error.response.status} - ${error.response.statusText}`
        : `Network error: ${error.message}`;
      
      console.error(`Error fetching energy summary: ${errorMessage}`);
      throw error;
    }
  }
};

export default energyService;