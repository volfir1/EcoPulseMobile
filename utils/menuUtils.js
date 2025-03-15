// navigation/Menu/menuUtil.js
export const getIconForName = (iconName) => {
    // Map icon names to actual icons
    const iconMap = {
      home: { family: 'Feather', name: 'home', color: '#4CAF50' },
      grid: { family: 'Feather', name: 'grid', color: '#2196F3' },
      user: { family: 'Feather', name: 'user', color: '#9C27B0' },
      help: { family: 'Feather', name: 'help-circle', color: '#FF9800' },
      star: { family: 'Feather', name: 'star', color: '#F44336' },
      share: { family: 'Feather', name: 'share-2', color: '#3F51B5' },
      sun: { family: 'Feather', name: 'sun', color: '#FFC107' },
      wind: { family: 'Feather', name: 'wind', color: '#00BCD4' },
      // Add more icon mappings as needed
    };
    
    return iconMap[iconName] || { family: 'Feather', name: 'circle', color: '#555' };
  };
  
  export const getNavigationPath = (item) => {
    // Map segment/path to actual screen names in the navigator
    return item.path || null;
  };
  
  // This function creates the data structure for the drawer
  export const createNavigationData = () => {
    return [
      { kind: 'header', title: 'MAIN', segment: 'main-header' },
      
      // Home
      { 
        kind: 'item', 
        title: 'Home', 
        segment: 'home', 
        iconName: 'home',
        path: 'Home' // This matches the Drawer.Screen name
      },
      
      // Dashboard
      { 
        kind: 'item', 
        title: 'Dashboard', 
        segment: 'dashboard', 
        iconName: 'grid',
        path: 'Dashboard'
      },
      
      // Modules group with children
      { 
        kind: 'item', 
        title: 'Energy Modules', 
        segment: 'modules', 
        iconName: 'zap',
        children: [
          { 
            kind: 'item', 
            title: 'Solar', 
            segment: 'solar', 
            iconName: 'sun',
            path: 'Solar'
          },
          { 
            kind: 'item', 
            title: 'Wind', 
            segment: 'wind', 
            iconName: 'wind',
            path: 'Wind'
          },
          { 
            kind: 'item', 
            title: 'Geothermal', 
            segment: 'geo', 
            iconName: 'thermometer',
            path: 'Geo'
          },
          { 
            kind: 'item', 
            title: 'Hydropower', 
            segment: 'hydro', 
            iconName: 'droplet',
            path: 'Hydro'
          },
          { 
            kind: 'item', 
            title: 'Biomass', 
            segment: 'bio', 
            iconName: 'box',
            path: 'Bio'
          }
        ]
      },
      
      { kind: 'divider', segment: 'divider-1' },
      
      { kind: 'header', title: 'ACCOUNT', segment: 'account-header' },
      
      // Profile
      { 
        kind: 'item', 
        title: 'Profile', 
        segment: 'profile', 
        iconName: 'user',
        path: 'UserProfile'
      },
      
      // Help & Support
      { 
        kind: 'item', 
        title: 'Help & Support', 
        segment: 'help', 
        iconName: 'help-circle',
        path: 'HelpSupport'
      },
      
      // Recommendations
      { 
        kind: 'item', 
        title: 'Recommendations', 
        segment: 'recommendations', 
        iconName: 'star',
        path: 'Recommendations'
      },
      
      // Energy Sharing
      { 
        kind: 'item', 
        title: 'Energy Sharing', 
        segment: 'energy-sharing', 
        iconName: 'share',
        path: 'EnergySharing'
      }
    ];
  };