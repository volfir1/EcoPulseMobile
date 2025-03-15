import React from "react";
import { StyleSheet, View } from "react-native";
import PropTypes from 'prop-types';
import { TextInput } from "react-native-paper";

import Icon from './Icon';

// Define colors internally rather than using argonTheme
const COLORS = {
  MUTED: "#8898AA",
  HEADER: "#172B4D",
  ICON: "#172B4D",
  BORDER: "#E9ECEF",
  INPUT_SUCCESS: "#2DCE89",
  INPUT_ERROR: "#FB6340",
  BLACK: "#000000"
};

class ArInput extends React.Component {
  render() {
    const { shadowless, success, error, iconContent, ...otherProps } = this.props;

    const inputStyles = [
      styles.input,
      !shadowless && styles.shadow,
      success && styles.success,
      error && styles.error,
      {...this.props.style}
    ];

    // Determine the appropriate theme based on success/error states
    let theme = "default";
    if (success) theme = "success";
    if (error) theme = "error";

    return (
      <View style={inputStyles}>
        <TextInput
          placeholder="write something here"
          placeholderTextColor={COLORS.MUTED}
          style={styles.textInput}
          mode="outlined"
          outlineColor={theme === "success" ? COLORS.INPUT_SUCCESS : 
                        theme === "error" ? COLORS.INPUT_ERROR : 
                        COLORS.BORDER}
          activeOutlineColor={theme === "success" ? COLORS.INPUT_SUCCESS : 
                              theme === "error" ? COLORS.INPUT_ERROR : 
                              COLORS.HEADER}
          left={iconContent && 
            <TextInput.Icon 
              icon={() => iconContent}
            />
          }
          {...otherProps}
        />
      </View>
    );
  }
}

ArInput.defaultProps = {
  shadowless: false,
  success: false,
  error: false,
  iconContent: null
};

ArInput.propTypes = {
  shadowless: PropTypes.bool,
  success: PropTypes.bool,
  error: PropTypes.bool,
  iconContent: PropTypes.node
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 4,
    backgroundColor: '#FFFFFF'
  },
  textInput: {
    height: 44,
    backgroundColor: '#FFFFFF'
  },
  success: {
    borderColor: COLORS.INPUT_SUCCESS,
  },
  error: {
    borderColor: COLORS.INPUT_ERROR,
  },
  shadow: {
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 0.05,
    elevation: 2,
  }
});

export default ArInput;