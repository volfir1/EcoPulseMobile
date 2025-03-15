import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Animated,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SupportScreen = ({ navigation }) => {
  const [subject, setSubject] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [activePanel, setActivePanel] = useState('faq');
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  
  const translateY = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  
  // Added animation for component mounting
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const categories = [
    { id: 1, label: 'Account Access' },
    { id: 2, label: 'Technical Issue' },
    { id: 3, label: 'Billing Question' },
    { id: 4, label: 'Feature Request' },
    { id: 5, label: 'Other' },
  ];

  const priorities = [
    { id: 1, label: 'Low', color: '#4CAF50' },
    { id: 2, label: 'Medium', color: '#FFC107' },
    { id: 3, label: 'High', color: '#F44336' },
  ];

  const faqSections = [
    {
      title: 'Account Management',
      questions: [
        {
          id: 'resetPassword',
          question: 'How do I reset my password?',
          answer: 'To reset your password, tap on your profile picture, go to "Security Settings" and select "Reset Password". Follow the instructions sent to your email.',
        },
        {
          id: 'billingInfo',
          question: 'How do I update my billing information?',
          answer: 'You can update your billing information by navigating to "Settings" > "Payment Methods" and selecting "Edit" on the payment method you want to update.',
        },
        {
          id: 'deleteAccount',
          question: 'Can I delete my account?',
          answer: 'Yes, you can delete your account by going to "Settings" > "Account" > "Delete Account". Please note that this action is permanent and cannot be undone.',
        },
      ],
    },
    {
      title: 'Billing & Payments',
      questions: [
        {
          id: 'billing',
          question: 'When will I be billed?',
          answer: 'Billing occurs automatically on the first day of each month. You will receive an email receipt after each successful payment.',
        },
        {
          id: 'paymentMethods',
          question: 'What payment methods do you accept?',
          answer: 'We accept major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. Cryptocurrency payment options will be coming soon.',
        },
        {
          id: 'refunds',
          question: 'What is your refund policy?',
          answer: 'We offer full refunds within 30 days of purchase. After 30 days, refunds are provided on a case-by-case basis. Contact our support team for assistance.',
        },
      ],
    },
    {
      title: 'Technical Support',
      questions: [
        {
          id: 'dataSync',
          question: 'Why isn\'t my data syncing?',
          answer: 'Data syncing issues are often resolved by ensuring you have a stable internet connection and restarting the app. If issues persist, please submit a support ticket.',
        },
        {
          id: 'appCrash',
          question: 'The app keeps crashing, what should I do?',
          answer: 'Try clearing the app cache, ensure your device has sufficient storage, and update to the latest app version. If the problem continues, please contact our support team.',
        },
      ],
    },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!subject.trim()) newErrors.subject = 'Subject is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!category) newErrors.category = 'Category is required';
    if (!priority) newErrors.priority = 'Priority is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Animate button press
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: 5,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Handle ticket submission logic
      console.log({ subject, email, category, priority, description });
      
      // Show success message or navigate
      // Here you would typically navigate or show a success message
    }
  };

  const toggleQuestion = (questionId) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

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
                    <MaterialIcons 
                      name="question-answer" 
                      size={20} 
                      color="#4CAF50" 
                      style={styles.questionIcon}
                    />
                    <Text style={styles.question}>{faqItem.question}</Text>
                  </View>
                  <MaterialIcons 
                    name={expandedQuestions[faqItem.id] ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
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
            <MaterialIcons name="support-agent" size={24} color="#fff" />
            <Text style={styles.supportInfoTitle}>Contact Support</Text>
          </View>
          
          <View style={styles.supportInfoContent}>
            <View style={styles.supportInfoItem}>
              <MaterialIcons name="email" size={20} color="#4CAF50" />
              <Text style={styles.supportInfoText}>eco-plus-support@gmail.com</Text>
            </View>
            
            <View style={styles.supportInfoItem}>
              <MaterialIcons name="phone" size={20} color="#4CAF50" />
              <Text style={styles.supportInfoText}>+1 (555) 123-4567</Text>
            </View>
            
            <View style={styles.supportInfoItem}>
              <MaterialIcons name="chat" size={20} color="#4CAF50" />
              <Text style={styles.supportInfoText}>Live Chat: Available 24/7</Text>
            </View>
            
            <View style={styles.supportInfoItem}>
              <MaterialIcons name="access-time" size={20} color="#4CAF50" />
              <Text style={styles.supportInfoText}>Response Time: Within 24 hours</Text>
            </View>
          </View>
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
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Subject</Text>
            <View style={[styles.inputContainer, errors.subject && styles.inputError]}>
              <MaterialIcons name="title" size={20} color="#757575" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Brief description of your issue"
                placeholderTextColor="#9e9e9e"
                value={subject}
                onChangeText={setSubject}
              />
            </View>
            {errors.subject && <Text style={styles.errorText}>{errors.subject}</Text>}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputContainer, errors.email && styles.inputError]}>
              <MaterialIcons name="email" size={20} color="#757575" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="your.email@example.com"
                placeholderTextColor="#9e9e9e"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
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
              >
                <MaterialIcons name="category" size={20} color="#757575" style={styles.inputIcon} />
                <Text style={[styles.dropdownText, category ? { color: '#000' } : { color: '#9e9e9e' }]}>
                  {category || "Select a category"}
                </Text>
                <MaterialIcons 
                  name={showCategoryDropdown ? "arrow-drop-up" : "arrow-drop-down"} 
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
              >
                <MaterialIcons name="flag" size={20} color="#757575" style={styles.inputIcon} />
                <Text style={[styles.dropdownText, priority ? { color: '#000' } : { color: '#9e9e9e' }]}>
                  {priority || "Select priority level"}
                </Text>
                <MaterialIcons 
                  name={showPriorityDropdown ? "arrow-drop-up" : "arrow-drop-down"} 
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
              />
            </View>
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>
          
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <View style={styles.submitButtonInner}>
              <MaterialIcons name="send" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.submitButtonText}>Submit Ticket</Text>
            </View>
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
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <MaterialIcons name="support" size={24} color="#4CAF50" />
          <Text style={styles.headerTitle}>Support Center</Text>
        </View>
        
        <TouchableOpacity style={styles.helpButton}>
          <MaterialIcons name="help-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activePanel === 'faq' && styles.activeTab]}
          onPress={() => setActivePanel('faq')}
        >
          <MaterialIcons 
            name="question-answer" 
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
          <MaterialIcons 
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
      {activePanel === 'faq' ? renderFAQPanel() : renderSubmitTicketPanel()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    marginTop: 10, // Added top margin to prevent overlap
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginTop: 5, // Added top margin to header
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  helpButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#e8f5e9', // Lighter green background
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#757575',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#4CAF50', // Green color
  },
  panel: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  faqSection: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#4CAF50', // Green color
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  faqItemContainer: {
    backgroundColor: '#fff',
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  questionInner: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  questionIcon: {
    marginRight: 12,
  },
  question: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  answerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingLeft: 48,
  },
  answer: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
  },
  divider: {
    height: 1,
    backgroundColor: '#e1e4e8',
    marginHorizontal: 16,
  },
  supportInfoContainer: {
    marginTop: 12,
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  supportInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#388E3C', // Darker green
  },
  supportInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 12,
  },
  supportInfoContent: {
    padding: 16,
  },
  supportInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  supportInfoText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    borderColor: '#e1e4e8',
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    height: 50,
    fontSize: 15,
    color: '#333',
  },
  inputError: {
    borderColor: '#f44336',
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  dropdownWrapper: {
    position: 'relative',
    zIndex: 1,
  },
  dropdownText: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 14,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e1e4e8',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 2,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#333',
  },
  selectedDropdownText: {
    color: '#4CAF50', // Green color
    fontWeight: '500',
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  textareaContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e4e8',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textarea: {
    width: '100%',
    minHeight: 120,
    fontSize: 15,
    color: '#333',
  },
  submitButton: {
    borderRadius: 8,
    marginBottom: 30,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#4CAF50', // Green color
  },
  submitButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default SupportScreen;