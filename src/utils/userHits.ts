/**
 * User Hits Counter Utility
 * 
 * This utility manages a counter for user visits to the application.
 * The count is stored in localStorage to persist between sessions.
 */

const USER_HITS_KEY = 'weatherwhirl_user_hits';

/**
 * Increment the user hits counter
 * @returns The updated hit count
 */
export const incrementUserHits = (): number => {
  // Get current count from localStorage
  const currentHits = getUserHits();
  
  // Increment the count
  const newHits = currentHits + 1;
  
  // Save to localStorage
  localStorage.setItem(USER_HITS_KEY, newHits.toString());
  
  return newHits;
};

/**
 * Get the current user hits count
 * @returns The current hit count
 */
export const getUserHits = (): number => {
  const hits = localStorage.getItem(USER_HITS_KEY);
  return hits ? parseInt(hits, 10) : 0;
};
