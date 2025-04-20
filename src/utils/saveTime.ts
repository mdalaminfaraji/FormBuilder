// LocalStorage key for saving the last save timestamp
export const LAST_SAVED_KEY = "formbuilder_last_saved";

// Function to format time difference
export const formatTimeSince = (timestamp: number): string => {
  const now = Date.now();
  const diffSeconds = Math.floor((now - timestamp) / 1000);
  
  if (diffSeconds < 5) return "Just now";
  if (diffSeconds < 60) return `${diffSeconds} seconds ago`;
  
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes} min${diffMinutes !== 1 ? 's' : ''} ago`;
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
};

// Function to get the initial last saved time
export const getInitialLastSaved = (): number | null => {
  const savedTime = localStorage.getItem(LAST_SAVED_KEY);
  return savedTime ? parseInt(savedTime, 10) : null;
};

// Function to update the last saved time
export const updateLastSavedTime = (): void => {
  const now = Date.now();
  localStorage.setItem(LAST_SAVED_KEY, now.toString());
  // Dispatch an event that the Header component can listen for
  window.dispatchEvent(new CustomEvent('form-saved', { detail: now }));
};
