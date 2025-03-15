import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions, Image, TouchableWithoutFeedback, View } from 'react-native';
import { Card as PaperCard, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// Define theme constants internally
const COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  ACTIVE: '#4F8CF6', // This replaces argonTheme.COLORS.ACTIVE
};

const SIZES = {
  BASE: 16,
};

function Card(props) {
  const navigation = useNavigation();
  const { item, horizontal, full, style, ctaColor, imageStyle } = props;
  
  const imageStyles = [
    full ? styles.fullImage : styles.horizontalImage,
    imageStyle
  ];
  const cardContainer = [styles.card, styles.shadow, style];
  const imgContainer = [styles.imageContainer,
    horizontal ? styles.horizontalStyles : styles.verticalStyles,
    styles.shadow
  ];

  return (
    <PaperCard style={cardContainer}>
      <View style={{ flexDirection: horizontal ? 'row' : 'column', flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Pro')}>
          <View style={imgContainer}>
            <Image source={{uri: item.image}} style={imageStyles} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Pro')}>
          <View style={styles.cardDescription}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={[styles.cardCta, { color: ctaColor || COLORS.ACTIVE }]}>{item.cta}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </PaperCard>
  );
}

Card.propTypes = {
  item: PropTypes.object,
  horizontal: PropTypes.bool,
  full: PropTypes.bool,
  ctaColor: PropTypes.string,
  imageStyle: PropTypes.any,
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.WHITE,
    marginVertical: SIZES.BASE,
    borderWidth: 0,
    minHeight: 114,
    marginBottom: 16
  },
  cardTitle: {
    flex: 1,
    flexWrap: 'wrap',
    paddingBottom: 6,
    fontSize: 14
  },
  cardCta: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  cardDescription: {
    padding: SIZES.BASE / 2,
    flex: 1,
    justifyContent: 'space-between'
  },
  imageContainer: {
    borderRadius: 3,
    elevation: 1,
    overflow: 'hidden',
  },
  horizontalImage: {
    height: 122,
    width: 'auto',
  },
  horizontalStyles: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  verticalStyles: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0
  },
  fullImage: {
    height: 215
  },
  shadow: {
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
});

export default Card;