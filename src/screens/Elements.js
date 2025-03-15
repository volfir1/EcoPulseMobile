import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { Text, Button as PaperButton, Surface } from "react-native-paper";

// Import your converted components
import { Button, Header, Icon, Input, Select, Switch } from "../components/";
import { tabs } from "../constants/";

const { width } = Dimensions.get("screen");

// Define theme constants internally
const SIZES = {
  BASE: 16
};

const COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  HEADER: '#172B4D',
  DEFAULT: '#172B4D',
  PRIMARY: '#5E72E4',
  SECONDARY: '#F7FAFC',
  INFO: '#11CDEF',
  SUCCESS: '#2DCE89',
  WARNING: '#FB6340',
  ERROR: '#F5365C',
  INPUT_SUCCESS: '#2DCE89',
  INPUT_ERROR: '#FB6340',
  PLACEHOLDER: '#ADB5BD',
  ICON: '#172B4D',
  ACTIVE: '#5E72E4',
  FACEBOOK: '#3B5998',
  TWITTER: '#55ACEE',
  DRIBBBLE: '#EA4C89',
  MUTED: '#8898AA'
};

class Elements extends React.Component {
  state = {
    "switch-1": true,
    "switch-2": false,
  };

  toggleSwitch = (switchId) =>
    this.setState({ [switchId]: !this.state[switchId] });

