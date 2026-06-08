"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/lib/ThemeContext";
import { saveSessionToStorage, clearSessionStorage } from "@/lib/token-storage";

const queryClient = new QueryClient();

function SessionPersistenceHandler({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session) {
      saveSessionToStorage(session);
    } else if (status === "unauthenticated") {
      clearSessionStorage();
    }
  }, [session, status]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <SessionPersistenceHandler>
              {children}
            </SessionPersistenceHandler>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </QueryClientProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
