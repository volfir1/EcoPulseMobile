// Enhanced CloudinaryImage.jsx with better caching behavior

import React, { useState, useEffect } from 'react';
import { Image, ActivityIndicator, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isCloudinaryUrl } from './avatarHelper';

/**
 * CloudinaryImage component for optimized image loading from Cloudinary
 * with caching and refresh capabilities
 */
const CloudinaryImage = ({
  source,
  style,
  refreshKey,
  forceRefresh = false,
  resizeMode = 'cover',
  onLoad,
  onError,
  ...props
}) => {
  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadImage = async () => {
      try {
        if (!source || !source.uri) {
          throw new Error('Invalid image source');
        }
        
        setIsLoading(true);
        setError(null);
        
        let finalUri = source.uri;
        
        // Handle Cloudinary URLs with proper cache busting
        if (isCloudinaryUrl(finalUri)) {
          // Use the refreshKey or generate a timestamp for cache busting
          const cacheBuster = refreshKey || Date.now().toString();
          
          // Add cache busting parameter without disrupting existing URL parameters
          if (forceRefresh || refreshKey) {
            // Remove any existing _cb parameter
            finalUri = finalUri.replace(/([&?])_cb=[^&]+(&|$)/, '$1');
            
            // Add the new parameter
            finalUri = finalUri.includes('?') 
              ? `${finalUri}&_cb=${cacheBuster}` 
              : `${finalUri}?_cb=${cacheBuster}`;
          }
        }
        
        if (isMounted) {
          console.log(`Loading image: ${finalUri.substring(0, 100)}...`);
          setImageUri(finalUri);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error loading image:', err);
        if (isMounted) {
          setError(err);
          setIsLoading(false);
          if (onError) onError(err);
        }
      }
    };
    
    loadImage();
    
    return () => {
      isMounted = false;
    };
  }, [source, refreshKey, forceRefresh]);
  
  // Loading state
  if (isLoading) {
    return (
      <View style={[styles.loaderContainer, style]}>
        <ActivityIndicator size="small" color="#10B981" />
      </View>
    );
  }
  
  // Error state
  if (error || !imageUri) {
    return (
      <View style={[styles.errorContainer, style]}>
        <View style={styles.errorIcon} />
      </View>
    );
  }
  
  // Render the image
  return (
    <Image
      source={{ uri: imageUri }}
      style={style}
      resizeMode={resizeMode}
      onLoad={(e) => {
        console.log('Image loaded successfully');
        if (onLoad) onLoad(e);
      }}
      onError={(e) => {
        console.error('Image loading error:', e.nativeEvent.error);
        setError(new Error(e.nativeEvent.error));
        if (onError) onError(e);
      }}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  errorIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
});

export default React.memo(CloudinaryImage);