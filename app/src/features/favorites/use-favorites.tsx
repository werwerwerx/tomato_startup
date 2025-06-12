import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useSession } from "next-auth/react";
import { favoritesApi } from "./api";
import { useMemoryFavorites } from "@/shared/hooks/use-memory-storage";
import { useSyncData } from "@/shared/hooks/use-sync-data";

const FAVORITES_QUERY_KEY = ["favorites"];

export const useFavorites = () => {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const memoryFavorites = useMemoryFavorites();

  const { data: favoritesData, isLoading: isLoadingFavorites } = useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: favoritesApi.getFavorites,
    staleTime: 5 * 60 * 1000,
    enabled: status === "authenticated",
  });

  useSyncData({
    queryKey: FAVORITES_QUERY_KEY,
    syncEndpoint: "/api/user/favorites/sync",
    getCacheData: () => memoryFavorites.getFavoritesForSync(),
    onSync: (success) => {
      if (success) {
        memoryFavorites.clearFavorites();
        queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
      }
    },
    onLogout: () => {
      if (favoritesData?.favorites) {
        favoritesData.favorites.forEach(item => {
          memoryFavorites.addToFavorites(item.dishId);
        });
      }
    },
  });

  const addMutation = useMutation({
    mutationFn: favoritesApi.addFavorite,
    onMutate: async (dishId) => {
      await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY });
      
      const previousFavorites = queryClient.getQueryData(FAVORITES_QUERY_KEY);
      
      queryClient.setQueryData(FAVORITES_QUERY_KEY, (old: any) => {
        if (!old) return old;
        
        const isAlreadyFavorite = old.favorites.some((fav: any) => fav.dishId === dishId);
        if (isAlreadyFavorite) return old;
        
        return {
          ...old,
          favorites: [
            ...old.favorites,
            { dishId, dish: null }
          ],
          count: old.count + 1,
        };
      });
      
      return { previousFavorites };
    },
    onError: (err, variables, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(FAVORITES_QUERY_KEY, context.previousFavorites);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
  });

  const removeMutation = useMutation({
    mutationFn: favoritesApi.removeFavorite,
    onMutate: async (dishId) => {
      await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY });
      
      const previousFavorites = queryClient.getQueryData(FAVORITES_QUERY_KEY);
      
      queryClient.setQueryData(FAVORITES_QUERY_KEY, (old: any) => {
        if (!old) return old;
        
        const newFavorites = old.favorites.filter((fav: any) => fav.dishId !== dishId);
        
        return {
          ...old,
          favorites: newFavorites,
          count: newFavorites.length,
        };
      });
      
      return { previousFavorites };
    },
    onError: (err, variables, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(FAVORITES_QUERY_KEY, context.previousFavorites);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
  });

  const clearMutation = useMutation({
    mutationFn: favoritesApi.clearFavorites,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY });
      
      const previousFavorites = queryClient.getQueryData(FAVORITES_QUERY_KEY);
      
      queryClient.setQueryData(FAVORITES_QUERY_KEY, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          favorites: [],
          count: 0,
        };
      });
      
      return { previousFavorites };
    },
    onError: (err, variables, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(FAVORITES_QUERY_KEY, context.previousFavorites);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
  });

  const toggleFavorite = useCallback(
    (dishId: number) => {
      if (status === "authenticated") {
        const isFavorite = favoritesData?.favorites.some((fav) => fav.dishId === dishId) || false;

        if (isFavorite) {
          removeMutation.mutate(dishId);
        } else {
          addMutation.mutate(dishId);
        }
      } else {
        const isMemoryFavorite = memoryFavorites.isFavorite(dishId);
        
        if (isMemoryFavorite) {
          memoryFavorites.removeFromFavorites(dishId);
        } else {
          memoryFavorites.addToFavorites(dishId);
        }
      }
    },
    [favoritesData, addMutation, removeMutation, status, memoryFavorites],
  );

  const clearFavorites = useCallback(() => {
    if (status === "authenticated") {
      clearMutation.mutate();
    } else {
      memoryFavorites.clearFavorites();
    }
  }, [clearMutation, status, memoryFavorites]);

  const isFavorite = useCallback(
    (dishId: number) => {
      if (status === "authenticated") {
        return favoritesData?.favorites.some((fav) => fav.dishId === dishId) || false;
      } else {
        return memoryFavorites.isFavorite(dishId);
      }
    },
    [favoritesData, status, memoryFavorites],
  );

  const effectiveFavorites = status === "authenticated" 
    ? favoritesData?.favorites || []
    : memoryFavorites.favorites.map(item => ({ dishId: item.dishId, dish: null }));
  
  const effectiveFavoritesCount = status === "authenticated"
    ? favoritesData?.count || 0
    : memoryFavorites.totalFavorites;

  return {
    serverFavorites: effectiveFavorites,
    serverFavoritesCount: effectiveFavoritesCount,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    isLoading: isLoadingFavorites || addMutation.isPending || removeMutation.isPending || clearMutation.isPending,
  };
};
