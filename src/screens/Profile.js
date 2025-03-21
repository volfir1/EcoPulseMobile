import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Alert,
  Image
} from "react-native";
import Header from "@components/Header";
import { useAuth } from "../context/AuthContext";
// import { useProfile } from "../context/ProfileContext"; // Comment this out for now

const { width, height } = Dimensions.get("screen");

// Green theme colors
const greenTheme = {
  PRIMARY: '#2E7D32',
  SECONDARY: '#4CAF50',
  LIGHT: '#81C784',
  BACKGROUND: '#E8F5E9',
  TEXT: '#212121',
  WHITE: '#FFFFFF',
  GRAY: '#757575',
  LIGHT_GRAY: '#EEEEEE',
  ERROR: '#FF5252'
};

const Profile = ({ navigation }) => {
  // Use Auth context instead until ProfileContext is properly set up
  const { user, logout } = useAuth();
  
  // Local state to manage profile data
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  
  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',

      });
    }
  }, [user]);

  // Handle text input changes
  const handleInputChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle edit profile
  const handleSubmit = async () => {
    // For now, just show a message since the context isn't ready
    Alert.alert('Success', 'Profile update functionality will be available soon');
    setIsEditing(false);
  };

  // Handle password reset
  const handlePasswordReset = () => {
    Alert.alert('Coming Soon', 'Password reset functionality will be available soon');
  };

  

  // Show loading indicator if no user data
  if (loading || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={greenTheme.PRIMARY} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
    
    <Header title={'Manage Profile'}/>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Profile Picture Section */}
          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <Image 
                source={{ uri: user.avatar }} 
                style={styles.avatar} 
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user?.firstName?.charAt(0) || ''}
                  {user?.lastName?.charAt(0) || ''}
                </Text>
              </View>
            )}
          </View>

          {/* User Info Form */}
          {isEditing ? (
            <View style={styles.formContainer}>
              <Text style={styles.formLabel}>First Name</Text>
              <TextInput
                style={styles.textInput}
                value={formData.firstName}
                onChangeText={(text) => handleInputChange('firstName', text)}
                placeholder="First Name"
              />
              
              <Text style={styles.formLabel}>Last Name</Text>
              <TextInput
                style={styles.textInput}
                value={formData.lastName}
                onChangeText={(text) => handleInputChange('lastName', text)}
                placeholder="Last Name"
              />
              
              <Text style={styles.formLabel}>Email</Text>
              <TextInput
                style={[styles.textInput, { color: greenTheme.GRAY }]}
                value={formData.email}
                editable={false}
                placeholder="Email"
              />
              
            
             
              
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.saveButton]} 
                  onPress={handleSubmit}
                >
                  <Text style={[styles.buttonText, { color: 'white' }]}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* User Info Display */
            <View style={styles.userInfoSection}>
              <View style={styles.nameContainer}>
                <Text style={styles.nameText}>{user?.firstName} {user?.lastName}</Text>
                <Text style={styles.emailText}>{user?.email}</Text>
                {user?.phone && (
                  <Text style={styles.phoneText}>{user?.phone}</Text>
                )}
              </View>
              
              <TouchableOpacity 
                style={styles.editButton} 
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.divider} />
          
          {/* Settings Section */}
          <View style={styles.settingsSection}>
            <TouchableOpacity 
              style={styles.settingOption} 
              onPress={handlePasswordReset}
            >
              <View style={styles.settingRow}>
                <Text style={styles.settingText}>Reset Password</Text>
                <Text style={styles.chevron}>›</Text>
              </View>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: greenTheme.BACKGROUND,
    top: 20
  },
  scrollView: {
    width: width
  },
  scrollContent: {
    paddingBottom: 30
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: greenTheme.PRIMARY
  },
  profileCard: {
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: greenTheme.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 3
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: greenTheme.LIGHT_GRAY
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: greenTheme.LIGHT,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: greenTheme.WHITE
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
  phoneText: {
    fontSize: 14,
    color: greenTheme.GRAY,
    marginBottom: 8,
    textAlign: 'center'
  },
  editButton: {
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: greenTheme.LIGHT,
    borderRadius: 20
  },
  editButtonText: {
    color: greenTheme.PRIMARY,
    fontWeight: 'bold'
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 15
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
    color: greenTheme.ERROR
  },
  deleteChevron: {
    fontSize: 22,
    color: greenTheme.ERROR
  },
  formContainer: {
    marginTop: 20
  },
  formLabel: {
    fontSize: 14,
    color: greenTheme.GRAY,
    marginBottom: 5,
    marginLeft: 5
  },
  textInput: {
    backgroundColor: greenTheme.LIGHT_GRAY,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  button: {
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5
  },
  cancelButton: {
    backgroundColor: greenTheme.LIGHT_GRAY
  },
  saveButton: {
    backgroundColor: greenTheme.PRIMARY
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: greenTheme.TEXT
  }
});

export default Profile;