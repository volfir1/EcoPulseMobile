import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  ScrollView,
  StatusBar,
  FlatList,
  Modal
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";

// Import our custom hook and API service
import { useSingleYearPicker } from "../../../components/YearPicker/useSingleYearPicker";
import energyService from "./energService";
import LeafletMap from './mapHelper';

// Import styles
import styles from './styles';
import Header from "@components/Header";
// Location coordinates (Philippines regions)
const locationCoordinates = {
  "Bohol": { lat: 9.8500, lng: 124.1435 },
  "Cebu": { lat: 10.3157, lng: 123.8854 },
  "Negros": { lat: 9.9820, lng: 122.8358 },
  "Panay": { lat: 11.1790, lng: 122.5662 },
  "Leyte-Samar": { lat: 10.7500, lng: 124.8333 }
};

const { width } = Dimensions.get("window");

// Region Card Component
const RegionCard = ({ region, isExpanded, onToggle, isHovered }) => {
  const surplus = region.totalPredictedGeneration - region.totalConsumption;
  const hasSurplus = surplus > 0;
  
  return (
  <>
      
    
    <TouchableOpacity 
    
      style={[
        styles.regionCard,
        {
          borderLeftWidth: 4,
          borderLeftColor: hasSurplus ? '#4caf50' : '#f44336',
          backgroundColor: isHovered ? '#f5f5f5' : '#ffffff'
        }
      ]}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <View style={styles.regionCardHeader}>
        <View style={styles.regionNameContainer}>
          <Ionicons name="location" size={16} color="#64748B" />
          <Text style={styles.regionName}>{region.Place}</Text>
        </View>
        <View style={[
          styles.statusChip,
          {
            backgroundColor: hasSurplus ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'
          }
        ]}>
          <Text style={{ 
            color: hasSurplus ? '#4caf50' : '#f44336',
            fontSize: 12,
            fontWeight: '600'
          }}>
            {hasSurplus ? "Surplus" : "Deficit"}
          </Text>
        </View>
      </View>
      
      <View style={styles.energyDataContainer}>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Generation:</Text>
          <Text style={styles.dataValue}>{Math.round(region.totalPredictedGeneration)} GWh</Text>
        </View>
        
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Consumption:</Text>
          <Text style={styles.dataValue}>{Math.round(region.totalConsumption)} GWh</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.dataRow}>
          <Text style={[
            styles.dataLabel,
            { color: hasSurplus ? '#4caf50' : '#f44336' }
          ]}>
            {hasSurplus ? "Surplus:" : "Deficit:"}
          </Text>
          <Text style={[
            styles.dataValue,
            { color: hasSurplus ? '#4caf50' : '#f44336', fontWeight: '700' }
          ]}>
            {Math.abs(Math.round(surplus))} GWh
          </Text>
        </View>
      </View>
      
      {isExpanded && (
        <View style={styles.expandedContent}>
          <View style={styles.divider} />
          <Text style={styles.expandedTitle}>Energy Mix</Text>
          
          {region.solar > 0 && (
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Solar:</Text>
              <Text style={styles.dataValue}>{Math.round(region.solar)} GWh</Text>
            </View>
          )}
          
          {region.wind > 0 && (
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Wind:</Text>
              <Text style={styles.dataValue}>{Math.round(region.wind)} GWh</Text>
            </View>
          )}
          
          {region.hydropower > 0 && (
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Hydropower:</Text>
              <Text style={styles.dataValue}>{Math.round(region.hydropower)} GWh</Text>
            </View>
          )}
          
          {region.geothermal > 0 && (
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Geothermal:</Text>
              <Text style={styles.dataValue}>{Math.round(region.geothermal)} GWh</Text>
            </View>
          )}
          
          {region.biomass > 0 && (
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Biomass:</Text>
              <Text style={styles.dataValue}>{Math.round(region.biomass)} GWh</Text>
            </View>
          )}
          
          {region.totalNonRenewable > 0 && (
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Non-Renewable:</Text>
              <Text style={styles.dataValue}>{Math.round(region.totalNonRenewable)} GWh</Text>
            </View>
          )}
        </View>
      )}
      
      <View style={styles.cardFooter}>
        <Ionicons 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={18} 
          color="#64748B" 
        />
      </View>
    </TouchableOpacity>
    </>
  );
  
};

