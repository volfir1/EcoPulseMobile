// src/utils/LazyLoad.js
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

const LazyLoad = ({ getComponent, ...props }) => {
  const [Component, setComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const loadComponent = async () => {
      try {
        // getComponent is a function that returns the component
        const comp = await getComponent();
        if (isMounted) {
          setComponent(() => comp);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to lazy load component:', error);
        setIsLoading(false);
      }
    };
    
    loadComponent();
    
    return () => {
      isMounted = false;
    };
  }, [getComponent]);

  if (isLoading || !Component) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <Component {...props} />;
};

export default LazyLoad;