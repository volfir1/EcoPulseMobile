import React from "react";
import { StyleSheet } from "react-native";
import PropTypes from 'prop-types';
import { Button } from "react-native-paper";

// Define color constants internally instead of using argonTheme
const COLORS = {
  DEFAULT: "#172B4D",
  PRIMARY: "#5E72E4",
  SECONDARY: "#F7FAFC",
  INFO: "#11CDEF",
  ERROR: "#F5365C",
  SUCCESS: "#2DCE89",
  WARNING: "#FB6340"
};

class ArButton extends React.Component {
  render() {
    const { small, shadowless, children, color, style, ...props } = this.props;
    
    // Get color from our internal COLORS constant
    const colorStyle = color && COLORS[color.toUpperCase()];

    // Apply styles
    const buttonContainerStyle = [
      styles.button,
      small && styles.smallButton,
      !shadowless && styles.shadow,
      {...style}
    ];

    return (
      <Button
        mode="contained"
        style={buttonContainerStyle}
        color={colorStyle || COLORS.DEFAULT}
        labelStyle={{ fontSize: 12, fontWeight: '700' }}
        {...props}
      >
        {children}
      </Button>
    );
  }
}

ArButton.propTypes = {
  small: PropTypes.bool,
  shadowless: PropTypes.bool,
  color: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf(['default', 'primary', 'secondary', 'info', 'error', 'success', 'warning'])
  ])
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
  },
  smallButton: {
    width: 75,
    height: 28
  },
  shadow: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
});

export default ArButton;