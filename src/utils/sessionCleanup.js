// sessionCleanup.js - Utility functions for form and session management

/**
 * Clear form data and prevent autocomplete
 */
export const clearFormData = () => {
  // Clear any form data from browser memory
  if (typeof window !== 'undefined') {
    // Clear form history
    try {
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.warn('Could not clear history state:', error);
    }
  }
};

/**
 * Disable autocomplete on form elements
 */
export const disableAutocomplete = () => {
  if (typeof document !== 'undefined') {
    // Find all input elements and disable autocomplete
    const inputs = document.querySelectorAll('input[type="email"], input[type="password"], input[type="text"]');
    inputs.forEach(input => {
      input.setAttribute('autocomplete', 'off');
      input.setAttribute('data-form-type', 'other');
    });
  }
};

/**
 * Clear all user session data
 */
export const clearSessionData = () => {
  if (typeof localStorage !== 'undefined') {
    // Clear all user-related localStorage items
    const keysToRemove = [
      'userEmail',
      'email', 
      'userRole',
      'role',
      'userId',
      'userName',
      'name',
      'userRating',
      'userProfile',
      'sessionStartTime',
      'token',
      'user'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
  }
  
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.clear();
  }
};

/**
 * Set logout flag and clear session
 */
export const performLogout = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('justLoggedOut', 'true');
  }
  clearSessionData();
  
  // Dispatch storage event to notify other components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'justLoggedOut',
      newValue: 'true'
    }));
  }
};

/**
 * Check if user session is valid
 */
export const isSessionValid = () => {
  if (typeof localStorage === 'undefined') return false;
  
  const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('email');
  const userRole = localStorage.getItem('userRole') || localStorage.getItem('role');
  const sessionTime = localStorage.getItem('sessionStartTime');
  
  if (!userEmail || !userRole) return false;
  
  // Check if session is expired (24 hours)
  if (sessionTime) {
    const sessionAge = Date.now() - parseInt(sessionTime);
    const sessionLimit = 24 * 60 * 60 * 1000; // 24 hours
    
    if (sessionAge > sessionLimit) {
      clearSessionData();
      return false;
    }
  }
  
  return true;
};

export default {
  clearFormData,
  disableAutocomplete,
  clearSessionData,
  performLogout,
  isSessionValid
};