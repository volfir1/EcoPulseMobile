// // screens/ResetPassword.js
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   TouchableWithoutFeedback,
//   Keyboard
// } from "react-native";
// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useAuth } from "../context/AuthContext";

// const ResetPassword = ({ route, navigation }) => {
//   const { token } = route.params || {};
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
  
//   const { resetPassword } = useAuth();

//   const handleResetPassword = async () => {
//     // Validation
//     if (!password.trim() || !confirmPassword.trim()) {
//       Alert.alert('Error', 'Please enter and confirm your password');
//       return;
//     }

//     if (password !== confirmPassword) {
//       Alert.alert('Error', 'Passwords do not match');
//       return;
//     }

//     if (password.length < 6) {
//       Alert.alert('Error', 'Password must be at least 6 characters long');
//       return;
//     }

//     if (!token) {
//       Alert.alert('Error', 'Reset token is missing. Please try again from the forgot password screen.');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const result = await resetPassword(token, password);
      
//       if (result.success) {
//         Alert.alert(
//           'Success', 
//           'Your password has been reset successfully!',
//           [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
//         );
//       } else {
//         Alert.alert('Error', result.message || 'Failed to reset password');
//       }
//     } catch (error) {
//       Alert.alert('Error', error.message || 'An unexpected error occurred');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const toggleShowPassword = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={styles.container}
//       >
//         <ScrollView 
//           contentContainerStyle={styles.scrollContainer}
//           keyboardShouldPersistTaps="handled"
//         >
//           <View style={styles.card}>
//             <TouchableOpacity 
//               style={styles.backButton}
//               onPress={() => navigation.navigate('Login')}
//             >
//               <Ionicons name="arrow-back" size={24} color="#525F7F" />
//             </TouchableOpacity>
            
//             <View style={styles.iconContainer}>
//               <Ionicons name="lock-closed" size={70} color="#4CAF50" />
//             </View>
            
//             <Text style={styles.title}>Reset Password</Text>
            
//             <Text style={styles.description}>
//               Create a new password for your account
//             </Text>
            
//             <View style={styles.inputContainer}>
//               <Ionicons name="lock-closed" size={20} color="#525F7F" style={styles.inputIcon} />
//               <TextInput
//                 style={styles.input}
//                 placeholder="New Password"
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry={!showPassword}
//                 placeholderTextColor="#A0A0A0"
//                 editable={!isLoading}
//               />
//               <TouchableOpacity onPress={toggleShowPassword}>
//                 <Ionicons 
//                   name={showPassword ? "eye-off" : "eye"} 
//                   size={20} 
//                   color="#525F7F" 
//                 />
//               </TouchableOpacity>
//             </View>
            
//             <View style={styles.inputContainer}>
//               <Ionicons name="lock-closed" size={20} color="#525F7F" style={styles.inputIcon} />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Confirm New Password"
//                 value={confirmPassword}
//                 onChangeText={setConfirmPassword}
//                 secureTextEntry={!showPassword}
//                 placeholderTextColor="#A0A0A0"
//                 editable={!isLoading}
//               />
//             </View>
            
//             <View style={styles.passwordRequirements}>
//               <Text style={styles.requirementTitle}>Password requirements:</Text>
//               <Text style={[
//                 styles.requirementText,
//                 password.length >= 6 ? styles.requirementMet : {}
//               ]}>
//                 • At least 6 characters
//               </Text>
//             </View>
            
//             <TouchableOpacity 
//               style={styles.button} 
//               onPress={handleResetPassword}
//               disabled={isLoading}
//             >
//               <LinearGradient
//                 colors={['#4CAF50', '#3E9142']}
//                 start={[0, 0]}
//                 end={[1, 0]}
//                 style={styles.buttonGradient}
//               >
//                 {isLoading ? (
//                   <ActivityIndicator color="#FFFFFF" size="small" />
//                 ) : (
//                   <Text style={styles.buttonText}>Reset Password</Text>
//                 )}
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </TouchableWithoutFeedback>
//   );
// };

// export default ResetPassword;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     padding: 20,
//   },
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 16,
//     padding: 30,
//     alignItems: 'center',
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 3,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 6,
//     position: 'relative',
//   },
//   backButton: {
//     position: 'absolute',
//     top: 20,
//     left: 20,
//     zIndex: 10,
//   },
//   iconContainer: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: 'rgba(76, 175, 80, 0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 24,
//     marginTop: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     color: '#333',
//   },
//   description: {
//     fontSize: 16,
//     color: '#525F7F',
//     textAlign: 'center',
//     marginBottom: 24,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: '100%',
//     backgroundColor: '#F8F9FB',
//     borderRadius: 12,
//     paddingHorizontal: 15,
//     marginBottom: 16,
//     height: 56,
//     borderWidth: 1,
//     borderColor: '#EAEEF2',
//   },
//   inputIcon: {
//     marginRight: 12,
//   },
//   input: {
//     flex: 1,
//     height: '100%',
//     fontSize: 16,
//     color: '#333',
//   },
//   passwordRequirements: {
//     width: '100%',
//     paddingHorizontal: 10,
//     marginBottom: 24,
//   },
//   requirementTitle: {
//     fontSize: 14,
//     color: '#525F7F',
//     marginBottom: 8,
//   },
//   requirementText: {
//     fontSize: 14,
//     color: '#999',
//     marginBottom: 4,
//   },
//   requirementMet: {
//     color: '#4CAF50',
//   },
//   button: {
//     width: '100%',
//     height: 56,
//     borderRadius: 12,
//     overflow: 'hidden',
//     marginTop: 10,
//     shadowColor: "#4CAF50",
//     shadowOffset: {
//       width: 0,
//       height: 3,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   buttonGradient: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });