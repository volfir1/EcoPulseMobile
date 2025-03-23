import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base API URL - replace with your actual API endpoint
const API_BASE_URL = 'http://192.168.1.2:5000/api';

// Energy type definitions with their properties
const energyTypes = [
  { type: 'solar', color: '#FF9800', name: 'Solar', endpoint: '/api/predictions/solar/' },
  { type: 'hydro', color: '#2196F3', name: 'Hydro', endpoint: '/api/predictions/hydro/' },
  { type: 'wind', color: '#64748B', name: 'Wind', endpoint: '/api/predictions/wind/' },
  { type: 'geo', color: '#F44336', name: 'Geothermal', endpoint: '/api/predictions/geothermal/' },
  { type: 'biomass', color: '#4CAF50', name: 'Biomass', endpoint: '/api/predictions/biomass/' }
];

/**
 * Hook for fetching and managing energy data 
 * @param {number} defaultYear - Default selected year for projections
 * @returns {Object} - Energy data state and functions
 */
export const useEnergyData = (defaultYear = 2030) => {
  const [energyData, setEnergyData] = useState({});
  const [loading, setLoading] = useState(true);
  const [totalProjection, setTotalProjection] = useState(0);
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [apiErrors, setApiErrors] = useState([]);
  const [usingMockData, setUsingMockData] = useState(false);

  // Generate mock data when needed
  const generateMockData = useCallback((startYear, endYear, baseValue, growth) => {
    const data = [];
    for (let year = startYear; year <= endYear; year++) {
      // Add some randomness to the data to make it more realistic
      const randomFactor = 0.85 + (Math.random() * 0.3); // Between 0.85 and 1.15
      const value = baseValue * Math.pow((1 + growth), (year - startYear)) * randomFactor;
      data.push({
        date: year,
        value: parseFloat(value.toFixed(1))
      });
    }
    return data;
  }, []);

  // Mock data configuration for different energy types
  const mockDataConfig = {
    solar: { baseValue: 25, growth: 0.15 },
    wind: { baseValue: 18, growth: 0.12 },
    hydro: { baseValue: 30, growth: 0.03 },
    geo: { baseValue: 12, growth: 0.08 },
    biomass: { baseValue: 8, growth: 0.06 }
  };

  // Fetch energy data from API
  const fetchEnergyData = useCallback(async () => {
    setLoading(true);
    setApiErrors([]);
    
    try {
      // Try to get cached data first
      const cachedData = await AsyncStorage.getItem('energy_data_cache');
      const cacheTimestamp = await AsyncStorage.getItem('energy_data_timestamp');
      
      // Use cache if it's less than 6 hours old
      if (cachedData && cacheTimestamp) {
        const now = new Date().getTime();
        if (now - parseInt(cacheTimestamp) < 6 * 60 * 60 * 1000) {
          const parsedData = JSON.parse(cachedData);
          setEnergyData(parsedData);
          calculateTotalProjection(parsedData, selectedYear);
          setLoading(false);
          return;
        }
      }
      
      // Proceed with API fetch if cache is invalid
      const data = {};
      let errors = [];
      let usedMockData = false;
      
      // Create axios instance with timeout
      const api = axios.create({
        baseURL: API_BASE_URL,
        timeout: 10000 // 10 second timeout
      });
      
      // Fetch data for each energy type
      for (const { type, endpoint } of energyTypes) {
        try {
          // Try to fetch real data
          const response = await api.get(endpoint, {
            params: { 
              start_year: 2025, 
              end_year: 2030
            }
          });
          
          // Check if response has the expected structure
          if (response.data && response.data.predictions) {
            // Format API data
            const predictions = response.data.predictions;
            
            // Convert the data to the format needed for charts
            const generationData = predictions.map(item => ({
              date: Number(item.Year),
              value: Math.abs(Number(item['Predicted Production']))
            }));
            
            // Get current projection for selected year
            const selectedYearData = predictions.find(p => Number(p.Year) === selectedYear);
            const selectedProjection = selectedYearData 
              ? Math.abs(Number(selectedYearData['Predicted Production'])) 
              : predictions[predictions.length - 1] 
                ? Math.abs(Number(predictions[predictions.length - 1]['Predicted Production']))
                : 0;
            
            // Create yearlyData mapping
            const yearlyData = predictions.reduce((acc, item) => {
              acc[Number(item.Year)] = Math.abs(Number(item['Predicted Production']));
              return acc;
            }, {});
            
            // Store data
            data[type] = {
              generationData,
              currentProjection: selectedProjection,
              yearlyData
            };
          } else {
            throw new Error(`Invalid data structure from ${type} API`);
          }
        } catch (error) {
          console.error(`Error fetching ${type} data:`, error);
          errors.push(type);
          usedMockData = true;
          
          // Fall back to mock data
          const config = mockDataConfig[type];
          const mockData = generateMockData(2025, 2030, config.baseValue, config.growth);
          
          const latestProjection = mockData.find(item => item.date === selectedYear)?.value || 
                                mockData[mockData.length - 1]?.value || 0;
          
          // Store fallback data
          data[type] = {
            generationData: mockData,
            currentProjection: latestProjection,
            yearlyData: mockData.reduce((acc, item) => {
              acc[item.date] = item.value;
              return acc;
            }, {})
          };
        }
      }
      
      // Update state with fetched/generated data
      setEnergyData(data);
      calculateTotalProjection(data, selectedYear);
      setApiErrors(errors);
      setUsingMockData(usedMockData);
      
      // Cache the data
      await AsyncStorage.setItem('energy_data_cache', JSON.stringify(data));
      await AsyncStorage.setItem('energy_data_timestamp', Date.now().toString());
      
    } catch (error) {
      console.error('Error in fetchEnergyData:', error);
      setUsingMockData(true);
      
      // If all fails, generate mock data for all energy types
      const data = {};
      
      for (const { type } of energyTypes) {
        const config = mockDataConfig[type];
        const mockData = generateMockData(2025, 2030, config.baseValue, config.growth);
        
        const latestProjection = mockData.find(item => item.date === selectedYear)?.value || 
                                mockData[mockData.length - 1]?.value || 0;
        
        data[type] = {
          generationData: mockData,
          currentProjection: latestProjection,
          yearlyData: mockData.reduce((acc, item) => {
            acc[item.date] = item.value;
            return acc;
          }, {})
        };
      }
      
      setEnergyData(data);
      calculateTotalProjection(data, selectedYear);
    } finally {
      setLoading(false);
    }
  }, [selectedYear, generateMockData]);

  // Calculate total projection across all energy types
  const calculateTotalProjection = (data, year) => {
    let total = 0;
    Object.values(data).forEach(typeData => {
      total += typeData.currentProjection || 0;
    });
    setTotalProjection(Math.round(total * 10) / 10);
  };

  // Update when selected year changes
  useEffect(() => {
    if (Object.keys(energyData).length > 0) {
      calculateTotalProjection(energyData, selectedYear);
    }
  }, [selectedYear]);

  // Initial data fetch
  useEffect(() => {
    fetchEnergyData();
  }, [fetchEnergyData]);

  return {
    energyData,
    loading,
    totalProjection,
    selectedYear,
    setSelectedYear,
    apiErrors,
    usingMockData,
    refreshData: fetchEnergyData,
    energyTypes
  };
};

