// navigation/Menu/menuHook.js
import { useState, useCallback } from 'react';
import { createNavigationData } from '../utils/menuUtils';

export const useDrawerNavigation = () => {
  // Get the navigation data
  const navigationData = createNavigationData();
  const [expandedItems, setExpandedItems] = useState({});
  
  // Check if an item is expanded
  const isItemExpanded = useCallback((segment) => {
    return !!expandedItems[segment];
  }, [expandedItems]);
  
  // Toggle the expanded state of an item
  const toggleExpand = useCallback((segment) => {
    setExpandedItems(prev => ({
      ...prev,
      [segment]: !prev[segment]
    }));
  }, []);
  
  return {
    navigationData,
    isAdmin: false, // You can implement admin check logic if needed
    isItemExpanded,
    toggleExpand
  };
};