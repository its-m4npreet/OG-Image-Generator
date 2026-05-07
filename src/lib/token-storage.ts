/**
 * Token Storage Utility
 * Handles persistent storage of authentication tokens in localStorage
 * Provides backup persistence in case cookies are cleared
 */

const TOKEN_KEY = 'og_studio_token';
const SESSION_KEY = 'og_studio_session';

export interface StoredSession {
  user: {
    id?: string;
    email?: string;
    name?: string;
    image?: string;
    role?: string;
  };
  expires: string;
}

/**
 * Save session to localStorage
 * Call this after successful login
 */
export const saveSessionToStorage = (session: any): void => {
  try {
    if (typeof window === 'undefined') return; // SSR check
    
    if (session) {
      const sessionData: StoredSession = {
        user: session.user || {},
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      console.log('✅ Session saved to localStorage');
    }
  } catch (error) {
    console.error('❌ Error saving session to localStorage:', error);
  }
};

/**
 * Get session from localStorage
 * Returns null if session is expired or doesn't exist
 */
export const getStoredSession = (): StoredSession | null => {
  try {
    if (typeof window === 'undefined') return null; // SSR check
    
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;

    const session: StoredSession = JSON.parse(stored);
    
    // Check if session is expired
    if (new Date(session.expires) < new Date()) {
      console.log('⏰ Stored session expired');
      clearSessionStorage();
      return null;
    }

    return session;
  } catch (error) {
    console.error('❌ Error reading session from localStorage:', error);
    return null;
  }
};

/**
 * Clear session from localStorage
 * Call this on logout
 */
export const clearSessionStorage = (): void => {
  try {
    if (typeof window === 'undefined') return; // SSR check
    
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    console.log('✅ Session cleared from localStorage');
  } catch (error) {
    console.error('❌ Error clearing session from localStorage:', error);
  }
};

/**
 * Check if there's a valid stored session
 */
export const hasValidStoredSession = (): boolean => {
  return getStoredSession() !== null;
};
