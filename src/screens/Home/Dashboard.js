import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { useEnergyData } from '../hooks/useEnergyData';
import { dashboardStyles, colors } from '../styles/globalStyles';

const { width } = Dimensions.get('window');

// Icons for different energy types
const energyTypeIcons = {
  solar: 'sunny',
  wind: 'thunderstorm',
  hydro: 'water',
  geo: 'flame',
  biomass: 'leaf'
};

const Dashboard = ({ navigation }) => {
  const {
    energyData,
    loading,
    totalProjection,
    selectedYear,
    setSelectedYear,
    apiErrors,
    usingMockData,
    refreshData,
    energyTypes
  } = useEnergyData();

  // Generate data for pie chart
  const getPieChartData = () => {
    const data = [];
    
    energyTypes.forEach(({ type, name, color }) => {
      if (energyData[type]?.currentProjection) {
        data.push({
          name,
          population: energyData[type].currentProjection,
          color,
          legendFontColor: colors.text.primary,
          legendFontSize: 12
        });
      }
    });
    
    return data;
  };

  // Generate data for line chart
  const getLineChartData = () => {
    const labels = [];
    const datasets = [];
    const colors = [];
    
    // Create labels for years
    for (let year = 2025; year <= 2030; year++) {
      labels.push(year.toString());
    }
    
    // Create datasets for each energy type
    energyTypes.forEach(({ type, color }) => {
      if (energyData[type]?.generationData) {
        const data = [];
        
        // Fill data array for each year
        for (let year = 2025; year <= 2030; year++) {
          const yearData = energyData[type].generationData.find(item => item.date === year);
          data.push(yearData ? yearData.value : 0);
        }
        
        datasets.push(data);
        colors.push(color);
      }
    });
    
    return {
      labels,
      datasets: datasets.map((data, index) => ({
        data,
        color: () => colors[index],
        strokeWidth: 2
      })),
      legend: energyTypes.filter(({ type }) => energyData[type]?.generationData).map(({ name }) => name)
    };
  };

  // Get all year-over-year data
  const getYearOverYearData = () => {
    const data = [];
    
    for (let year = 2025; year <= 2030; year++) {
      let yearTotal = 0;
      
      // Sum up all energy types for this year
      energyTypes.forEach(({ type }) => {
        if (energyData[type]?.yearlyData && energyData[type]?.yearlyData[year]) {
          yearTotal += energyData[type].yearlyData[year];
        }
      });
      
      data.push(yearTotal);
    }
    
    return {
      labels: ['2025', '2026', '2027', '2028', '2029', '2030'],
      datasets: [
        {
          data,
          color: () => colors.primary,
          strokeWidth: 2
        }
      ]
    };
  };

  // Get top performers
  const getTopPerformers = () => {
    const performers = [];
    
    energyTypes.forEach(({ type, name, color }) => {
      if (energyData[type]?.currentProjection) {
        performers.push({
          type,
          name,
          color,
          value: energyData[type].currentProjection
        });
      }
    });
    
    // Sort by value in descending order
    performers.sort((a, b) => b.value - a.value);
    
    return performers;
  };

  // Render the years selector
  const renderYearSelector = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={dashboardStyles.yearScrollView}
    >
      {[2025, 2026, 2027, 2028, 2029, 2030].map(year => (
        <TouchableOpacity
          key={year}
          style={[
            dashboardStyles.yearButton,
            selectedYear === year ? dashboardStyles.yearButtonActive : dashboardStyles.yearButtonInactive
          ]}
          onPress={() => setSelectedYear(year)}
        >
          <Text
            style={[
              dashboardStyles.yearButtonText,
              selectedYear === year ? dashboardStyles.yearButtonTextActive : dashboardStyles.yearButtonTextInactive
            ]}
          >
            {year}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  // Render the API error message
  const renderApiErrorAlert = () => {
    if (apiErrors.length === 0) return null;
    
    return (
      <View style={dashboardStyles.alertContainer}>
        <View style={dashboardStyles.alertRow}>
          <Ionicons 
            name="alert-circle" 
            size={20} 
            color={colors.status.warning} 
            style={dashboardStyles.alertIcon} 
          />
          <View style={dashboardStyles.alertContent}>
            <Text style={dashboardStyles.alertTitle}>
              Unable to fetch data from some sources
            </Text>
            <Text style={dashboardStyles.alertText}>
              Using simulation data for {apiErrors.join(', ')}. Real-time data may not be available.
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Loading state
  if (loading) {
    return (
      <View style={dashboardStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={dashboardStyles.loadingText}>Loading dashboard data...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={dashboardStyles.container}
      contentContainerStyle={dashboardStyles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refreshData} colors={[colors.primary]} />
      }
    >
      {/* Header Section */}
      <View style={dashboardStyles.header}>
        <View style={dashboardStyles.headerRow}>
          <Text style={dashboardStyles.headerTitle}>Energy Dashboard</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={dashboardStyles.yearDisplay}>Projection Year: {selectedYear}</Text>
            {usingMockData && (
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center',
                backgroundColor: 'rgba(255, 184, 0, 0.1)',
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderRadius: 12,
                marginLeft: 8
              }}>
                <Ionicons name="alert-circle" size={14} color={colors.status.warning} style={{ marginRight: 4 }} />
                <Text style={{ fontSize: 12, color: colors.status.warning }}>Using simulation data</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={dashboardStyles.headerRow}>
          {renderYearSelector()}
          
          <TouchableOpacity
            style={dashboardStyles.refreshButton}
            onPress={refreshData}
            disabled={loading}
          >
            <Ionicons name="refresh" size={16} color={colors.text.white} />
            <Text style={dashboardStyles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* API Error Alert */}
      {renderApiErrorAlert()}

      {/* Total Energy Generation Card */}
      <LinearGradient
        colors={['#1E293B', '#0F172A']}
        style={dashboardStyles.gradientCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[dashboardStyles.cardTitle, dashboardStyles.cardTitleLight]}>
          Total Energy Generation
        </Text>
        <Text style={[dashboardStyles.cardValue, dashboardStyles.cardValueLight]}>
          {totalProjection} GWh
        </Text>
        <Text style={[dashboardStyles.cardSubtitle, dashboardStyles.cardSubtitleLight]}>
          Combined projection for {selectedYear}
        </Text>
      </LinearGradient>

      {/* Energy Distribution and Top Performers Cards */}
      <View style={dashboardStyles.cardsRow}>
        {/* Energy Distribution */}
        <View style={dashboardStyles.card}>
          <Text style={dashboardStyles.cardTitle}>Energy Distribution</Text>
          
          <View style={dashboardStyles.distributionContainer}>
            <View style={dashboardStyles.distributionLeft}>
              {energyTypes.map(({ type, name, color }) => (
                <View key={type} style={dashboardStyles.distributionRow}>
                  <Ionicons 
                    name={energyTypeIcons[type]} 
                    size={16} 
                    color={color} 
                    style={dashboardStyles.distributionIcon} 
                  />
                  <Text style={dashboardStyles.distributionLabel}>{name}:</Text>
                  <Text style={dashboardStyles.distributionValue}>
                    {Math.round((energyData[type]?.currentProjection || 0) * 10) / 10} GWh
                  </Text>
                  {apiErrors.includes(type) && (
                    <Text style={dashboardStyles.distributionSimulated}>(sim)</Text>
                  )}
                </View>
              ))}
            </View>
            
            <View style={dashboardStyles.pieContainer}>
              <PieChart
                data={getPieChartData()}
                width={100}
                height={100}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="0"
                absolute
                hasLegend={false}
              />
            </View>
          </View>
        </View>
        
        {/* Top Performers */}
        <View style={[dashboardStyles.card, dashboardStyles.performerContainer]}>
          <Text style={dashboardStyles.cardTitle}>Top Performers</Text>
          
          {getTopPerformers().slice(0, 3).map((performer, index) => (
            <View key={performer.type} style={dashboardStyles.performerItem}>
              <View style={dashboardStyles.performerRow}>
                <Text style={dashboardStyles.performerName}>{performer.name}</Text>
                <Text style={dashboardStyles.performerValue}>{Math.round(performer.value * 10) / 10}</Text>
              </View>
              <View style={dashboardStyles.progressBar}>
                <View
                  style={[
                    dashboardStyles.progressIndicator,
                    { 
                      width: `${(performer.value / getTopPerformers()[0].value) * 100}%`,
                      backgroundColor: performer.color
                    }
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Energy Trend Chart Section */}
      <View style={dashboardStyles.chartSection}>
        <Text style={dashboardStyles.chartTitle}>Energy Generation Trends</Text>
        
        <View style={dashboardStyles.chartContainer}>
          <LineChart
            data={getYearOverYearData()}
            width={width - 40}
            height={220}
            chartConfig={{
              backgroundColor: colors.background.card,
              backgroundGradientFrom: colors.background.card,
              backgroundGradientTo: colors.background.card,
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: colors.primary
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        </View>
      </View>

      {/* Energy Source Cards */}
      <Text style={dashboardStyles.chartTitle}>Energy Sources Overview</Text>
      
      <View style={dashboardStyles.sourceCardsContainer}>
        <View style={dashboardStyles.sourceCardsGrid}>
          {energyTypes.map(({ type, name, color }) => (
            <View
              key={type}
              style={[
                dashboardStyles.sourceCard,
                { borderLeftColor: color }
              ]}
            >
              <View style={dashboardStyles.sourceCardHeader}>
                <Ionicons name={energyTypeIcons[type]} size={20} color={color} />
                <Text style={dashboardStyles.sourceCardTitle}>
                  {name} Energy
                  {apiErrors.includes(type) && (
                    <Text style={dashboardStyles.sourceCardSimTag}>(simulated)</Text>
                  )}
                </Text>
              </View>
              
              <Text style={[dashboardStyles.sourceCardValue, { color }]}>
                {Math.round((energyData[type]?.currentProjection || 0) * 10) / 10} GWh
              </Text>
              
              <Text style={dashboardStyles.sourceCardSubtitle}>
                Projected for {selectedYear}
              </Text>
              
              <View style={dashboardStyles.miniChartContainer}>
                {energyData[type]?.generationData && (
                  <LineChart
                    data={{
                      labels: [],
                      datasets: [
                        {
                          data: energyData[type].generationData.map(item => item.value)
                        }
                      ]
                    }}
                    width={width * 0.42}
                    height={80}
                    withInnerLines={false}
                    withOuterLines={false}
                    withVerticalLabels={false}
                    withHorizontalLabels={false}
                    chartConfig={{
                      backgroundColor: 'transparent',
                      backgroundGradientFrom: 'transparent',
                      backgroundGradientTo: 'transparent',
                      color: () => color,
                      strokeWidth: 2,
                      fillShadowGradient: color,
                      fillShadowGradientOpacity: 0.2
                    }}
                    bezier
                    style={{ paddingRight: 0 }}
                  />
                )}
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Dashboard;