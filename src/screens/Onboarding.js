import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Animated,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("screen");

const Onboarding = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    setLoading(true);
    navigation.navigate("Login");
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      {/* Background Image */}
      <Image
        source={require("../../assets/imgs/bg.webp")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Gradient Overlay */}
      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(7,58,27,0.8)", "rgba(10,35,20,0.95)"]}
        locations={[0, 0.6, 1]}
        style={styles.gradient}
      />

      {/* Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Image
              source={require("../../assets/imgs/ecopulse-logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.logoText}>EcoPulse</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Renewable Energy Dashboard</Text>
          <Text style={styles.subtitle}>
            Monitor and optimize your energy systems with intelligent analytics
            and real-time insights
          </Text>
        </View>

        {/* Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleGetStarted}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.primaryButtonText}>Get Started</Text>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A2314",
  },
  backgroundImage: {
    width,
    height,
    position: "absolute",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: height * 0.08,
  },
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginBottom: 16,
  },
  logo: {
    width: 70,
    height: 70,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 1,
  },
  textContainer: {
    marginTop: height * 0.1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 24,
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    marginTop: 40,
    width: "100%",
  },
  primaryButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});

export default Onboarding;
