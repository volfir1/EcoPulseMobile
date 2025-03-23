import { useState, useEffect, useRef } from 'react';
import { Animated, Alert } from 'react-native';
import { useAuth } from 'src/context/AuthContext';
import ticketService from 'services/ticketService';

export const useTicketDetail = (ticketId, navigation) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Get user data and auth status from AuthContext
  const { user, isAuthenticated, networkStatus } = useAuth();
  const userId = user?.id || user?._id || user?.uid;
  
  // Animation values
  const translateY = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  
  const flatListRef = useRef(null);
  
  // Fetch ticket data
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setError('Authentication required. Please login.');
      setLoading(false);
      return;
    }
    
    fetchTicketDetails();
    
    // Animation on mount
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      })
    ]).start();
  }, [ticketId, isAuthenticated]);
  
  // Fetch ticket details
  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if network is available
      if (!networkStatus.isConnected) {
        setError('No internet connection. Please check your connection and try again.');
        setLoading(false);
        setRefreshing(false);
        return;
      }
      
      // Use ticketService to get ticket details
      const response = await ticketService.getTicket(ticketId);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch ticket details');
      }
      
      // Set the ticket data
      setTicket(response.data);
    } catch (err) {
      console.error('Error fetching ticket details:', err);
      setError(err.message || 'Failed to load ticket details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Send a reply to the ticket
  const sendReply = async () => {
    if (!replyText.trim()) return;
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'You must be logged in to reply to tickets.',
        [
          {
            text: 'Login',
            onPress: () => navigation.navigate('Login', { returnTo: 'TicketDetail', params: { ticketId } })
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
        'You need an internet connection to send a reply. Please try again when you\'re connected.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    try {
      setSendingReply(true);
      
      // Use ticketService to send reply
      const response = await ticketService.replyToTicket(ticketId, replyText);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to send reply');
      }
      
      // Update ticket with the new message
      setTicket(response.data);
      setReplyText('');
      
      // Scroll to bottom of messages
      setTimeout(() => {
        if (flatListRef.current && ticket?.messages?.length > 0) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 300);
    } catch (err) {
      console.error('Error sending reply:', err);
      Alert.alert('Error', err.message || 'Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };
  
  // Mark ticket as resolved
  const markAsResolved = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'You must be logged in to update ticket status.',
        [
          {
            text: 'Login',
            onPress: () => navigation.navigate('Login', { returnTo: 'TicketDetail', params: { ticketId } })
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
        'You need an internet connection to update ticket status. Please try again when you\'re connected.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    try {
      setLoading(true);
      
      // Use ticketService to update ticket status
      const response = await ticketService.updateTicketStatus(ticketId, 'resolved');
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to update ticket status');
      }
      
      // Update ticket with new status
      setTicket(response.data);
      Alert.alert('Success', 'Ticket marked as resolved');
    } catch (err) {
      console.error('Error updating ticket status:', err);
      Alert.alert('Error', err.message || 'Failed to update ticket status');
    } finally {
      setLoading(false);
    }
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    fetchTicketDetails();
  };

  return {
    ticket,
    loading,
    error,
    replyText,
    setReplyText,
    sendingReply,
    userId,
    refreshing,
    translateY,
    opacity,
    flatListRef,
    fetchTicketDetails,
    sendReply,
    markAsResolved,
    onRefresh,
    isAuthenticated,
    networkStatus
  };
};