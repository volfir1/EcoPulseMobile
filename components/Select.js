import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import ModalDropdown from 'react-native-modal-dropdown';
import { Text } from 'react-native-paper';

import Icon from './Icon';

// Define colors internally
const COLORS = {
  DEFAULT: '#172B4D',
  WHITE: '#FFFFFF'
};

class DropDown extends React.Component {
  state = {
    value: 1,
  }

  handleOnSelect = (index, value) => {
    const { onSelect } = this.props;

    this.setState({ value: value });
    onSelect && onSelect(index, value);
  }

  render() {
    const { onSelect, iconName, iconFamily, iconSize, iconColor, color, textStyle, style, ...props } = this.props;

    const modalStyles = [
      styles.qty,
      color && { backgroundColor: color },
      style
    ];

    const textStyles = [
      styles.text,
      textStyle
    ];

    return (
      <ModalDropdown
        style={modalStyles}
        onSelect={this.handleOnSelect}
        dropdownStyle={styles.dropdown}
        dropdownTextStyle={{paddingLeft:16, fontSize:12}}
        {...props}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={textStyles}>{this.state.value}</Text>
          <Icon 
            name={iconName || "nav-down"} 
            family={iconFamily || "ArgonExtra"} 
            size={iconSize || 10} 
            color={iconColor || COLORS.WHITE} 
          />
        </View>
      </ModalDropdown>
    )
  }
}

DropDown.propTypes = {
  onSelect: PropTypes.func,
  iconName: PropTypes.string,
  iconFamily: PropTypes.string,
  iconSize: PropTypes.number,
  color: PropTypes.string,
  textStyle: PropTypes.any,
};

const styles = StyleSheet.create({
  qty: {
    width: 100,
    backgroundColor: COLORS.DEFAULT,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 9.5,
    borderRadius: 4,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 1,
  },
  text: {
    color: COLORS.WHITE,
    fontWeight: '600',
    fontSize: 12
  },
  dropdown: {
    marginTop: 8,
    marginLeft: -16,
    width: 100,
  },
});

export default DropDown;