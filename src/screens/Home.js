import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  FlatList,
  ScrollView,
  RefreshControl
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { homeStyles, colors } from "styles/homeScreenStyles";
import RenewableNewsCard from "./Home/renewableNewsCard";
import EnergySummary from "./Home/EnergySummary";
import { useEnergyData } from "utils/homeScreenData";

// Energy modules data
const energyModules = [
  {
    id: "solar",
    title: "Solar Energy",
    icon: "sunny",
    color: colors.energy.solar,
    gradientColors: [colors.energy.solar, "#FB8C00"],
    route: "SolarEnergy",
    image: require("../../assets/energy/solar.jpg"),
    description: "Monitor your solar panel performance",
    stats: "24.5 kWh"
  },
  {
    id: "wind",
    title: "Wind Energy",
    icon: "thunderstorm",
    color: colors.energy.wind,
    gradientColors: [colors.energy.wind, "#0288D1"],
    route: "WindEnergy",
    image: require("../../assets/energy/turbine.png"),
    description: "Track wind turbine efficiency",
    stats: "8.2 kWh"
  },
  {
    id: "geo",
    title: "Geothermal",
    icon: "flame",
    color: colors.energy.geo,
    gradientColors: [colors.energy.geo, "#D32F2F"],
    route: "Geothermal",
    image: require("../../assets/energy/geothermal.jpg"),
    description: "Analyze geothermal system metrics",
    stats: "5.8 kWh"
  },
  {
    id: "hydro",
    title: "Hydropower",
    icon: "water",
    color: colors.energy.hydro,
    gradientColors: [colors.energy.hydro, "#1976D2"],
    route: "Hydropower",
    image: require("../../assets/energy/hydropower.jpg"),
    description: "View hydroelectric generation data",
    stats: "12.3 kWh"
  }
];

// Quick action buttons
const quickActions = [
  {
    id: "sharing",
    title: "Sharing",
    icon: "share-social",
    color: colors.status.success,
    route: "EnergySharing"
  },
  {
    id: "recommendations",
    title: "Tips",
    icon: "bulb",
    color: colors.energy.solar,
    route: "Recommendations"
  },
  {
    id: "help",
    title: "Help",
    icon: "help-circle",
    color: colors.accent,
    route: "HelpSupport"
  }
];

const Home = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { loading, refreshData } = useEnergyData();
  
  // Header component with improved design
  const renderHeader = () => (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[homeStyles.headerContainer, { paddingTop: insets.top }]}
    >
      <View style={homeStyles.headerContent}>
        <TouchableOpacity 
          style={homeStyles.menuButton}
          onPress={() => navigation.openDrawer()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="menu" size={26} color="#FFF" />
        </TouchableOpacity>
        
        <View style={homeStyles.headerTitleContainer}>
          <Text style={homeStyles.headerTitle}>EcoPulse</Text>
        </View>
        
        {/* <TouchableOpacity 
          style={homeStyles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="notifications" size={22} color="#FFF" />
          <View style={homeStyles.notificationBadge} />
        </TouchableOpacity> */}
      </View>
    </LinearGradient>
  );

  // Render energy module item
  const renderEnergyModule = ({ item }) => (
    <TouchableOpacity
      style={homeStyles.moduleCard}
      onPress={() => navigation.navigate(item.route)}
      activeOpacity={0.8}
    >
      <Image source={item.image} style={homeStyles.moduleImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.85)']}
        style={homeStyles.moduleOverlay}
      >
        <View 
          style={[
            homeStyles.moduleIconContainer, 
            { backgroundColor: item.color }
          ]}
        >
          <Ionicons name={item.icon} size={20} color="#FFF" />
        </View>
        <View style={homeStyles.moduleContent}>
          <Text style={homeStyles.moduleTitle}>{item.title}</Text>
          <Text style={homeStyles.moduleDescription}>{item.description}</Text>
        </View>
        <View style={homeStyles.moduleStats}>
          <Text style={homeStyles.moduleStatsValue}>{item.stats}</Text>
          <Text style={homeStyles.moduleStatsLabel}>Today</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={homeStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      
      {/* Custom Header */}
      {renderHeader()}
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={homeStyles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshData} colors={[colors.primary]} />
        }
      >
        {/* Welcome Section with personalized greeting */}
        <View style={homeStyles.welcomeSection}>
          <Text style={homeStyles.welcomeTitle}>Welcome Back!</Text>
          <Text style={homeStyles.welcomeText}>
            Your renewable energy systems are performing well today
          </Text>
        </View>
        
        {/* Energy Summary Section */}
        <EnergySummary />
        
        {/* Energy Modules Section */}
        <View style={homeStyles.sectionContainer}>
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>Energy Systems</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EnergySystems')}>
              <Text style={homeStyles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={energyModules}
            renderItem={renderEnergyModule}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={homeStyles.modulesListContainer}
          />
        </View>
        
        {/* Quick Actions */}
        <View style={homeStyles.sectionContainer}>
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>Quick Access</Text>
          </View>
          
          <View style={homeStyles.quickAccessGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity 
                key={action.id}
                style={homeStyles.quickAccessItem}
                onPress={() => navigation.navigate(action.route)}
                activeOpacity={0.7}
              >
                <View style={[homeStyles.quickAccessIcon, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon} size={22} color="#FFF" />
                </View>
                <Text style={homeStyles.quickAccessText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* News Section */}
        <RenewableNewsCard navigation={navigation} />
      </ScrollView>
    </View>
  );
};

export default Home;