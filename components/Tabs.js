import React from 'react';
import { StyleSheet, Dimensions, FlatList, Animated, View } from 'react-native';

const { width } = Dimensions.get('screen');

// Define theme constants internally
const COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  SECONDARY: '#F7FAFC',
  ACTIVE: '#5E72E4',
  MUTED: '#8898AA'
};

const SIZES = {
  BASE: 16
};

const defaultMenu = [
  { id: 'popular', title: 'Popular', },
  { id: 'beauty', title: 'Beauty', },
  { id: 'cars', title: 'Cars', },
  { id: 'motocycles', title: 'Motocycles', },
];

export default class Tabs extends React.Component {
  static defaultProps = {
    data: defaultMenu,
    initialIndex: null,
  }

  state = {
    active: null,
  }

  componentDidMount() {
    const { initialIndex } = this.props;
    initialIndex && this.selectMenu(initialIndex);
  }

  animatedValue = new Animated.Value(1);

  animate() {
    this.animatedValue.setValue(0);

    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false, // color not supported
    }).start()
  }

  menuRef = React.createRef();

  onScrollToIndexFailed = () => {
    this.menuRef.current.scrollToIndex({
      index: 0,
      viewPosition: 0.5
    });
  }

  selectMenu = (id) => {
    this.setState({ active: id });

    this.menuRef.current.scrollToIndex({
      index: this.props.data.findIndex(item => item.id === id),
      viewPosition: 0.5
    });

    this.animate();
    this.props.onChange && this.props.onChange(id);
  }

  renderItem = (item) => {
    const isActive = this.state.active === item.id;

    const textColor = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [COLORS.BLACK, isActive ? COLORS.WHITE : COLORS.BLACK],
      extrapolate: 'clamp',
    });
    
    const containerStyles = [
      styles.titleContainer,
      !isActive && { backgroundColor: COLORS.SECONDARY },
      isActive && styles.containerShadow
    ];

    return (
      <View style={containerStyles}>
        <Animated.Text
          style={[
            styles.menuTitle,
            { color: textColor }
          ]}
          onPress={() => this.selectMenu(item.id)}>
          {item.title}
        </Animated.Text>
      </View>
    )
  }

  renderMenu = () => {
    const { data, ...props } = this.props;

    return (
      <FlatList
        {...props}
        data={data}
        horizontal={true}
        ref={this.menuRef}
        extraData={this.state}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        onScrollToIndexFailed={this.onScrollToIndexFailed}
        renderItem={({ item }) => this.renderItem(item)}
        contentContainerStyle={styles.menu}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderMenu()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: COLORS.WHITE,
    zIndex: 2,
  },
  shadow: {
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 4,
  },
  menu: {
    paddingHorizontal: SIZES.BASE * 2.5,
    paddingTop: 8,
    paddingBottom: 16,
  },
  titleContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.ACTIVE,
    borderRadius: 4,
    marginRight: 9
  },
  containerShadow: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 1,
  },
  menuTitle: {
    fontWeight: '600',
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    color: COLORS.MUTED
  },
});