// screens/Register.js - Updated with useRegister hook
import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar, 
  ImageBackground,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import useRegister from "../../hooks/register";

const { width, height } = Dimensions.get('window');

const Register = ({ navigation }) => {
  // Use the register hook
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    acceptedTerms,
    toggleTerms,
    handleRegister,
    handleGoogleSignIn,
    handleLoginNavigation
  } = useRegister(navigation);
  
  // Animation state
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require('../../assets/imgs/bg.png')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <StatusBar translucent backgroundColor="transparent" />
        
        {/* Overlay gradient for better text readability */}
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.3)']}
          style={styles.gradient}
        />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <Animated.View 
            style={[
              styles.panel,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="person-add" size={80} color="#4CAF50" />
            </View>
            
            <Text style={styles.title}>Create Account</Text>
            
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={20} color="#525F7F" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                placeholderTextColor="#A0A0A0"
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={20} color="#525F7F" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                placeholderTextColor="#A0A0A0"
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={20} color="#525F7F" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#A0A0A0"
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!isLoading}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color="#525F7F" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#A0A0A0"
                editable={!isLoading}
              />
            </View>
            
            <View style={styles.termsContainer}>
              <TouchableOpacity 
                style={styles.checkbox}
                onPress={toggleTerms}
                disabled={isLoading}
              >
                <Ionicons 
                  name={acceptedTerms ? "checkmark-circle" : "ellipse-outline"} 
                  size={20} 
                  color={acceptedTerms ? "#4CAF50" : "#525F7F"} 
                />
              </TouchableOpacity>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text>
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleRegister}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#4CAF50', '#3E9142']}
                start={[0, 0]}
                end={[1, 0]}
                style={styles.buttonGradient}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Create Account</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
            
            <Text style={styles.orText}>Or register with</Text>
            
            <TouchableOpacity 
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
              disabled={isLoading}
            >
              <View style={styles.googleIconContainer}>
                <Ionicons name="logo-google" size={18} color="#4CAF50" />
              </View>
              <Text style={styles.googleButtonText}>Sign up with Google</Text>
            </TouchableOpacity>
            
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity 
                onPress={handleLoginNavigation}
                disabled={isLoading}
              >
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    width: '100%',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImageStyle: {
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  panel: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    width: width * 0.9,
    maxWidth: 400,
    alignSelf: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#F8F9FB',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#EAEEF2',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  checkbox: {
    marginRight: 8,
  },
  termsText: {
    fontSize: 14,
    color: '#525F7F',
  },
  termsLink: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: "#4CAF50",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  orText: {
    marginVertical: 16,
    color: '#999',
    fontWeight: '500',
  },
  googleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 24,
    width: '100%',
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  googleButtonText: {
    color: '#525F7F',
    fontWeight: '600',
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginText: {
    color: '#525F7F',
    fontSize: 15,
  },
  loginLink: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default Register;