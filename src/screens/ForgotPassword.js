// // screens/ForgotPassword.js
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

// const ForgotPassword = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
  
//   const { forgotPassword } = useAuth();

//   const handleResetPassword = async () => {
//     // Validate email
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!email.trim() || !emailRegex.test(email)) {
//       Alert.alert('Error', 'Please enter a valid email address');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const result = await forgotPassword(email.trim());
      
//       if (result.success) {
//         setSubmitted(true);
//       } else {
//         Alert.alert('Error', result.message || 'Failed to process your request');
//       }
//     } catch (error) {
//       Alert.alert('Error', error.message || 'An unexpected error occurred');
//     } finally {
//       setIsLoading(false);
//     }
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
//               onPress={() => navigation.goBack()}
//             >
//               <Ionicons name="arrow-back" size={24} color="#525F7F" />
//             </TouchableOpacity>
            
//             <View style={styles.iconContainer}>
//               <Ionicons name="lock-open" size={70} color="#4CAF50" />
//             </View>
            
//             {submitted ? (
//               <>
//                 <Text style={styles.title}>Check Your Email</Text>
                
//                 <Text style={styles.description}>
//                   We've sent password reset instructions to:
//                 </Text>
                
//                 <Text style={styles.emailDisplay}>
//                   {email}
//                 </Text>
                
//                 <Text style={styles.additionalInfo}>
//                   If you don't see the email, check your spam folder or verify the email address you entered.
//                 </Text>
                
//                 <TouchableOpacity 
//                   style={styles.button} 
//                   onPress={() => navigation.navigate('Login')}
//                 >
//                   <LinearGradient
//                     colors={['#4CAF50', '#3E9142']}
//                     start={[0, 0]}
//                     end={[1, 0]}
//                     style={styles.buttonGradient}
//                   >
//                     <Text style={styles.buttonText}>Back to Login</Text>
//                   </LinearGradient>
//                 </TouchableOpacity>
//               </>
//             ) : (
//               <>
//                 <Text style={styles.title}>Reset Password</Text>
                
//                 <Text style={styles.description}>
//                   Enter your email address and we'll send you instructions to reset your password.
//                 </Text>
                
//                 <View style={styles.inputContainer}>
//                   <Ionicons name="mail" size={20} color="#525F7F" style={styles.inputIcon} />
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Email Address"
//                     value={email}
//                     onChangeText={setEmail}
//                     placeholderTextColor="#A0A0A0"
//                     autoCapitalize="none"
//                     keyboardType="email-address"
//                     editable={!isLoading}
//                   />
//                 </View>
                
//                 <TouchableOpacity 
//                   style={styles.button} 
//                   onPress={handleResetPassword}
//                   disabled={isLoading}
//                 >
//                   <LinearGradient
//                     colors={['#4CAF50', '#3E9142']}
//                     start={[0, 0]}
//                     end={[1, 0]}
//                     style={styles.buttonGradient}
//                   >
//                     {isLoading ? (
//                       <ActivityIndicator color="#FFFFFF" size="small" />
//                     ) : (
//                       <Text style={styles.buttonText}>Send Reset Link</Text>
//                     )}
//                   </LinearGradient>
//                 </TouchableOpacity>
//               </>
//             )}
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </TouchableWithoutFeedback>
//   );
// };

// export default ForgotPassword;

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
//   emailDisplay: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 20,
//   },
//   additionalInfo: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 30,
//     paddingHorizontal: 10,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: '100%',
//     backgroundColor: '#F8F9FB',
//     borderRadius: 12,
//     paddingHorizontal: 15,
//     marginBottom: 24,
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