// lib/query-provider.tsx
"use client";
import { useState } from "react";
import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider } from "@/components/Auth/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DragProvider } from '@/app/hooks/useDragContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60000,
            gcTime: 10 * (60 * 1000),
            // networkMode: 'online'
          },
        },
      })
  );

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DragProvider>
            {children}
          </DragProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}