/**
 * Hook to fetch and manage renewable energy news
 */
export const useRenewableNews = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Map energy categories to their colors
  const categoryColors = {
    solar: '#FF9800',
    hydro: '#2196F3',
    wind: '#64748B',
    geothermal: '#F44336',
    biomass: '#4CAF50',
    general: '#6366F1'
  };

  // Dedicated fallback images for each category
  const FALLBACK_IMAGES = {
    solar: [
      'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop'
    ],
    wind: [
      'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548337138-e87d889cc369?w=800&auto=format&fit=crop'
    ],
    hydro: [
      'https://images.unsplash.com/photo-1544964656-b557ba862fa3?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1623961993776-c23062bf31e8?w=800&auto=format&fit=crop'
    ],
    geothermal: [
      'https://images.unsplash.com/photo-1527669538566-7300c2a0475a?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1675181656581-e47ee01224f5?w=800&auto=format&fit=crop'
    ],
    biomass: [
      'https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518569656558-1f25fdc6d538?w=800&auto=format&fit=crop'
    ],
    general: [
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&auto=format&fit=crop'
    ]
  };

  // Function to get a random fallback image for a category
  const getRandomFallbackImage = useCallback((category) => {
    const images = FALLBACK_IMAGES[category] || FALLBACK_IMAGES.general;
    return images[Math.floor(Math.random() * images.length)];
  }, [FALLBACK_IMAGES]);

  // RSS feeds for renewable energy news
  const RSS_FEEDS = [
    { url: 'https://www.renewableenergyworld.com/feed/', name: 'Renewable Energy World' },
    { url: 'https://cleantechnica.com/feed/', name: 'CleanTechnica' },
    { url: 'https://www.solarpowerworldonline.com/feed/', name: 'Solar Power World' }
  ];

  // Fetch renewable energy news
  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check for cached articles first
      const cachedArticles = await AsyncStorage.getItem('renewable-news-cache');
      const cacheTimestamp = await AsyncStorage.getItem('renewable-news-timestamp');
      const now = new Date().getTime();
      
      if (cachedArticles && cacheTimestamp) {
        // Use cache if it's less than 3 hours old
        if (now - parseInt(cacheTimestamp) < 3 * 60 * 60 * 1000) {
          setArticles(JSON.parse(cachedArticles));
          setLastUpdated(new Date(parseInt(cacheTimestamp)));
          setLoading(false);
          return;
        }
      }
      
      // Try to fetch from API
      const response = await axios.get(`${API_BASE_URL}/api/news/renewable`);
      
      if (response.data && response.data.articles) {
        // Process and categorize articles
        const processedArticles = response.data.articles.map(article => {
          // Determine category based on content
          const fullText = (article.title + ' ' + article.description).toLowerCase();
          let category = 'general';
          
          if (fullText.includes('solar') || fullText.includes('photovoltaic')) {
            category = 'solar';
          } else if (fullText.includes('wind') || fullText.includes('turbine')) {
            category = 'wind';
          } else if (fullText.includes('hydro') || fullText.includes('dam')) {
            category = 'hydro';
          } else if (fullText.includes('geothermal') || fullText.includes('heat pump')) {
            category = 'geothermal';
          } else if (fullText.includes('biomass') || fullText.includes('biofuel')) {
            category = 'biomass';
          }
          
          // Ensure image URL is valid or use fallback
          const imageUrl = article.urlToImage && article.urlToImage.startsWith('http')
            ? article.urlToImage
            : getRandomFallbackImage(category);
          
          // Calculate read time (rough estimate based on word count)
          const wordCount = article.description.split(/\s+/).length;
          const readTime = Math.max(1, Math.min(15, Math.ceil(wordCount / 200)));
          
          return {
            ...article,
            category,
            urlToImage: imageUrl,
            readTime
          };
        });
        
        setArticles(processedArticles);
        
        // Cache the data
        await AsyncStorage.setItem('renewable-news-cache', JSON.stringify(processedArticles));
        await AsyncStorage.setItem('renewable-news-timestamp', now.toString());
        setLastUpdated(new Date(now));
      } else {
        throw new Error('Invalid news data structure');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Unable to load the latest renewable energy news.');
      
      // Use fallback articles
      const fallbackArticles = getFallbackArticles();
      setArticles(fallbackArticles);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, [getRandomFallbackImage]);

  // Fallback articles for when API fails
  const getFallbackArticles = useCallback(() => {
    return [
      {
        id: 'fallback-1',
        title: 'Solar Power Innovations Driving Renewable Energy Growth',
        description: 'New advances in solar panel efficiency and battery storage are accelerating the transition to clean energy worldwide. Researchers have developed panels that can operate at higher efficiency rates even in low-light conditions.',
        urlToImage: getRandomFallbackImage('solar'),
        publishedAt: new Date().toISOString(),
        source: { name: 'Renewable Energy World' },
        url: 'https://www.renewableenergyworld.com/',
        category: 'solar',
        readTime: 6
      },
      {
        id: 'fallback-2',
        title: 'Offshore Wind Projects Expand as Costs Decline',
        description: 'Offshore wind is seeing unprecedented growth as technology improvements drive down costs. New floating turbine designs allow wind farms to be installed in deeper waters.',
        urlToImage: getRandomFallbackImage('wind'),
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        source: { name: 'CleanTechnica' },
        url: 'https://cleantechnica.com/',
        category: 'wind',
        readTime: 5
      },
      {
        id: 'fallback-3',
        title: 'Hydropower Modernization Projects Boost Efficiency',
        description: 'Aging hydroelectric dams are getting high-tech upgrades that significantly increase their power output without increasing their environmental footprint.',
        urlToImage: getRandomFallbackImage('hydro'),
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        source: { name: 'Hydro Review' },
        url: 'https://www.hydroreview.com/',
        category: 'hydro',
        readTime: 7
      },
      {
        id: 'fallback-4',
        title: 'Geothermal Power Plants Set for Major Expansion',
        description: 'Geothermal energy is experiencing renewed interest as countries look to develop always-on renewable energy sources. Enhanced geothermal systems now allow power production in regions previously thought unsuitable.',
        urlToImage: getRandomFallbackImage('geothermal'),
        publishedAt: new Date(Date.now() - 259200000).toISOString(),
        source: { name: 'Renewable Energy World' },
        url: 'https://www.renewableenergyworld.com/',
        category: 'geothermal',
        readTime: 8
      }
    ];
  }, [getRandomFallbackImage]);

  // Filter articles based on active filter
  const filteredArticles = useCallback(() => {
    return activeFilter === 'all' 
      ? articles 
      : articles.filter(article => article.category === activeFilter);
  }, [articles, activeFilter]);

  // Format time since publication
  const getTimeSince = useCallback((dateString) => {
    try {
      const now = new Date();
      const publishedDate = new Date(dateString);
      const diffInSeconds = Math.floor((now - publishedDate) / 1000);
      
      if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
      
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return publishedDate.toLocaleDateString(undefined, options);
    } catch (e) {
      return 'recently';
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return {
    articles: filteredArticles(),
    loading,
    error,
    lastUpdated,
    activeFilter,
    setActiveFilter,
    selectedArticle,
    setSelectedArticle,
    refreshNews: fetchNews,
    getTimeSince,
    categoryColors,
    getRandomFallbackImage
  };
};