// src/components/NetworkDebugger.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import api from './api';

const NetworkDebugger = () => {
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ipInfo, setIpInfo] = useState({
    baseUrl: api.baseUrl
  });

  const runTests = async () => {
    setIsLoading(true);
    try {
      const results = await api.testConnection();
      setTestResults(results);
    } catch (error) {
      setTestResults({
        error: error.message,
        details: { error }
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if we're using a device emulator/simulator or real device based on IP
  const getDeviceType = () => {
    const url = api.baseUrl || '';
    if (url.includes('10.0.2.2')) {
      return 'Android Emulator';
    } else if (url.includes('localhost')) {
      return 'iOS Simulator or Web';
    } else {
      return 'Physical Device';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Network Debugger</Text>
      
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>API Configuration</Text>
        <Text style={styles.infoItem}>Base URL: <Text style={styles.value}>{ipInfo.baseUrl}</Text></Text>
        <Text style={styles.infoItem}>Device Type: <Text style={styles.value}>{getDeviceType()}</Text></Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.testButton, isLoading && styles.disabledButton]} 
        onPress={runTests}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Testing...' : 'Test Connection'}
        </Text>
      </TouchableOpacity>
      
      {testResults && (
        <ScrollView style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Test Results:</Text>
          
          {testResults.error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>Error: {testResults.error}</Text>
            </View>
          ) : (
            <>
              <View style={[
                styles.resultBox, 
                testResults.internet ? styles.successBox : styles.errorBox
              ]}>
                <Text style={styles.resultLabel}>Internet Connection:</Text>
                <Text style={styles.resultValue}>
                  {testResults.internet ? 'Connected ✓' : 'Failed ✗'}
                </Text>
                {testResults.details?.internet && (
                  <Text style={styles.resultDetails}>
                    {JSON.stringify(testResults.details.internet, null, 2)}
                  </Text>
                )}
              </View>
              
              <View style={[
                styles.resultBox, 
                testResults.apiServer ? styles.successBox : styles.errorBox
              ]}>
                <Text style={styles.resultLabel}>API Server:</Text>
                <Text style={styles.resultValue}>
                  {testResults.apiServer ? 'Connected ✓' : 'Failed ✗'}
                </Text>
                {testResults.details?.apiServer && (
                  <Text style={styles.resultDetails}>
                    {JSON.stringify(testResults.details.apiServer, null, 2)}
                  </Text>
                )}
              </View>
            </>
          )}
          
          <Text style={styles.helpText}>
            {!testResults.apiServer && 'If the API server test failed, make sure your server is running and accessible on your network. You may need to configure your server to accept connections from devices on your network.'}
          </Text>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  infoSection: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  infoItem: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  value: {
    fontWeight: '500',
    color: '#333',
  },
  testButton: {
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#a5c9f7',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  resultsContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    maxHeight: 300,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  resultBox: {
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  successBox: {
    backgroundColor: '#e6f7e6',
  },
  errorBox: {
    backgroundColor: '#ffeeee',
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  resultDetails: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#666',
    marginTop: 4,
  },
  errorText: {
    color: '#d32f2f',
    fontWeight: '500',
  },
  helpText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  }
});

export default NetworkDebugger;