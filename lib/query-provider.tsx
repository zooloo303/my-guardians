"use client";
import { useState } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider } from "@/components/Auth/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60000,
            gcTime: 10 * (60 * 1000),
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
          <DndProvider backend={HTML5Backend}>
            {children}
          </DndProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
