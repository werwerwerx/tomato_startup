import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { favoritesApi } from "./api";

const FAVORITES_QUERY_KEY = ["favorites"];

export const useFavorites = () => {
  const queryClient = useQueryClient();

  const { data: favoritesData, isLoading: isLoadingFavorites } = useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: favoritesApi.getFavorites,
    staleTime: 5 * 60 * 1000,
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
      const isFavorite = favoritesData?.favorites.some((fav) => fav.dishId === dishId) || false;

      if (isFavorite) {
        removeMutation.mutate(dishId);
      } else {
        addMutation.mutate(dishId);
      }
    },
    [favoritesData, addMutation, removeMutation],
  );

  const clearFavorites = useCallback(() => {
    clearMutation.mutate();
  }, [clearMutation]);

  const isFavorite = useCallback(
    (dishId: number) => {
      return favoritesData?.favorites.some((fav) => fav.dishId === dishId) || false;
    },
    [favoritesData],
  );

  return {
    serverFavorites: favoritesData?.favorites || [],
    serverFavoritesCount: favoritesData?.count || 0,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    isLoading: isLoadingFavorites || addMutation.isPending || removeMutation.isPending || clearMutation.isPending,
  };
};
