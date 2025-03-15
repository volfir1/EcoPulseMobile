// geoUtil.js
import dayjs from 'dayjs';

/**
 * Returns configuration for the area chart
 */
export const getAreaChartConfig = () => {
  return {
    gradient: {
      stops: [
        { offset: '0%', color: '#FF5733', opacity: 0.7 },
        { offset: '100%', color: '#FF5733', opacity: 0.1 }
      ]
    },
    area: {
      type: 'monotone',
      dataKey: 'value',
      stroke: '#FF5733',
      strokeWidth: 2,
      fill: 'url(#geoGradient)',
      activeDot: {
        r: 6,
        strokeWidth: 0,
        fill: '#FF5733'
      }
    },
    tooltip: {
      labelFormatter: (value) => `Year: ${value}`,
      formatter: (value) => [`${value.toFixed(1)} GWH`, 'Geothermal Output'],
      contentStyle: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderColor: '#F3F4F6',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      },
      itemStyle: {
        color: '#111827'
      },
      labelStyle: {
        color: '#6B7280'
      }
    }
  };
};

/**
 * Returns configuration for the grid and axes
 */
export const getGridConfig = () => {
  return {
    cartesianGrid: {
      strokeDasharray: '3 3',
      vertical: false,
      stroke: '#E5E7EB'
    },
    xAxis: {
      tickLine: false,
      axisLine: { stroke: '#E5E7EB' },
      tick: { fill: '#6B7280', fontSize: 12 },
      dy: 10
    },
    yAxis: {
      tickLine: false,
      axisLine: { stroke: '#E5E7EB' },
      tick: { fill: '#6B7280', fontSize: 12 },
      dx: -10
    }
  };
};

/**
 * Formats number values for display
 * @param {number} value - The number to format
 * @param {string} unit - Optional unit to append (e.g., 'GWH')
 * @returns {string} Formatted number with unit
 */
export const formatNumber = (value, unit = '') => {
  if (value === undefined || value === null) return '-';
  
  const formattedValue = parseFloat(value).toFixed(1);
  return unit ? `${formattedValue} ${unit}` : formattedValue;
};

/**
 * Calculate percentage change between two values
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} Percentage change
 */
export const calculatePercentageChange = (current, previous) => {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Generate color based on value compared to threshold
 * @param {number} value - The value to evaluate
 * @param {number} threshold - The threshold to compare against
 * @returns {string} Color code
 */
export const getValueColor = (value, threshold) => {
  if (value === undefined || value === null) return '#6B7280';
  return value >= threshold ? '#10B981' : '#EF4444';
};

/**
 * Format year for display
 * @param {dayjs.Dayjs|number} year - Year as dayjs object or number
 * @returns {string} Formatted year
 */
export const formatYear = (year) => {
  if (year instanceof dayjs) {
    return year.format('YYYY');
  }
  return year.toString();
};

export default {
  getAreaChartConfig,
  getGridConfig,
  formatNumber,
  calculatePercentageChange,
  getValueColor,
  formatYear
};
