import { useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import api from '../api';

export const useGeoAnalytics = () => {
  const [generationData, setGenerationData] = useState([]);
  const [currentProjection, setCurrentProjection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStartYear, setSelectedStartYear] = useState(new Date().getFullYear());
  const [selectedEndYear, setSelectedEndYear] = useState(new Date().getFullYear() + 1);

  useEffect(() => {
    fetchData(selectedStartYear, selectedEndYear);
  }, [selectedStartYear, selectedEndYear]);

  const fetchData = (startYear, endYear) => {
    setLoading(true);
    api.get(`/api/predictions/geo/?start_year=${startYear}&end_year=${endYear}`)
      .then(response => {
        const data = response.data.predictions;
        const formattedData = data.map(item => ({
          date: item.Year,
          value: item['Predicted Production']
        }));

        setGenerationData(formattedData);
        if (formattedData.length > 0) {
          setCurrentProjection(formattedData[formattedData.length - 1].value);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        const mockData = generateMockData(startYear, endYear);
        setGenerationData(mockData);
        setCurrentProjection(mockData[mockData.length - 1].value);

        if (__DEV__) {
          Alert.alert(
            "API Error",
            "Using mock data instead. Check your API connection.",
            [{ text: "OK" }]
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleStartYearChange = (year) => setSelectedStartYear(year);
  const handleEndYearChange = (year) => setSelectedEndYear(year);

  const handleDownload = async () => {
    Alert.alert(
      "Feature Not Available",
      "Download functionality is not available in the mobile app version.",
      [{ text: "OK" }]
    );
  };

  const generateMockData = (startYear, endYear) => {
    const data = [];
    const baseValue = 2500;
    const yearSpan = endYear - startYear;
    
    for (let i = 0; i <= yearSpan; i++) {
      const year = startYear + i;
      const value = baseValue + (i * 200) + (Math.random() * 600);
      
      data.push({
        date: `${year}`,
        value: parseFloat(value.toFixed(1))
      });
    }
    
    return data;
  };

  const geoHeatFlowData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    heatFlow: 300 + Math.sin(i * 0.8) * 100 + Math.random() * 50,
    power: 5000 + Math.sin(i * 0.8) * 700 + Math.random() * 500
  }));

  const plantPerformance = Array.from({ length: 6 }, (_, i) => ({
    plant: `Plant ${i + 1}`,
    efficiency: 85 + Math.sin(i * 0.5) * 5 + Math.random() * 3,
    output: 3000 + Math.sin(i * 0.5) * 400 + Math.random() * 300
  }));

  return {
    generationData,
    currentProjection,
    loading,
    selectedStartYear,
    selectedEndYear,
    handleStartYearChange,
    handleEndYearChange,
    handleDownload,
    geoHeatFlowData,
    plantPerformance
  };
};

export default useGeoAnalytics;
