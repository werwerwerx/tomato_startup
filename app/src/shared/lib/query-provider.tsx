"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { envConfig } from "./config";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: envConfig.NODE_ENV === "production" ? 5 * 60 * 1000 : 0,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      retryDelay: 1000,
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * Провайдер для TanStack Query с настройками по умолчанию
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
