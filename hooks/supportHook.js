import { useState, useRef, useEffect } from 'react';
import { Animated, Alert } from 'react-native';
import { useAuth } from 'src/context/AuthContext';
import ticketService from 'services/ticketService';

export const useSupportScreen = (navigation) => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get user data from AuthContext
  const { user, isAuthenticated, networkStatus } = useAuth();
  
  const translateY = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  
  // Added animation for component mounting
  useEffect(() => {
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
    
    // If user is authenticated, set email from user object
    if (user && user.email) {
      setEmail(user.email);
    }
  }, [user]);

  const categories = [
    { id: 1, label: 'Account Access' },
    { id: 2, label: 'Technical Issue' },
    { id: 3, label: 'Billing Question' },
    { id: 4, label: 'Feature Request' },
    { id: 5, label: 'Other' },
  ];

  const priorities = [
    { id: 1, label: 'loe', color: '#4CAF50' },
    { id: 2, label: 'medium', color: '#FFC107' },
    { id: 3, label: 'high', color: '#F44336' },
    { id: 4, label: 'urgent', color: '#0000' },
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

  const handleSubmit = async () => {
    if (validateForm()) {
      // Check if user is authenticated
      if (!isAuthenticated) {
        Alert.alert(
          'Authentication Required',
          'You must be logged in to submit a ticket.',
          [
            {
              text: 'Login',
              onPress: () => navigation.navigate('Login', { returnTo: 'Support' })
            },
            {
              text: 'Cancel',
              style: 'cancel'
            }
          ]
        );
        return;
      }
      
      // Check network status
      if (!networkStatus.isConnected) {
        Alert.alert(
          'No Internet Connection',
          'You need an internet connection to submit a ticket. Please try again when you\'re connected.',
          [{ text: 'OK' }]
        );
        return;
      }
      
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
      
      try {
        setIsSubmitting(true);
        
        // Prepare ticket data
        const ticketData = {
          subject,
          email,
          category,
          priority,
          description,
          // Add user ID if available
          userId: user?.id || user?._id || user?.uid
        };
        
        // Use ticketService instead of direct fetch
        const response = await ticketService.createTicket(ticketData);
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to submit ticket');
        }
        
        // Show success message
        Alert.alert(
          'Success',
          'Your ticket has been submitted successfully! We will get back to you soon.',
          [
            {
              text: 'View My Tickets',
              onPress: () => navigation.navigate('Tickets')
            },
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setSubject('');
                setCategory('');
                setPriority('');
                setDescription('');
                setErrors({});
              }
            }
          ]
        );
      } catch (err) {
        console.error('Error submitting ticket:', err);
        Alert.alert('Error', err.message || 'Failed to submit ticket');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const toggleQuestion = (questionId) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  return {
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
    userData: user,  // Use the user object from AuthContext
    translateY,
    opacity,
    categories,
    priorities,
    faqSections,
    validateForm,
    handleSubmit,
    toggleQuestion,
    isAuthenticated
  };
};