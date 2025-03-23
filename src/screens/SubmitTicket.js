import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useSupportScreen } from 'hooks/supportHook';
import styles from 'styles/supportStyles';
import { useAuth } from '../context/AuthContext';
import AuthAwareScreen from './AuthAwareScreem';

const SupportScreen = ({ navigation }) => {
  const {
    subject,
    setSubject,
    email,
    setEmail,
    category,
    setCategory,
    priority,
    setPriority,
    description,
    setDescription,
    errors,
    activePanel,
    setActivePanel,
    expandedQuestions,
    showCategoryDropdown,
    setShowCategoryDropdown,
    showPriorityDropdown,
    setShowPriorityDropdown,
    isSubmitting,
    userData,
    translateY,
    opacity,
    categories,
    priorities,
    faqSections,
    validateForm,
    handleSubmit,
    toggleQuestion
  } = useSupportScreen(navigation);

  // Get auth status from context
  const { isAuthenticated } = useAuth();

  const renderFAQPanel = () => (
    <Animated.View 
      style={[
        styles.panel,
        { transform: [{ translateY }], opacity }
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {faqSections.map((section, index) => (
          <View key={`section-${index}`} style={styles.faqSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            
            {section.questions.map((faqItem) => (
              <View key={faqItem.id} style={styles.faqItemContainer}>
                <TouchableOpacity 
                  style={styles.questionContainer}
                  onPress={() => toggleQuestion(faqItem.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.questionInner}>
                    <Ionicons 
                      name="help-circle-outline" 
                      size={20} 
                      color="#4CAF50" 
                      style={styles.questionIcon}
                    />
                    <Text style={styles.question}>{faqItem.question}</Text>
                  </View>
                  <Ionicons 
                    name={expandedQuestions[faqItem.id] ? "chevron-up" : "chevron-down"} 
                    size={24} 
                    color="#555"
                  />
                </TouchableOpacity>
                
                {expandedQuestions[faqItem.id] && (
                  <Animated.View 
                    style={styles.answerContainer}
                  >
                    <Text style={styles.answer}>{faqItem.answer}</Text>
                  </Animated.View>
                )}
                
                <View style={styles.divider} />
              </View>
            ))}
          </View>
        ))}
        
        <View style={styles.supportInfoContainer}>
          <View style={styles.supportInfoHeader}>
            <Ionicons name="headset" size={24} color="#fff" />
            <Text style={styles.supportInfoTitle}>Contact Support</Text>
          </View>
          
          <View style={styles.supportInfoContent}>
            <View style={styles.supportInfoItem}>
              <Ionicons name="mail" size={20} color="#4CAF50" />
              <Text style={styles.supportInfoText}>eco-plus-support@gmail.com</Text>
            </View>
            
            <View style={styles.supportInfoItem}>
              <Ionicons name="call" size={20} color="#4CAF50" />
              <Text style={styles.supportInfoText}>+1 (555) 123-4567</Text>
            </View>
            
            <View style={styles.supportInfoItem}>
              <Ionicons name="chatbubbles" size={20} color="#4CAF50" />
              <Text style={styles.supportInfoText}>Live Chat: Available 24/7</Text>
            </View>
            
            <View style={styles.supportInfoItem}>
              <Ionicons name="time" size={20} color="#4CAF50" />
              <Text style={styles.supportInfoText}>Response Time: Within 24 hours</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.viewTicketsButton}
            onPress={() => navigation.navigate('Tickets')}
          >
            <Ionicons name="list" size={20} color="#fff" />
            <Text style={styles.viewTicketsText}>View My Tickets</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Animated.View>
  );

  const renderSubmitTicketPanel = () => (
    <Animated.View 
      style={[
        styles.formContainer,
        { transform: [{ translateY }], opacity }
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <Text style={styles.formTitle}>Submit a Support Ticket</Text>
          
          {!isAuthenticated && (
            <View style={styles.authWarning}>
              <Ionicons name="warning" size={24} color="#FFC107" />
              <Text style={styles.authWarningText}>
                You must be logged in to submit a ticket.
              </Text>
              <TouchableOpacity 
                style={styles.loginButton}
                onPress={() => navigation.navigate('Login', { returnTo: 'Support' })}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Subject</Text>
            <View style={[styles.inputContainer, errors.subject && styles.inputError]}>
              <Ionicons name="create" size={20} color="#757575" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Brief description of your issue"
                placeholderTextColor="#9e9e9e"
                value={subject}
                onChangeText={setSubject}
                editable={isAuthenticated}
              />
            </View>
            {errors.subject && <Text style={styles.errorText}>{errors.subject}</Text>}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputContainer, errors.email && styles.inputError]}>
              <Ionicons name="mail" size={20} color="#757575" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="your.email@example.com"
                placeholderTextColor="#9e9e9e"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                editable={!isAuthenticated} // Make email non-editable if user is authenticated
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.dropdownWrapper}>
              <TouchableOpacity
                style={[styles.inputContainer, errors.category && styles.inputError]}
                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                disabled={!isAuthenticated}
              >
                <Ionicons name="list" size={20} color="#757575" style={styles.inputIcon} />
                <Text style={[styles.dropdownText, category ? { color: '#000' } : { color: '#9e9e9e' }]}>
                  {category || "Select a category"}
                </Text>
                <Ionicons 
                  name={showCategoryDropdown ? "chevron-up" : "chevron-down"} 
                  size={24} 
                  color="#757575" 
                />
              </TouchableOpacity>
              
              {showCategoryDropdown && (
                <View style={styles.dropdownMenu}>
                  {categories.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setCategory(item.label);
                        setShowCategoryDropdown(false);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, category === item.label && styles.selectedDropdownText]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.dropdownWrapper}>
              <TouchableOpacity
                style={[styles.inputContainer, errors.priority && styles.inputError]}
                onPress={() => setShowPriorityDropdown(!showPriorityDropdown)}
                disabled={!isAuthenticated}
              >
                <Ionicons name="flag" size={20} color="#757575" style={styles.inputIcon} />
                <Text style={[styles.dropdownText, priority ? { color: '#000' } : { color: '#9e9e9e' }]}>
                  {priority || "Select priority level"}
                </Text>
                <Ionicons 
                  name={showPriorityDropdown ? "chevron-up" : "chevron-down"} 
                  size={24} 
                  color="#757575" 
                />
              </TouchableOpacity>
              
              {showPriorityDropdown && (
                <View style={styles.dropdownMenu}>
                  {priorities.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setPriority(item.label);
                        setShowPriorityDropdown(false);
                      }}
                    >
                      <View style={[styles.priorityIndicator, { backgroundColor: item.color }]} />
                      <Text style={[styles.dropdownItemText, priority === item.label && styles.selectedDropdownText]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            {errors.priority && <Text style={styles.errorText}>{errors.priority}</Text>}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <View style={[styles.textareaContainer, errors.description && styles.inputError]}>
              <TextInput
                style={styles.textarea}
                placeholder="Please provide details about your issue..."
                placeholderTextColor="#9e9e9e"
                multiline={true}
                numberOfLines={6}
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
                editable={isAuthenticated}
              />
            </View>
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>
          
          <TouchableOpacity 
            style={[
              styles.submitButton,
              (!isAuthenticated || isSubmitting) && styles.disabledButton
            ]}
            onPress={handleSubmit}
            disabled={!isAuthenticated || isSubmitting}
            activeOpacity={0.8}
          >
            <View style={styles.submitButtonInner}>
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="send" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.submitButtonText}>Submit Ticket</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.viewTicketsButton}
            onPress={() => navigation.navigate('Tickets')}
          >
            <Ionicons name="list" size={20} color="#fff" />
            <Text style={styles.viewTicketsText}>View My Tickets</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
      {/* Custom Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Ionicons name="help-circle" size={24} color="#4CAF50" />
          <Text style={styles.headerTitle}>Support Center</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.helpButton}
          onPress={() => navigation.navigate('Tickets')}
        >
          <Ionicons name="mail" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activePanel === 'faq' && styles.activeTab]}
          onPress={() => setActivePanel('faq')}
        >
          <Ionicons 
            name="help-circle" 
            size={20} 
            color={activePanel === 'faq' ? "#4CAF50" : "#757575"} 
          />
          <Text style={[styles.tabText, activePanel === 'faq' && styles.activeTabText]}>
            FAQ
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activePanel === 'submit' && styles.activeTab]}
          onPress={() => setActivePanel('submit')}
        >
          <Ionicons 
            name="create" 
            size={20} 
            color={activePanel === 'submit' ? "#4CAF50" : "#757575"} 
          />
          <Text style={[styles.tabText, activePanel === 'submit' && styles.activeTabText]}>
            Submit Ticket
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Active Panel Content */}
      {activePanel === 'faq' ? renderFAQPanel() : (
        <AuthAwareScreen
          requireAuth={true}
          navigation={navigation}
          returnScreen="Support"
          authMessage="Please log in to submit a support ticket"
        >
          {renderSubmitTicketPanel()}
        </AuthAwareScreen>
      )}
    </SafeAreaView>
  );
};

// Add these styles to your styles.js file
const additionalStyles = {
 
};

export default SupportScreen;