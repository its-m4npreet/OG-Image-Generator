"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getStoredSession } from "@/lib/token-storage";

/**
 * Hook to check and restore session from localStorage
 * Useful for initializing auth state on page load
 */
export const useSessionRestore = () => {
  const { data: session, status } = useSession();
  const [isRestored, setIsRestored] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [storedSession, setStoredSession] = useState<any>(null);

  useEffect(() => {
    // Check localStorage for stored session on component mount
    const stored = getStoredSession();
    if (stored && !session && status === "unauthenticated") {
      setStoredSession(stored);
      console.log(" Restoring session from localStorage");
    }
    setIsRestored(true);
  }, [session, status]);

  return {
    session,
    status,
    isRestored,
    storedSession,
    hasValidSession: status === "authenticated" || !!storedSession,
  };
};

/**
 * Hook to check if session exists (for quick auth checks)
 */
export const useIsAuthenticated = () => {
  const { status } = useSession();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  return {
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    isReady,
  };
};

/**
 * Hook to get current session with type safety
 */
export const useCurrentSession = () => {
  const { data: session, status } = useSession();
  
  return {
    user: session?.user || null,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    session,
  };
};
