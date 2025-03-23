import React from 'react';
import { View, Text } from 'react-native';
import { homeStyles } from 'styles/homeScreenStyles';

/**
 * Energy Summary Component
 * Displays the current day's energy production, consumption, and net values
 */
const EnergySummary = () => {
  // This would typically come from a hook or prop
  // For now using static data for demonstration
  const summaryData = {
    production: 24.5,
    consumption: 18.3,
    net: 6.2,
  };

  return (
    <View style={homeStyles.summarySection}>
      <View style={homeStyles.summaryContainer}>
        <View style={homeStyles.summaryItem}>
          <Text style={homeStyles.summaryValue}>{summaryData.production}</Text>
          <Text style={homeStyles.summaryUnit}>kWh</Text>
          <Text style={homeStyles.summaryLabel}>Production</Text>
        </View>
        
        <View style={homeStyles.summaryDivider} />
        
        <View style={homeStyles.summaryItem}>
          <Text style={homeStyles.summaryValue}>{summaryData.consumption}</Text>
          <Text style={homeStyles.summaryUnit}>kWh</Text>
          <Text style={homeStyles.summaryLabel}>Consumption</Text>
        </View>
        
        <View style={homeStyles.summaryDivider} />
        
        <View style={homeStyles.summaryItem}>
          <Text style={homeStyles.summaryValue}>{summaryData.net}</Text>
          <Text style={homeStyles.summaryUnit}>kWh</Text>
          <Text style={homeStyles.summaryLabel}>Net</Text>
        </View>
      </View>
    </View>
  );
};

export default EnergySummary;