// // screens/EmailVerification.js
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
//   ScrollView
// } from "react-native";
// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useAuth } from "../context/AuthContext";

// const EmailVerification = ({ route, navigation }) => {
//   const { email } = route.params || {};
//   const [verificationCode, setVerificationCode] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isResending, setIsResending] = useState(false);
  
//   const { verifyEmail, resendVerificationCode, verificationData } = useAuth();

//   const handleVerify = async () => {
//     if (!verificationCode.trim()) {
//       Alert.alert('Error', 'Please enter the verification code');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const result = await verifyEmail(verificationCode.trim());
      
//       if (result.success) {
//         Alert.alert(
//           'Success', 
//           'Your email has been successfully verified!',
//           [{ text: 'OK', onPress: () => navigation.navigate('App', { screen: 'Home' }) }]
//         );
//       } else {
//         Alert.alert('Verification Failed', result.message || 'Please try again');
//       }
//     } catch (error) {
//       Alert.alert('Error', error.message || 'An unexpected error occurred');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResendCode = async () => {
//     setIsResending(true);
//     try {
//       const result = await resendVerificationCode();
      
//       if (result.success) {
//         Alert.alert('Success', 'A new verification code has been sent to your email');
//       } else {
//         Alert.alert('Error', result.message || 'Failed to resend verification code');
//       }
//     } catch (error) {
//       Alert.alert('Error', error.message || 'An unexpected error occurred');
//     } finally {
//       setIsResending(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.container}
//     >
//       <ScrollView 
//         contentContainerStyle={styles.scrollContainer}
//         keyboardShouldPersistTaps="handled"
//       >
//         <View style={styles.card}>
//           <View style={styles.iconContainer}>
//             <Ionicons name="mail-unread" size={70} color="#4CAF50" />
//           </View>
          
//           <Text style={styles.title}>Verify Your Email</Text>
          
//           <Text style={styles.description}>
//             We've sent a verification code to{'\n'}
//             <Text style={styles.emailText}>{email || verificationData?.email || 'your email'}</Text>
//           </Text>
          
//           <View style={styles.inputContainer}>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter verification code"
//               value={verificationCode}
//               onChangeText={setVerificationCode}
//               keyboardType="number-pad"
//               maxLength={6}
//               placeholderTextColor="#A0A0A0"
//               editable={!isLoading && !isResending}
//             />
//           </View>
          
//           <TouchableOpacity 
//             style={styles.button} 
//             onPress={handleVerify}
//             disabled={isLoading || isResending}
//           >
//             <LinearGradient
//               colors={['#4CAF50', '#3E9142']}
//               start={[0, 0]}
//               end={[1, 0]}
//               style={styles.buttonGradient}
//             >
//               {isLoading ? (
//                 <ActivityIndicator color="#FFFFFF" size="small" />
//               ) : (
//                 <Text style={styles.buttonText}>Verify Email</Text>
//               )}
//             </LinearGradient>
//           </TouchableOpacity>
          
//           <View style={styles.resendContainer}>
//             <Text style={styles.resendText}>Didn't receive a code? </Text>
//             <TouchableOpacity 
//               onPress={handleResendCode}
//               disabled={isResending || isLoading}
//             >
//               {isResending ? (
//                 <ActivityIndicator color="#4CAF50" size="small" />
//               ) : (
//                 <Text style={styles.resendLink}>Resend</Text>
//               )}
//             </TouchableOpacity>
//           </View>
          
//           <TouchableOpacity 
//             style={styles.backButton}
//             onPress={() => navigation.goBack()}
//           >
//             <Text style={styles.backButtonText}>
//               <Ionicons name="arrow-back" size={16} /> Back to Login
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// export default EmailVerification;

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
//   },
//   iconContainer: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: 'rgba(76, 175, 80, 0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 24,
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
//   emailText: {
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   inputContainer: {
//     width: '100%',
//     marginBottom: 24,
//   },
//   input: {
//     backgroundColor: '#F8F9FB',
//     borderWidth: 1,
//     borderColor: '#EAEEF2',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     fontSize: 18,
//     color: '#333',
//     textAlign: 'center',
//     letterSpacing: 8,
//   },
//   button: {
//     width: '100%',
//     height: 56,
//     borderRadius: 12,
//     overflow: 'hidden',
//     marginBottom: 20,
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
//   resendContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   resendText: {
//     color: '#525F7F',
//     fontSize: 15,
//   },
//   resendLink: {
//     color: '#4CAF50',
//     fontWeight: 'bold',
//     fontSize: 15,
//   },
//   backButton: {
//     paddingVertical: 8,
//   },
//   backButtonText: {
//     color: '#525F7F',
//     fontSize: 14,
//   },
// });