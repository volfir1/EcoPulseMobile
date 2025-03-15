import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Svg, Rect, Line, Text as SvgText } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

const SimpleChart = ({ data, width = 300, height = 200, barColor = '#FFB800', animate = true }) => {
  if (!data || data.length === 0) return null;
  
  // Find the max value for scaling
  const maxValue = Math.max(...data.map(item => item.value));
  // Round up to a nice number for y-axis
  const yAxisMax = Math.ceil(maxValue / 100) * 100;
  
  // Padding and dimensions
  const paddingHorizontal = 10;
  const paddingBottom = 30;
  const paddingTop = 15;
  
  // Chart area dimensions
  const chartWidth = width - 40; // Subtract y-axis width
  const chartHeight = height - paddingBottom - paddingTop;
  
  // Calculate bar width based on number of data points
  const barWidth = Math.min(30, (chartWidth / data.length) * 0.6);
  const barSpacing = (chartWidth - (barWidth * data.length)) / (data.length + 1);
  
  // Y-axis labels
  const yAxisLabels = [
    { value: yAxisMax, y: paddingTop },
    { value: yAxisMax / 2, y: paddingTop + chartHeight / 2 },
    { value: 0, y: paddingTop + chartHeight }
  ];
  
  return (
    <View style={[styles.container, { width, height }]}>
      {/* Y Axis */}
      <View style={styles.yAxis}>
        {yAxisLabels.map((label, index) => (
          <Text 
            key={index} 
            style={[styles.axisLabel, { top: label.y - 10 }]}
          >
            {Math.round(label.value)}
          </Text>
        ))}
      </View>
      
      {/* Chart area */}
      <View style={styles.chartArea}>
        <Svg width={chartWidth} height={height}>
          {/* Grid lines */}
          {yAxisLabels.map((label, index) => (
            <Line
              key={`grid-${index}`}
              x1={0}
              y1={label.y}
              x2={chartWidth}
              y2={label.y}
              stroke="#E5E7EB"
              strokeWidth={1}
              strokeDasharray={index === yAxisLabels.length - 1 ? "" : "5,5"}
            />
          ))}
          
          {/* Data bars */}
          {data.map((item, index) => {
            const barHeight = (item.value / yAxisMax) * chartHeight;
            const x = (barSpacing * (index + 1)) + (barWidth * index);
            const y = paddingTop + chartHeight - barHeight;
            
            return (
              <React.Fragment key={`bar-${index}`}>
                {/* Bar */}
                <Rect
                  x={x}
                  y={y}
                  rx={3}
                  width={barWidth}
                  height={barHeight > 0 ? barHeight : 1}
                  fill={barColor}
                  opacity={0.85}
                />
                
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
                
                {/* Value above bar */}
                {item.value > yAxisMax * 0.05 && (
                  <SvgText
                    x={x + barWidth / 2}
                    y={y - 8}
                    fontSize={9}
                    fill="#8898AA"
                    textAnchor="middle"
                  >
                    {Math.round(item.value)}
                  </SvgText>
                )}
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  yAxis: {
    width: 40,
    height: '100%',
    position: 'relative',
    paddingRight: 5,
  },
  axisLabel: {
    position: 'absolute',
    right: 8,
    fontSize: 10,
    fontWeight: '500',
    color: '#8898AA',
  },
  chartArea: {
    flex: 1,
    position: 'relative',
    height: '100%',
  },
});

export default SimpleChart;