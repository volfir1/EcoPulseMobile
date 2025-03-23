// src/features/profile/Profile.jsx
import React from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Image
} from "react-native";
import Header from "@components/Header";
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from "hooks/useProfile";
import styles, { greenTheme } from 'styles/ProfileStyles';
import CloudinaryImage from 'utils/CloudinaryImage'; // Adjust the path as needed
import { useNavigation } from '@react-navigation/native';

const Profile = ({ navigation }) => {
  // Use the custom hook to handle all the logic
  const {
    user,
    loading,
    uploadProgress,
    isEditing,
    showAvatarModal,
    formData,
    tokenStatus,
    selectedAvatar,
    customAvatar,
    defaultAvatars,
    avatarRefreshKey,
    setIsEditing,
    handleInputChange,
    handleAvatarSelect,
    pickImage,
    toggleAvatarModal,
    handleSubmit,
    handlePasswordReset,
    getAvatarInfo,
    isCloudinaryUrl
  } = useProfile(navigation);


  // Render avatar based on info from the hook
  const renderAvatar = () => {
    const avatarInfo = getAvatarInfo();
    
    // For custom avatars from Cloudinary
    if (avatarInfo.type === 'custom' && avatarInfo.isCloudinary) {
      return (
        <CloudinaryImage 
          source={{ uri: avatarInfo.uri }}
          style={styles.avatar}
          refreshKey={avatarRefreshKey}
          forceRefresh={true}
          resizeMode="cover"
        />
      );
    }
    // For local file URIs (from image picker)
    else if (avatarInfo.type === 'custom') {
      return <Image source={{ uri: avatarInfo.uri }} style={styles.avatar} />;
    }
    // For default avatar images (from assets)
    else if (avatarInfo.type === 'default') {
      return <Image source={avatarInfo.image} style={styles.avatar} />;
    }
    // Fallback to initials
    else {
      return (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{avatarInfo.initials}</Text>
        </View>
      );
    }
  };
  
  // Render the avatar selection modal
  const renderAvatarModal = () => {
    if (!isEditing || !showAvatarModal) return null;
    
    return (
      <View style={styles.avatarModal}>
        <Text style={styles.avatarModalTitle}>Choose Your Avatar</Text>
        
        <View style={styles.avatarGrid}>
          {defaultAvatars.map((avatar) => (
            <TouchableOpacity
              key={avatar.id}
              style={[
                styles.avatarOption,
                selectedAvatar === avatar.id && styles.selectedAvatarOption
              ]}
              onPress={() => handleAvatarSelect(avatar.id)}
            >
              <Image 
                source={avatar.image} 
                style={styles.defaultAvatarImage} 
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
          
          {/* Custom avatar upload option */}
          <TouchableOpacity
            style={[
              styles.avatarOption,
              customAvatar && styles.selectedAvatarOption
            ]}
            onPress={pickImage}
          >
            {customAvatar ? (
              isCloudinaryUrl && isCloudinaryUrl(customAvatar) ? (
                <CloudinaryImage
                  source={{ uri: customAvatar }}
                  style={styles.avatarImage}
                  refreshKey={avatarRefreshKey}
                  forceRefresh={true}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={{ uri: customAvatar }}
                  style={styles.avatarImage}
                />
              )
            ) : (
              <View style={styles.uploadAvatarPlaceholder}>
                <Ionicons name="add-circle-outline" size={24} color={greenTheme.PRIMARY} />
                <Text style={styles.uploadText}>Upload</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        {uploadProgress > 0 && uploadProgress < 100 && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
            <Text style={styles.progressText}>{`Uploading... ${uploadProgress}%`}</Text>
          </View>
        )}
        
        <TouchableOpacity
          style={styles.closeModalButton}
          onPress={toggleAvatarModal}
        >
          <Text style={styles.closeModalText}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  // Show loading indicator if loading and not editing
  if (loading && !isEditing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={greenTheme.PRIMARY} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Show login prompt if no user
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Please log in to view your profile</Text>
          <TouchableOpacity
            style={[styles.button, { marginTop: 20, backgroundColor: greenTheme.PRIMARY }]}
            onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
          >
            <Text style={[styles.buttonText, { color: 'white' }]}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  const navigateToChangePassword = () => {
    navigation.navigate('ChangePassword');
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header title={'Manage Profile'}/>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Debug Token Info - only in development */}
        {__DEV__ && (
          <View style={styles.debugContainer}>
            <Text style={styles.debugText}>Status: {tokenStatus}</Text>
          </View>
        )}
      
        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Profile Picture Section */}
          <View style={styles.avatarContainer}>
            {isEditing ? (
              <TouchableOpacity onPress={toggleAvatarModal} style={styles.avatarEditContainer}>
                {renderAvatar()}
                <View style={styles.editAvatarBadge}>
                  <Ionicons name="camera" size={18} color="white" />
                </View>
              </TouchableOpacity>
            ) : (
              renderAvatar()
            )}
          </View>
          
          {/* Avatar Selection Modal */}
          {renderAvatarModal()}

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
           
           <Text style={styles.formLabel}>Gender</Text>
           <View style={styles.genderContainer}>
             {['male', 'female', 'prefer-not-to-say'].map((option) => (
               <TouchableOpacity
                 key={option}
                 style={[
                   styles.genderOption,
                   formData.gender === option && styles.genderOptionSelected
                 ]}
                 onPress={() => handleInputChange('gender', option)}
               >
                 <Text 
                   style={[
                     styles.genderText,
                     formData.gender === option && styles.genderTextSelected
                   ]}
                 >
                   {option === 'prefer-not-to-say' ? 'Prefer not to say' : 
                     option.charAt(0).toUpperCase() + option.slice(1)}
                 </Text>
               </TouchableOpacity>
             ))}
           </View>
           
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
               disabled={loading}
             >
               {loading ? (
                 <ActivityIndicator size="small" color="white" />
               ) : (
                 <Text style={[styles.buttonText, { color: 'white' }]}>Save</Text>
               )}
             </TouchableOpacity>
           </View>
         </View>
          ) : (
            /* User Info Display */
            <View style={styles.userInfoSection}>
              <View style={styles.nameContainer}>
                <Text style={styles.nameText}>{user?.firstName} {user?.lastName}</Text>
                <Text style={styles.emailText}>{user?.email}</Text>
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
  onPress={navigateToChangePassword}
>
  <View style={styles.settingRow}>
    <Ionicons name="key-outline" size={22} color="#1F2937" />
    <Text style={styles.settingText}>Change Password</Text>
    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
  </View>
</TouchableOpacity>
            
            <View style={styles.divider} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;