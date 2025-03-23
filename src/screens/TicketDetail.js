import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTicketDetail } from 'hooks/ticketDetailHook';
import styles from 'styles/ticketDetailStyles';
import { 
  formatDate, 
  getStatusColor, 
  getStatusIcon, 
  getPriorityInfo, 
  formatTicketNumber, 
  getInitials 
} from '../../utils/userTicket';
import AuthAwareScreen from './AuthAwareScreem';

const TicketDetailScreen = ({ route, navigation }) => {
  const { ticketId } = route.params;
  const {
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
    onRefresh
  } = useTicketDetail(ticketId, navigation);
  
  // Render message bubble
  const renderMessage = ({ item }) => {
    const isCurrentUser = item.sender === userId;
    const senderName = isCurrentUser ? 'You' : item.isAdmin ? 'Support Agent' : 'User';
    
    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.rightMessage : styles.leftMessage
      ]}>
        <View style={styles.messageSender}>
          <View style={[
            styles.avatarCircle,
            { backgroundColor: isCurrentUser ? '#4CAF50' : item.isAdmin ? '#673AB7' : '#2196F3' }
          ]}>
            <Text style={styles.avatarText}>{getInitials(senderName)}</Text>
          </View>
          <View style={styles.senderInfo}>
            <Text style={styles.senderName}>{senderName}</Text>
            <Text style={styles.messageTime}>{formatDate(item.createdAt)}</Text>
          </View>
          {item.isAdmin && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminText}>Staff</Text>
            </View>
          )}
        </View>
        
        <View style={[
          styles.messageBubble,
          isCurrentUser ? styles.currentUserBubble : 
          item.isAdmin ? styles.adminBubble : styles.otherBubble
        ]}>
          <Text style={[
            styles.messageText,
            isCurrentUser ? styles.currentUserText : 
            item.isAdmin ? styles.adminText : styles.otherText
          ]}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  };
  
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading ticket details...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (error && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#F44336" />
          <Text style={styles.errorTitle}>Error loading ticket</Text>
          <Text style={styles.errorDescription}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchTicketDetails}
          >
            <Ionicons name="refresh-outline" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  if (!ticket) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="document-text-outline" size={60} color="#757575" />
          <Text style={styles.errorTitle}>Ticket not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  const statusColor = getStatusColor(ticket.status);
  const statusIcon = getStatusIcon(ticket.status);
  const { color: priorityColor, label: priorityLabel } = getPriorityInfo(ticket.priority || 'medium');
  const canReply = ['open', 'in-progress'].includes(ticket.status);
  const canResolve = ticket.status === 'in-progress';
  
  return (
    <AuthAwareScreen
      requireAuth={true}
      navigation={navigation}
      returnScreen="Tickets"
      authMessage="Please log in to view ticket details"
    >
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
            <Ionicons name="chatbox" size={24} color="#4CAF50" />
            <Text style={styles.headerTitle}>Ticket Details</Text>
          </View>
          
          <TouchableOpacity style={styles.helpButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Ticket Info Card */}
            <Animated.View
              style={[
                styles.ticketInfoCard,
                { transform: [{ translateY }], opacity }
              ]}
            >
              <View style={styles.ticketHeader}>
                <Text style={styles.ticketTitle}>{ticket.subject}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                  <Text style={styles.statusText}>{(ticket.status || 'unknown').toUpperCase().replace('-', ' ')}</Text>
                </View>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.ticketDetailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Ticket ID</Text>
                  <Text style={styles.detailValue}>{formatTicketNumber(ticket.ticketNumber)}</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Category</Text>
                  <Text style={styles.detailValue}>{ticket.category || 'General'}</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Priority</Text>
                  <View style={[styles.priorityBadge, { borderColor: priorityColor }]}>
                    <Text style={[styles.priorityText, { color: priorityColor }]}>
                      {priorityLabel}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Created</Text>
                  <Text style={styles.detailValue}>{formatDate(ticket.createdAt)}</Text>
                </View>
              </View>
            </Animated.View>
            
            {/* Conversation Section */}
            <View style={styles.conversationSection}>
              <Text style={styles.sectionTitle}>Conversation</Text>
              
              {ticket.messages && ticket.messages.length > 0 ? (
                ticket.messages.map((message, index) => renderMessage({ item: message, index }))
              ) : (
                <View style={styles.emptyMessages}>
                  <Ionicons name="chatbubbles-outline" size={40} color="#DADADA" />
                  <Text style={styles.emptyMessagesText}>No messages yet</Text>
                </View>
              )}
            </View>
          </ScrollView>
          
          {/* Reply Input Section */}
          {canReply ? (
            <View style={styles.replyContainer}>
              <TextInput
                style={styles.replyInput}
                placeholder="Type your reply here..."
                value={replyText}
                onChangeText={setReplyText}
                multiline
                maxHeight={120}
                placeholderTextColor="#9E9E9E"
              />
              
              <View style={styles.replyActions}>
                {canResolve && (
                  <TouchableOpacity
                    style={styles.resolveButton}
                    onPress={markAsResolved}
                    disabled={sendingReply}
                  >
                    <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
                    <Text style={styles.resolveText}>Resolve</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    (!replyText.trim() || sendingReply) && styles.disabledButton
                  ]}
                  onPress={sendReply}
                  disabled={!replyText.trim() || sendingReply}
                >
                  {sendingReply ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="send" size={20} color="#fff" />
                      <Text style={styles.sendText}>Send</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.closedContainer}>
              <Ionicons 
                name={ticket.status === 'resolved' ? 'checkmark-circle' : 'lock-closed'} 
                size={24} 
                color="#757575" 
              />
              <Text style={styles.closedText}>
                This ticket is {ticket.status === 'resolved' ? 'resolved' : 'closed'}
              </Text>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthAwareScreen>
  );
};

export default TicketDetailScreen;