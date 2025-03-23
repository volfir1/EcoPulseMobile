// src/utils/userTicketUtils.js
import { format, parseISO, formatDistanceToNow } from 'date-fns';

// Format dates in a readable way
export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM dd, yyyy • h:mm a');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (dateString) => {
  if (!dateString) return '';
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error getting relative time:', error);
    return '';
  }
};

// Map status to color variant for UI elements
export const getStatusColor = (status) => {
  const statusMap = {
    'open': '#FFC107', // warning - yellow
    'in-progress': '#673AB7', // secondary - purple
    'resolved': '#4CAF50', // success - green
    'closed': '#2196F3' // primary - blue
  };
  return statusMap[status?.toLowerCase()] || '#757575'; // default - gray
};

// Get appropriate icon name for different ticket status
export const getStatusIcon = (status) => {
  const iconMap = {
    'open': 'alert-circle',
    'in-progress': 'refresh',
    'resolved': 'checkmark-circle',
    'closed': 'lock-closed'
  };
  return iconMap[status?.toLowerCase()] || 'help-circle';
};

// Get priority level label and color
export const getPriorityInfo = (priority) => {
  const priorityMap = {
    'low': { label: 'Low', color: '#4CAF50' }, // success - green
    'medium': { label: 'Medium', color: '#FFC107' }, // warning - yellow
    'high': { label: 'High', color: '#F44336' }, // error - red
    'urgent': { label: 'Urgent', color: '#D32F2F' } // dark red
  };
  return priorityMap[priority?.toLowerCase()] || { label: 'Normal', color: '#2196F3' };
};

// Format ticket number with leading zeros
export const formatTicketNumber = (num) => {
  if (!num) return '#000000';
  return `#${String(num).padStart(6, '0')}`;
};

// Helper to determine if the current user is the sender of a message
export const isCurrentUserSender = (message, currentUserId) => {
  if (!message || !currentUserId) return false;
  return message.sender === currentUserId;
};

// Generate avatar initials from a name
export const getInitials = (name) => {
  if (!name) return '?';
  
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  
  return (
    names[0].charAt(0).toUpperCase() + 
    names[names.length - 1].charAt(0).toUpperCase()
  );
};

// Parse and format message content with support for line breaks
export const formatMessageContent = (content) => {
  if (!content) return '';
  return content.replace(/\n/g, '\n');
};