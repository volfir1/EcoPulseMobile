// utils/avatarHelpers.js
import { defaultAvatars } from "hooks/useProfile";

/**
 * Determines if a URL is a Cloudinary URL
 * @param {string} url - The URL to check
 * @returns {boolean} True if the URL is a Cloudinary URL
 */
export const isCloudinaryUrl = (url) => {
  return url && typeof url === 'string' && url.includes('cloudinary.com');
};

/**
 * Adds cache-busting parameters to a Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @param {string|number} refreshKey - Unique key or timestamp for cache busting
 * @returns {string} URL with cache-busting parameter
 */
export const addCacheBuster = (url, refreshKey = Date.now()) => {
    if (!url) return url;
    
    // Don't add the parameter if it already exists
    if (url.includes('_cb=')) {
      return url;
    }
    
    return url.includes('?') 
      ? `${url}&_cb=${refreshKey}` 
      : `${url}?_cb=${refreshKey}`;
  };
  

/**
 * Converts a default avatar ID to a full Cloudinary URL
 * @param {string} avatarId - The default avatar ID (e.g., 'avatar-1')
 * @param {string} cloudName - Your Cloudinary cloud name
 * @returns {string} Full Cloudinary URL for the avatar
 */
export const getDefaultAvatarUrl = (avatarId, cloudName = 'dah5hrzpp') => {
    return `https://res.cloudinary.com/${cloudName}/image/upload/ecopulse_avatars/${avatarId}.png`;
};

/**
 * Gets appropriate avatar display information based on avatar data
 * @param {Object} user - User object containing avatar information
 * @param {string} selectedAvatar - Currently selected default avatar ID
 * @param {string} customAvatar - Custom avatar URL
 * @param {number} refreshKey - Key to force refresh cached images
 * @returns {Object} Avatar display information
 */
export const getAvatarDisplayInfo = (user, selectedAvatar, customAvatar, refreshKey) => {
  // Handle custom avatar from state
  if (customAvatar) {
    if (isCloudinaryUrl(customAvatar)) {
      return { 
        type: 'custom', 
        uri: addCacheBuster(customAvatar, refreshKey),
        isCloudinary: true 
      };
    }
    return { 
      type: 'custom', 
      uri: customAvatar,
      isCloudinary: false 
    };
  }
  
  // Handle selected default avatar from state
  if (selectedAvatar) {
    const defaultAvatarObj = defaultAvatars.find(a => a.id === selectedAvatar);
    if (defaultAvatarObj) {
      return { type: 'default', image: defaultAvatarObj.image };
    }
  }
  
  // Check user object if no state is set
  if (user?.avatar) {
    if (isCloudinaryUrl(user.avatar)) {
      return { 
        type: 'custom', 
        uri: addCacheBuster(user.avatar, refreshKey),
        isCloudinary: true 
      };
    }
    // Check if it's a default avatar ID
    if (user.avatar.startsWith('avatar-')) {
      const defaultAvatarObj = defaultAvatars.find(a => a.id === user.avatar);
      if (defaultAvatarObj) {
        return { type: 'default', image: defaultAvatarObj.image };
      }
    }
    // Treat as a regular URL
    return { 
      type: 'custom', 
      uri: user.avatar,
      isCloudinary: false 
    };
  }
  
  // Fallback to initials
  return { 
    type: 'initials', 
    initials: `${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}` 
  };
};