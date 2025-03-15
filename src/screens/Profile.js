import React from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  SafeAreaView
} from "react-native";

const { width, height } = Dimensions.get("screen");

// Green theme colors
const greenTheme = {
  PRIMARY: '#2E7D32',
  SECONDARY: '#4CAF50',
  LIGHT: '#81C784',
  BACKGROUND: '#E8F5E9',
  TEXT: '#212121',
  WHITE: '#FFFFFF'
};

const Profile = () => {
  // Dummy user data - replace with your actual user state
  const userData = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com"
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.profileCard}>
          {/* User Info Section */}
          <View style={styles.userInfoSection}>
            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>{userData.firstName} {userData.lastName}</Text>
              <Text style={styles.emailText}>{userData.email}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          {/* Settings Section */}
          <View style={styles.settingsSection}>
            <TouchableOpacity 
              style={styles.settingOption} 
              onPress={() => console.log('Reset Password')}
            >
              <View style={styles.settingRow}>
                <Text style={styles.settingText}>Reset Password</Text>
                <Text style={styles.chevron}>›</Text>
              </View>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.settingOption} 
              onPress={() => console.log('Delete Account')}
            >
              <View style={styles.settingRow}>
                <Text style={styles.deleteText}>Delete Account</Text>
                <Text style={styles.deleteChevron}>›</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// No need for custom Text component as we're importing from react-native

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: greenTheme.BACKGROUND
  },
  scrollView: {
    width: width
  },
  profileCard: {
    padding: 20,
    marginHorizontal: 20,
    marginTop: 40,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: greenTheme.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 3
  },
  userInfoSection: {
    alignItems: 'center',
    marginVertical: 20
  },
  nameContainer: {
    alignItems: 'center'
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: greenTheme.TEXT,
    marginBottom: 8,
    textAlign: 'center'
  },
  emailText: {
    fontSize: 16,
    color: greenTheme.PRIMARY,
    marginBottom: 8,
    textAlign: 'center'
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 10
  },
  settingsSection: {
    marginTop: 10
  },
  settingOption: {
    paddingVertical: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  settingText: {
    fontSize: 16,
    color: greenTheme.TEXT
  },
  chevron: {
    fontSize: 22,
    color: greenTheme.SECONDARY
  },
  deleteText: {
    fontSize: 16,
    color: '#FF5252'
  },
  deleteChevron: {
    fontSize: 22,
    color: '#FF5252'
  }
});

export default Profile;