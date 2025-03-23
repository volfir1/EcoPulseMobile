import { useState, useEffect, useRef } from 'react';
import { Animated, Alert } from 'react-native';
import { useAuth } from 'src/context/AuthContext';
import ticketService from 'services/ticketService';

export const useTicketsScreen = (navigation) => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  
  // Get user data and auth status from AuthContext
  const { user, isAuthenticated, networkStatus } = useAuth();
  
  // Animation values
  const translateY = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  
  // Status filters
  const statusFilters = [
    { id: 'all', label: 'All' },
    { id: 'open', label: 'Open' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'resolved', label: 'Resolved' },
    { id: 'closed', label: 'Closed' }
  ];
  
  // Fetch tickets when component mounts or auth status changes
  useEffect(() => {
    // Check if user is authenticated before fetching tickets
    if (isAuthenticated) {
      fetchTickets();
    } else {
      setError('Authentication required. Please login.');
      setLoading(false);
    }
    
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
  }, [isAuthenticated]);
  
  // Filter tickets when search query or status filter changes
  useEffect(() => {
    filterTickets();
  }, [tickets, searchQuery, selectedStatus]);
  
  const fetchTickets = async () => {
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
      
      // Use ticketService to get tickets
      const response = await ticketService.getUserTickets();
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch tickets');
      }
      
      // Sort tickets by date - most recent first
      const sortedTickets = response.data.sort((a, b) => 
        new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      
      setTickets(sortedTickets);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(err.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const filterTickets = () => {
    let result = [...tickets];
    
    // Filter by status
    if (selectedStatus !== 'all') {
      result = result.filter(ticket => ticket.status === selectedStatus);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(ticket => 
        (ticket.subject && ticket.subject.toLowerCase().includes(query)) || 
        (ticket.ticketNumber && ticket.ticketNumber.toString().includes(query)) ||
        (ticket.category && ticket.category.toLowerCase().includes(query))
      );
    }
    
    setFilteredTickets(result);
  };
  
  const onRefresh = () => {
    // Check if user is authenticated before refreshing
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'You must be logged in to view tickets.',
        [
          {
            text: 'Login',
            onPress: () => navigation.navigate('Login', { returnTo: 'Tickets' })
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
        'You need an internet connection to refresh tickets. Please try again when you\'re connected.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setRefreshing(true);
    fetchTickets();
  };
  
  const handleTicketPress = (ticketId) => {
    navigation.navigate('TicketDetail', { ticketId });
  };
  
  const handleCreateTicket = () => {
    // Check if user is authenticated before creating ticket
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'You must be logged in to create a ticket.',
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
    
    navigation.navigate('Support');
  };
  
  return {
    tickets,
    filteredTickets,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    refreshing,
    translateY,
    opacity,
    statusFilters,
    fetchTickets,
    onRefresh,
    handleTicketPress,
    handleCreateTicket,
    isAuthenticated,
    networkStatus
  };
}