import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ImageBackground,
  FlatList,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Onboarding content
const onboardingData = [
  {
    id: '1',
    title: 'Welcome to EcoPulse',
    description: 'Your personal energy management and sustainability assistant.',
    image: require('../../assets/imgs/bg.webp'), // Make sure this path is correct
  },
  {
    id: '2',
    title: 'Track Your Energy',
    description: 'Monitor Energy Trends.',
    image: require('../../assets/imgs/trend.png'), // Make sure this path is correct
  },
  {
    id: '3',
    title: 'Join the Community',
    description: 'Connect with others who are passionate about sustainability and share tips.',
    image: require('../../assets/imgs/connect.png'), // Make sure this path is correct
  },
  {
    id: '4',
    title: 'Get Started',
    description: 'Sign up now to begin your journey towards a more sustainable lifestyle.',
    image: require('../../assets/imgs/start.png'), // Make sure this path is correct
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  // Handle navigating to next slide
  const goToNextSlide = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      // If we're on the last slide, complete onboarding
      completeOnboarding();
    }
  };

  // Handle navigating to previous slide
  const goToPreviousSlide = () => {
    if (currentIndex > 0) {
      flatListRef.current.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Handle skipping onboarding
  const skipOnboarding = () => {
    completeOnboarding();
  };

  // Mark onboarding as complete and navigate to next screen
  const completeOnboarding = async () => {
    try {
      // Mark that the intro has been seen
      await AsyncStorage.setItem('ecopulse_has_seen_intro', 'true');
      
      // Check if the user is already authenticated
      const userData = await AsyncStorage.getItem('ecopulse_user');
      const hasCompletedOnboarding = await AsyncStorage.getItem('ecopulse_has_completed_onboarding');
      
      console.log('Completing onboarding, user data:', userData ? 'exists' : 'not found');
      
      if (userData && hasCompletedOnboarding === 'true') {
        // User exists and has completed profile setup - go to Home
        console.log('User exists and has completed onboarding, navigating to Home');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else if (userData) {
        // User exists but needs to complete profile - go to OnboardRegister
        console.log('User exists but needs to complete profile, navigating to OnboardRegister');
        navigation.reset({
          index: 0,
          routes: [{ name: 'OnboardRegister' }],
        });
      } else {
        // No user - go to Auth
        console.log('No user found, navigating to Auth');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        });
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Default to Auth screen if there's an error
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    }
  };

  // Render individual slide
  const renderSlide = ({ item }) => (
    <ImageBackground source={item.image} style={styles.slide} resizeMode="cover">
      <View style={styles.contentOverlay}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </ImageBackground>
  );

  // Handle scroll event to update current index
  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  // Render pagination dots
  const renderPaginationDots = () => {
    return (
      <View style={styles.paginationContainer}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index === currentIndex ? '#4CAF50' : '#E0E0E0' }
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          {currentIndex > 0 ? (
            <TouchableOpacity onPress={goToPreviousSlide} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
          )}
          
          <TouchableOpacity onPress={skipOnboarding} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      
      <SafeAreaView style={styles.bottomSafeArea}>
        {renderPaginationDots()}
        
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.button}
            onPress={goToNextSlide}
          >
            <Text style={styles.buttonText}>
              {currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"}
            </Text>
            <Ionicons 
              name={currentIndex === onboardingData.length - 1 ? "checkmark-circle" : "arrow-forward"} 
              size={20} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Changed to black for better fullscreen image appearance
  },
  safeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  bottomSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
    height: 40,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  slide: {
    width,
    height,
    justifyContent: 'flex-end',
  },
  contentOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay for better text readability
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 17,
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default OnboardingScreen;