  renderButtons = () => {
    return (
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { fontWeight: 'bold', fontSize: 16 }]}>
          Buttons
        </Text>
        <View style={{ paddingHorizontal: SIZES.BASE }}>
          <View style={{ alignItems: 'center' }}>
            <Button color="default" style={styles.button}>
              DEFAULT
            </Button>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Button
              color="secondary"
              textStyle={{ color: "black", fontSize: 12, fontWeight: "700" }}
              style={styles.button}
            >
              SECONDARY
            </Button>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Button style={styles.button}>PRIMARY</Button>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Button color="info" style={styles.button}>
              INFO
            </Button>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Button color="success" style={styles.button}>
              SUCCESS
            </Button>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Button color="warning" style={styles.button}>
              WARNING
            </Button>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Button color="error" style={styles.button}>
              ERROR
            </Button>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <View style={{ flex: 1, alignItems: 'flex-start', marginTop: 8 }}>
              <Select
                defaultIndex={1}
                options={["01", "02", "03", "04", "05"]}
              />
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Button small center color="default" style={styles.optionsButton}>
                DELETE
              </Button>
            </View>
            <View style={{ flex: 1.25, alignItems: 'flex-end' }}>
              <Button center color="default" style={styles.optionsButton}>
                SAVE FOR LATER
              </Button>
            </View>
          </View>
        </View>
      </View>
    );
  };

  renderText = () => {
    return (
      <View style={styles.group}>
        <Text style={[styles.title, { fontWeight: 'bold', fontSize: 16 }]}>
          Typography
        </Text>
        <View style={{ paddingHorizontal: SIZES.BASE }}>
          <Text
            style={{ fontSize: 32, marginBottom: SIZES.BASE / 2, color: COLORS.DEFAULT }}
          >
            Heading 1
          </Text>
          <Text
            style={{ fontSize: 26, marginBottom: SIZES.BASE / 2, color: COLORS.DEFAULT }}
          >
            Heading 2
          </Text>
          <Text
            style={{ fontSize: 22, marginBottom: SIZES.BASE / 2, color: COLORS.DEFAULT }}
          >
            Heading 3
          </Text>
          <Text
            style={{ fontSize: 18, marginBottom: SIZES.BASE / 2, color: COLORS.DEFAULT }}
          >
            Heading 4
          </Text>
          <Text
            style={{ fontSize: 16, marginBottom: SIZES.BASE / 2, color: COLORS.DEFAULT }}
          >
            Heading 5
          </Text>
          <Text
            style={{ fontSize: 14, marginBottom: SIZES.BASE / 2, color: COLORS.DEFAULT }}
          >
            Paragraph
          </Text>
          <Text style={{ color: COLORS.MUTED }}>This is a muted paragraph.</Text>
        </View>
      </View>
    );
  };

  renderInputs = () => {
    return (
      <View style={styles.group}>
        <Text style={[styles.title, { fontWeight: 'bold', fontSize: 16 }]}>
          Inputs
        </Text>
        <View style={{ paddingHorizontal: SIZES.BASE }}>
          <Input right placeholder="Regular" iconContent={<View />} />
        </View>
        <View style={{ paddingHorizontal: SIZES.BASE }}>
          <Input
            right
            placeholder="Regular Custom"
            style={{
              borderColor: COLORS.INFO,
              borderRadius: 4,
              backgroundColor: "#fff",
            }}
            iconContent={<View />}
          />
        </View>
        <View style={{ paddingHorizontal: SIZES.BASE }}>
          <Input
            placeholder="Icon left"
            iconContent={
              <Icon
                size={11}
                style={{ marginRight: 10 }}
                color={COLORS.ICON}
                name="search-zoom-in"
                family="ArgonExtra"
              />
            }
          />
        </View>
        <View style={{ paddingHorizontal: SIZES.BASE }}>
          <Input
            right
            placeholder="Icon Right"
            iconContent={
              <Icon
                size={11}
                color={COLORS.ICON}
                name="search-zoom-in"
                family="ArgonExtra"
              />
            }
          />
        </View>
        <View style={{ paddingHorizontal: SIZES.BASE }}>
          <Input
            success
            right
            placeholder="Success"
            iconContent={
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: COLORS.INPUT_SUCCESS,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Icon
                  size={11}
                  color={COLORS.ICON}
                  name="g-check"
                  family="ArgonExtra"
                />
              </View>
            }
          />
        </View>
        <View style={{ paddingHorizontal: SIZES.BASE }}>
          <Input
            error
            right
            placeholder="Error Input"
            iconContent={
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: COLORS.INPUT_ERROR,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Icon
                  size={11}
                  color={COLORS.ICON}
                  name="support"
                  family="ArgonExtra"
                />
              </View>
            }
          />
        </View>
      </View>
    );
  };

  renderSwitches = () => {
    return (
      <View style={styles.group}>
        <Text style={[styles.title, { fontWeight: 'bold', fontSize: 16 }]}>
          Switches
        </Text>
        <View style={{ paddingHorizontal: SIZES.BASE }}>
          <View
            style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: SIZES.BASE 
            }}
          >
            <Text style={{ fontSize: 14 }}>Switch is ON</Text>
            <Switch
              value={this.state["switch-1"]}
              onValueChange={() => this.toggleSwitch("switch-1")}
            />
          </View>
          <View
            style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}
          >
            <Text style={{ fontSize: 14 }}>Switch is OFF</Text>
            <Switch
              value={this.state["switch-2"]}
              onValueChange={() => this.toggleSwitch("switch-2")}
            />
          </View>
        </View>
      </View>
    );
  };

  renderTableCell = () => {
    const { navigation } = this.props;
    return (
      <View style={styles.group}>
        <Text style={[styles.title, { fontWeight: 'bold', fontSize: 16 }]}>
          Table Cell
        </Text>
        <View style={{ paddingHorizontal: SIZES.BASE }}>
          <View style={styles.rows}>
            <TouchableOpacity onPress={() => navigation.navigate("Pro")}>
              <View 
                style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  justifyContent: 'space-between', 
                  paddingTop: 7 
                }}
              >
                <Text style={{ fontSize: 14 }}>Manage Options</Text>
                <Icon
                  name="chevron-right"
                  family="entypo"
                  style={{ paddingRight: 5 }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  renderSocial = () => {
    return (
      <View style={styles.group}>
        <Text style={[styles.title, { fontWeight: 'bold', fontSize: 16 }]}>
          Social
        </Text>
        <View style={{ paddingHorizontal: SIZES.BASE }}>
          <View 
            style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <PaperButton
                mode="contained"
                style={[styles.social, styles.shadow, { backgroundColor: COLORS.FACEBOOK }]}
                icon="facebook"
              />
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <PaperButton
                mode="contained"
                style={[styles.social, styles.shadow, { backgroundColor: COLORS.TWITTER }]}
                icon="twitter"
              />
            </View>
            <View style={{ flex: 1, alignItems: 'flex-start' }}>
              <PaperButton
                mode="contained"
                style={[styles.social, styles.shadow, { backgroundColor: COLORS.DRIBBBLE }]}
                icon="dribbble"
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  renderNavigation = () => {
    return (
      <View style={styles.group}>
        <Text style={[styles.title, { fontWeight: 'bold', fontSize: 16 }]}>
          Navigation
        </Text>
        <View>
          <View style={{ marginBottom: SIZES.BASE }}>
            <Header back title="Title" navigation={this.props.navigation} />
          </View>

          <View style={{ marginBottom: SIZES.BASE }}>
            <Header
              white
              back
              title="Title"
              navigation={this.props.navigation}
              bgColor={COLORS.ACTIVE}
              titleColor="white"
              iconColor="white"
            />
          </View>

          <View style={{ marginBottom: SIZES.BASE }}>
            <Header search title="Title" navigation={this.props.navigation} />
          </View>

          <View style={{ marginBottom: SIZES.BASE }}>
            <Header
              tabs={tabs.categories}
              search
              title="Title"
              navigation={this.props.navigation}
            />
          </View>

          <View style={{ marginBottom: SIZES.BASE }}>
            <Header
              options
              search
              title="Title"
              optionLeft="Option 1"
              optionRight="Option 2"
              navigation={this.props.navigation}
            />
          </View>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30, width }}
        >
          {this.renderButtons()}
          {this.renderText()}
          {this.renderInputs()}
          {this.renderSocial()}
          {this.renderSwitches()}
          {this.renderNavigation()}
          {this.renderTableCell()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    paddingBottom: SIZES.BASE,
    paddingHorizontal: SIZES.BASE * 2,
    marginTop: 44,
    color: COLORS.HEADER,
  },
  group: {
    paddingTop: SIZES.BASE * 2,
    flex: 1
  },
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.2,
    elevation: 2,
  },
  button: {
    marginBottom: SIZES.BASE,
    width: width - SIZES.BASE * 2,
  },
  optionsButton: {
    width: "auto",
    height: 34,
    paddingHorizontal: SIZES.BASE,
    paddingVertical: 10,
  },
  input: {
    borderBottomWidth: 1,
  },
  inputDefault: {
    borderBottomColor: COLORS.PLACEHOLDER,
  },
  inputTheme: {
    borderBottomColor: COLORS.PRIMARY,
  },
  inputInfo: {
    borderBottomColor: COLORS.INFO,
  },
  inputSuccess: {
    borderBottomColor: COLORS.SUCCESS,
  },
  inputWarning: {
    borderBottomColor: COLORS.WARNING,
  },
  inputDanger: {
    borderBottomColor: COLORS.ERROR,
  },
  social: {
    width: SIZES.BASE * 3.5,
    height: SIZES.BASE * 3.5,
    borderRadius: SIZES.BASE * 1.75,
    justifyContent: "center",
  },
});

export default Elements;