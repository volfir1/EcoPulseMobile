import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  Animated,
  StatusBar,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTicketsScreen } from '../../hooks/viewTicketHook';
import styles from 'styles/viewTicketStyles';
import { formatDate, getStatusColor, getRelativeTime, formatTicketNumber, getPriorityInfo } from 'utils/userTicket';

const TicketsScreen = ({ navigation }) => {
  const {
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
    handleTicketPress
  } = useTicketsScreen(navigation);
  
  const renderTicketItem = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    const { color: priorityColor } = getPriorityInfo(item.priority || 'medium');
    
    return (
      <TouchableOpacity
        style={styles.ticketCard}
        onPress={() => handleTicketPress(item._id)}
        activeOpacity={0.7}
      >
        <View style={styles.ticketHeader}>
          <View style={styles.ticketTitleContainer}>
            <Ionicons name="document-text-outline" size={18} color="#4CAF50" />
            <Text style={styles.ticketTitle} numberOfLines={1}>
              {item.subject || 'No Subject'}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>
              {(item.status || 'unknown').toUpperCase().replace('-', ' ')}
            </Text>
          </View>
        </View>
        
        <Text style={styles.ticketDescription} numberOfLines={2}>
          {item.messages && item.messages[0]?.content || 'No description available'}
        </Text>
        
        <View style={styles.divider} />
        
        <View style={styles.ticketFooter}>
          <View style={styles.ticketInfo}>
            <Text style={styles.ticketId}>
              {formatTicketNumber(item.ticketNumber || '------')}
            </Text>
            
            {item.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
              </View>
            )}
            
            {item.priority && (
              <View style={[styles.priorityBadge, { borderColor: priorityColor }]}>
                <Text style={[styles.priorityText, { color: priorityColor }]}>
                  {item.priority.toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.ticketDate}>{getRelativeTime(item.updatedAt)}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="mail-outline" size={60} color="#DADADA" />
      <Text style={styles.emptyTitle}>No tickets found</Text>
      <Text style={styles.emptyDescription}>
        {searchQuery 
          ? 'Try adjusting your search criteria' 
          : selectedStatus !== 'all' 
            ? `You don't have any ${selectedStatus.replace('-', ' ')} tickets` 
            : 'You haven\'t submitted any support tickets yet'}
      </Text>
      <TouchableOpacity
        style={styles.newTicketButton}
        onPress={() => navigation.navigate('Support')}
      >
        <Ionicons name="add-circle-outline" size={20} color="white" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>New Ticket</Text>
      </TouchableOpacity>
    </View>
  );
  
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading tickets...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (error && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#F44336" />
          <Text style={styles.errorTitle}>Error loading tickets</Text>
          <Text style={styles.errorDescription}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchTickets}
          >
            <Ionicons name="refresh-outline" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Ionicons name="mail" size={24} color="#4CAF50" />
          <Text style={styles.headerTitle}>My Tickets</Text>
        </View>
        
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => navigation.navigate('Support')}
        >
          <Ionicons name="add-circle-outline" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <Animated.View
        style={[
          styles.searchContainer,
          { transform: [{ translateY }], opacity }
        ]}
      >
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#757575" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tickets..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9E9E9E"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#757575" />
            </TouchableOpacity>
          ) : null}
        </View>
      </Animated.View>
      
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {statusFilters.map(filter => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterTab,
                selectedStatus === filter.id && styles.activeFilterTab
              ]}
              onPress={() => setSelectedStatus(filter.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedStatus === filter.id && styles.activeFilterText
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Tickets List */}
      <FlatList
        data={filteredTickets}
        renderItem={renderTicketItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={renderEmptyList}
      />
    </SafeAreaView>
  );
};

export default TicketsScreen;