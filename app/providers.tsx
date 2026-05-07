"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { saveSessionToStorage, clearSessionStorage } from "@/lib/token-storage";

/**
 * Inner component that manages session persistence
 * Watches session changes and saves/clears them from localStorage
 */
function SessionPersistenceHandler({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session) {
      // User logged in - save session to localStorage
      saveSessionToStorage(session);
    } else if (status === "unauthenticated") {
      // User logged out - clear session from localStorage
      clearSessionStorage();
    }
  }, [session, status]);

  return <>{children}</>;
}

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <SessionPersistenceHandler>{children}</SessionPersistenceHandler>
    </SessionProvider>
  );
}