// Summary Card Component
const SummaryCard = ({ locationsWithTotals }) => {
  const totalGeneration = locationsWithTotals.reduce((acc, location) => acc + location.totalPredictedGeneration, 0);
  const totalConsumption = locationsWithTotals.reduce((acc, location) => acc + location.totalConsumption, 0);
  const totalRenewable = locationsWithTotals.reduce((acc, location) => acc + location.totalRenewable, 0);
  
  const renewablePercentage = totalGeneration > 0 ? (totalRenewable / totalGeneration) * 100 : 0;
  
  const surplusLocations = locationsWithTotals.filter(loc => loc.totalPredictedGeneration > loc.totalConsumption);
  const deficitLocations = locationsWithTotals.filter(loc => loc.totalPredictedGeneration <= loc.totalConsumption);
  
  return (
    
    <View style={styles.summaryCard}>

      
      <View style={styles.summaryContent}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{Math.round(totalGeneration).toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Generation (GWh)</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{Math.round(totalConsumption).toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Consumption (GWh)</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#4caf50' }]}>{renewablePercentage.toFixed(1)}%</Text>
            <Text style={styles.statLabel}>Renewable Energy</Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.surplusInfo}>
          <Text style={styles.surplusText}>
            <Text style={{ color: '#4caf50', fontWeight: '600' }}>{surplusLocations.length}</Text> regions with surplus
          </Text>
          
          <Text style={styles.surplusText}>
            <Text style={{ color: '#f44336', fontWeight: '600' }}>{deficitLocations.length}</Text> regions with deficit
          </Text>
        </View>
      </View>
    </View>
  );
};

// Mobile Map View using Leaflet - Wrapped with memo to prevent unnecessary rerenders
const MobileMapView = React.memo(({ locationsWithTotals, hoveredCity }) => {
  return (
    <View style={styles.mapContainer}>
      <LeafletMap 
        locationsWithTotals={locationsWithTotals} 
        hoveredCity={hoveredCity}
      />
      <View style={styles.mapOverlay}>
        <Text style={styles.mapTitle}>Interactive Energy Map</Text>
        <Text style={styles.mapSubtitle}>Tap on markers to see details</Text>
      </View>
    </View>
  );
});

// Main Component
const EnergySharing = () => {
  // First declare all state variables
  const [selectedYear, setSelectedYear] = useState(2025);
  const [expandedRegion, setExpandedRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  // Use the SingleYearPicker hook with proper dependencies
  const {
    year,
    error,
    showPicker,
    handleYearChange,
    handleReset,
    togglePicker
  } = useSingleYearPicker({
    initialYear: selectedYear,
    onYearChange: (year) => {
      setSelectedYear(year);
    }
  });

  // Fetch data from API based on selected year
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (!isMounted) return;
      
      try {
        setIsLoading(true);
        
        // Use our API service with fallback
        const response = await energyService.getPeerToPeerData(selectedYear);
        
        if (!isMounted) return;
        
        // Add coordinates to each location
        const locationsWithCoordinates = response.predictions.map(location => ({
          ...location,
          coordinates: locationCoordinates[location.Place] || { lat: 0, lng: 0 }
        }));
        
        setLocations(locationsWithCoordinates);
      } catch (error) {
        console.error('Error in component:', error);
        if (isMounted) {
          setLocations([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [selectedYear]);

  // Calculate total predicted generation and consumption for each location
  const locationsWithTotals = useMemo(() => {
    const totals = {};

    locations.forEach(location => {
      const place = location.Place;
      const energyType = location['Energy Type'];
      const predictedValue = location['Predicted Value'];

      if (!totals[place]) {
        totals[place] = {
          totalPredictedGeneration: 0,
          totalConsumption: 0,
          totalRenewable: 0,
          totalNonRenewable: 0,
          solar: 0,
          wind: 0,
          hydropower: 0,
          geothermal: 0,
          biomass: 0,
          coordinates: location.coordinates
        };
      }

      if (energyType === 'Total Power Generation (GWh)') {
        totals[place].totalPredictedGeneration += predictedValue;
      }

      if (energyType.includes('Estimated Consumption (GWh)')) {
        totals[place].totalConsumption += predictedValue;
      }

      if (energyType === 'Solar (GWh)') {
        totals[place].solar += predictedValue;
        totals[place].totalRenewable += predictedValue;
      }

      if (energyType === 'Wind (GWh)') {
        totals[place].wind += predictedValue;
        totals[place].totalRenewable += predictedValue;
      }

      if (energyType === 'Hydro (GWh)') {
        totals[place].hydropower += predictedValue;
        totals[place].totalRenewable += predictedValue;
      }

      if (energyType === 'Geothermal (GWh)') {
        totals[place].geothermal += predictedValue;
        totals[place].totalRenewable += predictedValue;
      }

      if (energyType === 'Biomass (GWh)') {
        totals[place].biomass += predictedValue;
        totals[place].totalRenewable += predictedValue;
      }
    });

    // Compute total renewable and non-renewable values
    Object.keys(totals).forEach(place => {
      // If totalRenewable is 0, set to a small default value to avoid showing 0%
      if (totals[place].totalRenewable === 0) {
        totals[place].totalRenewable = 0.1;
      }
      
      totals[place].totalNonRenewable = Math.max(0, totals[place].totalPredictedGeneration - totals[place].totalRenewable);
      
      // Ensure we have non-negative values
      totals[place].totalPredictedGeneration = Math.max(0, totals[place].totalPredictedGeneration);
      totals[place].totalConsumption = Math.max(0, totals[place].totalConsumption);
    });

    return Object.keys(totals).map(place => ({
      Place: place,
      totalPredictedGeneration: totals[place].totalPredictedGeneration,
      totalConsumption: totals[place].totalConsumption,
      totalRenewable: totals[place].totalRenewable,
      totalNonRenewable: totals[place].totalNonRenewable,
      solar: totals[place].solar,
      wind: totals[place].wind,
      hydropower: totals[place].hydropower,
      geothermal: totals[place].geothermal,
      biomass: totals[place].biomass,
      coordinates: totals[place].coordinates
    }));
  }, [locations]);

  // Safe handler for refreshing
  const handleRefresh = () => {
    handleReset();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>

   
      <Header title={'Peer to Peer Energy Sharing'}/>
      <View style={styles.header}>
    
        
        <View style={styles.controlsContainer}>
          <View style={styles.yearPickerContainer}>
            {/* Year picker UI */}
            <TouchableOpacity 
              style={[styles.yearButton, error && styles.errorBorder]} 
              onPress={togglePicker}
            >
              <Text style={styles.yearText}>{year.year()}</Text>
              <Ionicons name="chevron-down" size={16} color="#64748B" />
            </TouchableOpacity>
            
            {/* Year picker modal */}
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
                  <Text style={styles.modalTitle}>Select Year</Text>
                  <FlatList
                    data={Array.from({length: 30}, (_, i) => dayjs().year() - 10 + i)}
                    keyExtractor={(item) => item.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.yearItem,
                          item === year.year() && styles.selectedYearItem
                        ]}
                        onPress={() => handleYearChange(item)}
                      >
                        <Text style={[
                          styles.yearItemText,
                          item === year.year() && styles.selectedYearText
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
          </View>
          
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={handleRefresh}
          >
            <Ionicons name="refresh" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.viewToggle}>
        <TouchableOpacity 
          style={[
            styles.viewToggleButton, 
            viewMode === 'list' && styles.viewToggleButtonActive
          ]}
          onPress={() => setViewMode('list')}
        >
          <Ionicons 
            name="list" 
            size={18} 
            color={viewMode === 'list' ? '#2E7D32' : '#64748B'} 
          />
          <Text 
            style={[
              styles.viewToggleText,
              viewMode === 'list' && styles.viewToggleTextActive
            ]}
          >
            List
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.viewToggleButton,
            viewMode === 'map' && styles.viewToggleButtonActive
          ]}
          onPress={() => setViewMode('map')}
        >
          <Ionicons 
            name="map" 
            size={18} 
            color={viewMode === 'map' ? '#2E7D32' : '#64748B'} 
          />
          <Text 
            style={[
              styles.viewToggleText,
              viewMode === 'map' && styles.viewToggleTextActive
            ]}
          >
            Map
          </Text>
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Loading data...</Text>
        </View>
      ) : (
        <>
          {locationsWithTotals.length > 0 && (
            <SummaryCard locationsWithTotals={locationsWithTotals} />
          )}
          
          {viewMode === 'list' ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {locationsWithTotals.map((region, index) => (
                <RegionCard
                  key={index}
                  region={region}
                  isExpanded={expandedRegion === region.Place}
                  isHovered={hoveredRegion === region.Place}
                  onToggle={() => setExpandedRegion(
                    expandedRegion === region.Place ? null : region.Place
                  )}
                />
              ))}
            </ScrollView>
          ) : (
            <MobileMapView 
              locationsWithTotals={locationsWithTotals}
              hoveredCity={hoveredRegion}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

// Additional styles for the year picker
const additionalStyles = {
  yearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 100,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  yearText: {
    fontSize: 14,
    fontWeight: '500',
  },
  errorBorder: {
    borderColor: '#DC2626',
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
  yearItemText: {
    fontSize: 16,
    textAlign: 'center',
  },
  selectedYearText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
};

// Add the additional styles to your main styles object
Object.assign(styles, additionalStyles);

export default EnergySharing;