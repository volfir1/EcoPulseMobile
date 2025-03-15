// src/utils/mobilePdfGenerator.js
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

/**
 * Format value with appropriate precision and unit
 * @param {number} value - Value to format
 * @param {string} unit - Unit to append (e.g., 'GWh')
 * @param {number} precision - Number of decimal places
 * @returns {string} Formatted value with unit
 */
const formatValue = (value, unit = '', precision = 1) => {
  if (value === undefined || value === null) return '-';
  const formattedValue = parseFloat(value).toFixed(precision);
  return unit ? `${formattedValue} ${unit}` : formattedValue;
};

/**
 * Generate PDF for mobile devices
 * @param {Object} options - PDF generation options
 * @returns {Promise<Object>} - Result of PDF generation with file URI
 */
export const generatePDF = async ({
  energyType,
  data,
  startYear,
  endYear,
  currentProjection,
  config,
  chartImageBase64 = null // Optional chart image as base64
}) => {
  try {
    console.log("Generating PDF for", energyType);
    
    // Format year values
    const startYearValue = typeof startYear === 'object' && typeof startYear.year === 'function'
      ? startYear.year()
      : (typeof startYear === 'number' ? startYear : new Date().getFullYear());
    
    const endYearValue = typeof endYear === 'object' && typeof endYear.year === 'function'
      ? endYear.year()
      : (typeof endYear === 'number' ? endYear : new Date().getFullYear() + 5);
    
    // Only include chart if available
    const chartHtml = chartImageBase64 
      ? `
        <div class="chart-container">
          <img src="data:image/png;base64,${chartImageBase64}" style="max-width: 100%; height: auto;" alt="Energy Generation Chart" />
        </div>
        `
      : `
        <div class="chart-placeholder">
          <p style="text-align: center; color: #666; font-style: italic; padding: 40px 0;">
            Energy generation trend visualization
          </p>
        </div>
        `;
    
    // Create HTML content for the PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            h1 {
              color: ${config.primaryColor || '#000000'};
              font-size: 24px;
              margin-bottom: 5px;
            }
            .header {
              border-bottom: 1px solid #eee;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .metadata {
              color: #666;
              font-size: 14px;
              margin-bottom: 5px;
            }
            .projection {
              font-size: 18px;
              font-weight: bold;
              margin: 15px 0;
            }
            .projection-value {
              color: ${config.primaryColor || '#000000'};
            }
            .chart-container, .chart-placeholder {
              margin: 20px 0;
              border: 1px solid #eee;
              border-radius: 8px;
              overflow: hidden;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th {
              background-color: ${config.primaryColor || '#000000'};
              color: white;
              text-align: left;
              padding: 10px;
            }
            td {
              padding: 8px 10px;
              border-bottom: 1px solid #eee;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #999;
              text-align: center;
              border-top: 1px solid #eee;
              padding-top: 15px;
            }
            .predicted {
              font-style: italic;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${config.title || energyType.charAt(0).toUpperCase() + energyType.slice(1) + ' Energy'}</h1>
            <div class="metadata">Year Range: ${startYearValue} - ${endYearValue}</div>
            <div class="metadata">Generated on: ${new Date().toLocaleDateString()}</div>
            <div class="projection">
              Current Projection: <span class="projection-value">${currentProjection ? formatValue(currentProjection, 'GWh') : 'N/A'}</span>
            </div>
          </div>
          
          ${chartHtml}
          
          <h2>Generation Data</h2>
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Production (GWh)</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(item => `
                <tr${item.isPredicted ? ' class="predicted"' : ''}>
                  <td>${item.date}${item.isPredicted ? ' (Projected)' : ''}</td>
                  <td>${formatValue(item.value, 'GWh')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Report generated via ${config.title || (energyType.charAt(0).toUpperCase() + energyType.slice(1) + ' Energy')} Mobile App</p>
          </div>
        </body>
      </html>
    `;

    console.log("HTML content created, generating PDF...");

    // Create PDF using expo-print
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      width: 612, // Standard US Letter width in points (8.5 inches)
      height: 792, // Standard US Letter height in points (11 inches)
      base64: false
    });

    console.log("PDF generated at:", uri);

    // Rename the file to make it more user-friendly
    const fileName = config.fileName || `${energyType}_energy_report`;
    const pdfName = `${fileName.replace(/\s+/g, '_')}.pdf`;
    const newUri = `${FileSystem.documentDirectory}${pdfName}`;
    
    await FileSystem.moveAsync({
      from: uri,
      to: newUri
    });

    console.log("PDF saved to:", newUri);

    return {
      success: true,
      uri: newUri,
      filename: pdfName
    };
  } catch (error) {
    console.error('PDF generation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Generate and share PDF
 * @param {Object} options - Same options as generatePDF
 * @returns {Promise<Object>} - Result of the share operation
 */
export const generateAndSharePDF = async (options) => {
  try {
    console.log("Starting PDF generation and sharing process...");
    
    // Generate the PDF
    const result = await generatePDF(options);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to generate PDF');
    }
    
    console.log("PDF generated successfully, attempting to share...");
    
    // Check if sharing is available (iOS and Android)
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      const isSharingAvailable = await Sharing.isAvailableAsync();
      
      if (isSharingAvailable) {
        console.log("Sharing is available, opening share dialog...");
        
        // Share the PDF
        await Sharing.shareAsync(result.uri, {
          mimeType: 'application/pdf',
          dialogTitle: `${options.config.title || options.energyType} Report`,
          UTI: 'com.adobe.pdf' // iOS only
        });
        
        return {
          success: true,
          shared: true,
          uri: result.uri
        };
      } else {
        console.log("Sharing is not available on this device");
        
        // Sharing not available - just return the URI
        return {
          success: true,
          shared: false,
          uri: result.uri,
          message: 'Sharing is not available on this device. PDF saved to file system.'
        };
      }
    } else {
      console.log("Platform doesn't support sharing");
      
      // Web or other platform - just return the URI
      return {
        success: true,
        shared: false,
        uri: result.uri,
        message: 'PDF saved to file system.'
      };
    }
  } catch (error) {
    console.error('PDF share error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  generatePDF,
  generateAndSharePDF
};