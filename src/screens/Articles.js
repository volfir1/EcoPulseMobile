import React from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { Text, Surface } from "react-native-paper";

import { Images, articles } from "../constants/";
import { Card } from "../components/";

const { width } = Dimensions.get("screen");

// Define theme constants internally
const SIZES = {
  BASE: 16
};

const COLORS = {
  WHITE: '#FFFFFF',
  PRIMARY: '#5E72E4',
  MUTED: '#8898AA',
  HEADER: '#172B4D'
};

const thumbMeasure = (width - 48 - 32) / 3;
const cardWidth = width - SIZES.BASE * 2;
const categories = [
  {
    title: "Clean Energy",
    description: "Clean energy refers to renewable energy sources such as solar, wind, and hydro power, which produce little to no environmental impact. These sustainable solutions help reduce carbon emissions and promote a greener future.",
    image:
      "https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?q=80&w=1924&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // price: "$125",
  },
  {
    title: "Events",
    description:
      "Rock music is a genre of popular music. It developed during and after the 1960s in the United Kingdom.",
    image:
      "https://images.unsplash.com/photo-1543747579-795b9c2c3ada?fit=crop&w=840&q=80",
    // price: "$35",
  },
];

class Articles extends React.Component {
  renderProduct = (item, index) => {
    const { navigation } = this.props;

    return (
      <TouchableWithoutFeedback
        style={{ zIndex: 3 }}
        key={`product-${item.title}`}
        onPress={() => navigation.navigate("Pro", { product: item })}
      >
        <Surface style={styles.productItem}>
          <View style={{ alignItems: 'center' }}>
            <Image
              resizeMode="cover"
              style={styles.productImage}
              source={{ uri: item.image }}
            />
            <View style={{ paddingHorizontal: SIZES.BASE, alignItems: 'center' }}>
              <Text
                style={[styles.productPrice, { color: COLORS.MUTED, textAlign: 'center' }]}
              >
                {item.price}
              </Text>
              <Text style={{ fontSize: 34, textAlign: 'center' }}>
                {item.title}
              </Text>
              <Text
                style={[styles.productDescription, { color: COLORS.MUTED, textAlign: 'center' }]}
              >
                {item.description}
              </Text>
            </View>
          </View>
        </Surface>
      </TouchableWithoutFeedback>
    );
  };

  renderCards = () => {
    return (
      <View style={styles.group}>
        <Text style={[styles.title, { fontWeight: 'bold', fontSize: 16 }]}>
          Cards
        </Text>
        <View style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: SIZES.BASE }}>
            <Card item={articles[0]} horizontal />
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <Card
                item={articles[1]}
                style={{ marginRight: SIZES.BASE }}
              />
              <Card item={articles[2]} />
            </View>
            <Card item={articles[4]} full />
            <Surface style={styles.category}>
              <ImageBackground
                source={{ uri: Images.Products["View article"] }}
                style={[
                  styles.imageBlock,
                  { width: width - SIZES.BASE * 2, height: 252 },
                ]}
                imageStyle={{
                  width: width - SIZES.BASE * 2,
                  height: 252,
                }}
              >
                <View style={styles.categoryTitle}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.WHITE }}>
                    View article
                  </Text>
                </View>
              </ImageBackground>
            </Surface>
          </View>
          <View style={{ flex: 1, marginTop: SIZES.BASE / 2 }}>
            <ScrollView
              horizontal={true}
              pagingEnabled={true}
              decelerationRate={0}
              scrollEventThrottle={16}
              snapToAlignment="center"
              showsHorizontalScrollIndicator={false}
              snapToInterval={cardWidth + SIZES.BASE * 0.375}
              contentContainerStyle={{
                paddingHorizontal: SIZES.BASE / 2,
              }}
            >
              {categories &&
                categories.map((item, index) =>
                  this.renderProduct(item, index)
                )}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  };

  renderAlbum = () => {
    const { navigation } = this.props;

    return (
      <View
        style={[styles.group, { paddingBottom: SIZES.BASE * 5 }]}
      >
        <Text style={[styles.title, { fontWeight: 'bold', fontSize: 16 }]}>
          Album
        </Text>
        <View style={{ marginHorizontal: SIZES.BASE * 2 }}>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text
              style={{ fontSize: 12, color: COLORS.PRIMARY }}
              onPress={() => navigation.navigate("Home")}
            >
              View All
            </Text>
          </View>
          <View
            style={{ 
              marginTop: SIZES.BASE, 
              flexDirection: 'row', 
              justifyContent: 'space-between',
              flexWrap: "wrap" 
            }}
          >
            {Images.Viewed.map((img, index) => (
              <View key={`viewed-${img}`} style={styles.shadow}>
                <Image
                  resizeMode="cover"
                  source={{ uri: img }}
                  style={styles.albumThumb}
                />
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderCards()}
          {this.renderAlbum()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    paddingBottom: SIZES.BASE,
    paddingHorizontal: SIZES.BASE * 2,
    marginTop: 22,
    color: COLORS.HEADER,
  },
  group: {
    paddingTop: SIZES.BASE,
    flex: 1
  },
  albumThumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure,
  },
  category: {
    backgroundColor: COLORS.WHITE,
    marginVertical: SIZES.BASE / 2,
    borderWidth: 0,
    elevation: 1
  },
  categoryTitle: {
    height: "100%",
    paddingHorizontal: SIZES.BASE,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageBlock: {
    overflow: "hidden",
    borderRadius: 4,
  },
  productItem: {
    width: cardWidth - SIZES.BASE * 2,
    marginHorizontal: SIZES.BASE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 7 },
    shadowRadius: 10,
    shadowOpacity: 0.2,
    elevation: 3
  },
  productImage: {
    width: cardWidth - SIZES.BASE,
    height: cardWidth - SIZES.BASE,
    borderRadius: 3,
  },
  productPrice: {
    paddingTop: SIZES.BASE,
    paddingBottom: SIZES.BASE / 2,
    fontSize: 16
  },
  productDescription: {
    paddingTop: SIZES.BASE,
    fontSize: 16
  },
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
});

export default Articles;