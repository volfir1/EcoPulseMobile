// src/utils/captureChartImage.js
import { Platform } from 'react-native';
import ViewShot from 'react-native-view-shot';

/**
 * Capture a chart view as a base64 image
 * @param {React.RefObject} ref - Reference to the chart component
 * @param {Object} options - Capture options
 * @returns {Promise<string|null>} - Base64 encoded image or null if failed
 */
export const captureChartAsBase64 = async (ref, options = {}) => {
  try {
    console.log("Attempting to capture chart...");
    
    if (!ref || !ref.current) {
      console.log('Chart reference not available');
      return null;
    }

    // Default options
    const captureOptions = {
      format: 'png',
      quality: 0.8,
      result: 'base64',
      ...options
    };

    console.log("Taking screenshot of chart...");
    
    // Capture the view as base64
    const uri = await ViewShot.captureRef(ref, captureOptions);
    
    console.log("Chart captured successfully");
    
    // Remove data:image/png;base64, prefix if present
    if (uri && uri.includes('base64,')) {
      return uri.split('base64,')[1];
    }
    
    return uri;
  } catch (error) {
    console.error('Failed to capture chart:', error);
    return null;
  }
};

export default {
  captureChartAsBase64
};