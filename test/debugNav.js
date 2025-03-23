// components/DebugNavigationHelper.js
// Create this file to help identify navigation issues
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';

const DebugNavigationHelper = ({ targetScreen = 'ResetPassword', targetParams = { token: 'debug-token' } }) => {
  const navigation = useNavigation();
  const routes = useNavigationState(state => state.routes);
  const currentRoute = useNavigationState(state => state.routes[state.index]);
  
  // Log navigation state when component mounts
  useEffect(() => {
    console.log('==== NAVIGATION DEBUG ====');
    console.log('Current route:', currentRoute?.name);
    console.log('Available routes:', routes.map(r => r.name));
    console.log('Full navigation state:', JSON.stringify(navigation.getState(), null, 2));
    console.log('========================');
  }, []);
  
  const testNavigationMethods = () => {
    Alert.alert(
      'Test Navigation',
      `Current screen: ${currentRoute?.name}\nTarget: ${targetScreen}`,
      [
        {
          text: 'Method 1: Direct',
          onPress: () => {
            console.log('Trying direct navigation...');
            navigation.navigate(targetScreen, targetParams);
          }
        },
        {
          text: 'Method 2: With Auth',
          onPress: () => {
            console.log('Trying through Auth...');
            navigation.navigate('Auth', {
              screen: targetScreen,
              params: targetParams
            });
          }
        },
        {
          text: 'Method 3: Reset',
          onPress: () => {
            console.log('Trying navigation reset...');
            navigation.reset({
              index: 0,
              routes: [
                { 
                  name: 'Auth',  
                  state: {
                    routes: [
                      {
                        name: targetScreen,
                        params: targetParams
                      }
                    ]
                  }
                }
              ],
            });
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Navigation Debug</Text>
      <Text style={styles.info}>Current: {currentRoute?.name}</Text>
      <TouchableOpacity 
        style={styles.button} 
        onPress={testNavigationMethods}
      >
        <Text style={styles.buttonText}>Test Navigation</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffecb3',
    padding: 10,
    borderRadius: 8,
    margin: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff6f00',
    marginBottom: 5,
  },
  info: {
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#ff9800',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  }
});

export default DebugNavigationHelper;