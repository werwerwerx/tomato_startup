"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";

export interface SyncConfig {
  queryKey: string[];
  syncEndpoint: string;
  getCacheData: () => any;
  onSync?: (success: boolean, data?: any) => void;
  onLogout?: () => void;
}

export const useSyncData = (config: SyncConfig) => {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const previousStatus = useRef<string>(status);
  const hasInitialSyncRun = useRef<boolean>(false);

  const syncToServer = async () => {
    try {
      const cacheData = config.getCacheData();
      
      if (!cacheData || (Array.isArray(cacheData) && cacheData.length === 0)) {
        return;
      }

      const response = await fetch(config.syncEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cacheData }),
      });

      if (response.ok) {
        const result = await response.json();
        config.onSync?.(true, result);
      } else {
        config.onSync?.(false);
      }
    } catch (error) {
      console.error("Sync failed:", error);
      config.onSync?.(false);
    }
  };

  const saveToCache = async () => {
    if (status === "authenticated") {
      try {
        const response = await fetch(config.syncEndpoint.replace('/sync', '/get'));
        if (response.ok) {
          const serverData = await response.json();
          queryClient.setQueryData(config.queryKey, serverData);
          config.onLogout?.();
        }
      } catch (error) {
        console.error("Failed to save server data to cache:", error);
      }
    }
  };

  useEffect(() => {
    const wasUnauthenticated = previousStatus.current === "unauthenticated";
    const isNowAuthenticated = status === "authenticated";
    const wasAuthenticated = previousStatus.current === "authenticated";
    const isNowUnauthenticated = status === "unauthenticated";

    if (wasUnauthenticated && isNowAuthenticated && !hasInitialSyncRun.current) {
      hasInitialSyncRun.current = true;
      syncToServer();
    }

    if (wasAuthenticated && isNowUnauthenticated) {
      hasInitialSyncRun.current = false;
      saveToCache();
    }

    previousStatus.current = status;
  }, [status, session?.user?.id]);

  return { syncToServer, saveToCache };
}; 