import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Svg, Rect, Line, Text as SvgText, Path, G } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

const ImprovedChart = ({ data, width = 300, height = 200, color = '#FF6B6B', showValues = true, type = 'bar' }) => {
  if (!data || data.length === 0) return null;
  
  // Find the max value for scaling
  const maxValue = Math.max(...data.map(item => item.value));
  // Round up to a nice number for y-axis
  const yAxisMax = Math.ceil(maxValue / 100) * 100;
  
  // Padding and dimensions
  const paddingLeft = 40;  // Space for y-axis
  const paddingRight = 10;
  const paddingBottom = 30; // Space for x-axis labels
  const paddingTop = 20;    // Increased padding at top
  
  // Chart area dimensions
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingBottom - paddingTop;
  
  // Calculate bar width based on number of data points
  const barWidth = Math.min(28, (chartWidth / data.length) * 0.7);
  const barSpacing = (chartWidth - (barWidth * data.length)) / (data.length + 1);
  
  // Y-axis labels
  const yAxisLabels = [
    { value: yAxisMax, y: paddingTop },
    { value: yAxisMax / 2, y: paddingTop + chartHeight / 2 },
    { value: 0, y: paddingTop + chartHeight }
  ];
  
  // Generate line path for line chart
  const generateLinePath = () => {
    if (data.length === 0) return '';
    
    let path = '';
    data.forEach((item, index) => {
      const x = paddingLeft + (barSpacing * (index + 1)) + (barWidth * index) + (barWidth / 2);
      const y = paddingTop + chartHeight - ((item.value / yAxisMax) * chartHeight);
      
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    
    return path;
  };
  
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        {/* Background grid lines */}
        {yAxisLabels.map((label, index) => (
          <Line
            key={`grid-${index}`}
            x1={paddingLeft}
            y1={label.y}
            x2={width - paddingRight}
            y2={label.y}
            stroke="#E5E7EB"
            strokeWidth={1}
            strokeDasharray={index === yAxisLabels.length - 1 ? "" : "3,3"}
          />
        ))}
        
        {/* Y-axis labels */}
        {yAxisLabels.map((label, index) => (
          <SvgText
            key={`label-${index}`}
            x={paddingLeft - 8}
            y={label.y + 4}
            fontSize={10}
            fill="#8898AA"
            textAnchor="end"
          >
            {Math.round(label.value)}
          </SvgText>
        ))}
        
        {type === 'bar' ? (
          // Bar chart
          <>
            {data.map((item, index) => {
              const barHeight = (item.value / yAxisMax) * chartHeight;
              const x = paddingLeft + (barSpacing * (index + 1)) + (barWidth * index);
              const y = paddingTop + chartHeight - barHeight;
              
              return (
                <G key={`bar-${index}`}>
                  {/* Bar */}
                  <Rect
                    x={x}
                    y={y}
                    rx={3}
                    width={barWidth}
                    height={barHeight > 0 ? barHeight : 1}
                    fill={color}
                    opacity={0.85}
                  />
                  
                  {/* Value above bar - only if showValues is true */}
                  {showValues && item.value > yAxisMax * 0.1 && (
                    <SvgText
                      x={x + barWidth / 2}
                      y={y - 6}
                      fontSize={9}
                      fill="#8898AA"
                      textAnchor="middle"
                    >
                      {Math.round(item.value)}
                    </SvgText>
                  )}
                  
                  {/* X-axis label */}
                  <SvgText
                    x={x + barWidth / 2}
                    y={paddingTop + chartHeight + 15}
                    fontSize={10}
                    fill="#8898AA"
                    textAnchor="middle"
                  >
                    {item.date}
                  </SvgText>
                </G>
              );
            })}
          </>
        ) : (
          // Line chart
          <>
            {/* Line */}
            <Path
              d={generateLinePath()}
              stroke={color}
              strokeWidth={2.5}
              fill="none"
            />
            
            {/* Data points */}
            {data.map((item, index) => {
              const x = paddingLeft + (barSpacing * (index + 1)) + (barWidth * index) + (barWidth / 2);
              const y = paddingTop + chartHeight - ((item.value / yAxisMax) * chartHeight);
              
              return (
                <G key={`point-${index}`}>
                  {/* Point */}
                  <Rect
                    x={x - 3}
                    y={y - 3}
                    width={6}
                    height={6}
                    rx={3}
                    fill={color}
                    stroke="white"
                    strokeWidth={1}
                  />
                  
                  {/* Value above point - only if showValues is true */}
                  {showValues && (
                    <SvgText
                      x={x}
                      y={y - 10}
                      fontSize={9}
                      fill="#8898AA"
                      textAnchor="middle"
                    >
                      {Math.round(item.value)}
                    </SvgText>
                  )}
                  
                  {/* X-axis label */}
                  <SvgText
                    x={x}
                    y={paddingTop + chartHeight + 15}
                    fontSize={10}
                    fill="#8898AA"
                    textAnchor="middle"
                  >
                    {item.date}
                  </SvgText>
                </G>
              );
            })}
          </>
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 8,
  }
});

export default ImprovedChart;