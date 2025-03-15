// LeafletMapComponent.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const LeafletMap = ({ locationsWithTotals, hoveredCity }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Create a simpler HTML content with basic map
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>
          body { margin: 0; padding: 0; }
          #map { position: absolute; top: 0; bottom: 0; width: 100%; height: 100%; }
        </style>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
      </head>
      <body>
        <div id="map"></div>
        
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <script>
          // Initialize the map
          var map = L.map('map').setView([10.3157, 123.8854], 7);
          
          // Add the OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);
          
          // Add simple markers for each location
          ${locationsWithTotals.map(location => {
            const surplus = location.totalPredictedGeneration - location.totalConsumption;
            const hasSurplus = surplus > 0;
            const color = hasSurplus ? '#4caf50' : '#f44336';
            
            return `
              // Create marker for ${location.Place}
              var marker = L.marker([${location.coordinates.lat}, ${location.coordinates.lng}]).addTo(map);
              marker.bindPopup('<b>${location.Place}</b><br>Generation: ${Math.round(location.totalPredictedGeneration)} GWh<br>Consumption: ${Math.round(location.totalConsumption)} GWh');
            `;
          }).join('\n')}
          
          // Send a message when map is loaded
          map.on('load', function() {
            window.ReactNativeWebView.postMessage('Map loaded');
          });
        </script>
      </body>
    </html>
  `;
  
  return (
    <View style={styles.container}>
      <WebView
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={['*']}
        onLoad={() => setIsLoading(false)}
        onError={(e) => {
          console.error('WebView error:', e.nativeEvent);
          setError(e.nativeEvent);
          setIsLoading(false);
        }}
        onHttpError={(e) => {
          console.error('WebView HTTP error:', e.nativeEvent);
          setError(e.nativeEvent);
          setIsLoading(false);
        }}
        onMessage={(event) => {
          console.log('Message from webview:', event.nativeEvent.data);
        }}
      />
      
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorTitle}>Map Error</Text>
          <Text style={styles.errorText}>Unable to load the map. Please check your internet connection.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#2E7D32',
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f44336',
    marginBottom: 10,
  },
  errorText: {
    textAlign: 'center',
    color: '#333',
  }
});

export default LeafletMap;