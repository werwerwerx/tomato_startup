import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const FAVORITES_KEY = "FAVORITES";
const FAVORITES_QUERY_KEY = ["favorites"];
const SERVER_FAVORITES_QUERY_KEY = ["server-favorites"];

const getFavoritesLocal = () => JSON.parse(localStorage.getItem(FAVORITES_KEY) || "{}");
const saveFavoritesLocal = (favorites: Record<number, boolean>) =>
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
const clearFavoritesLocal = () => localStorage.removeItem(FAVORITES_KEY);

interface ServerFavorite {
  dishId: number;
  dish: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
  };
}

const fetchServerFavorites = async (): Promise<{ favorites: ServerFavorite[]; count: number }> => {
  const response = await fetch("/api/user/favorites/get");
  if (!response.ok) {
    throw new Error("Failed to fetch server favorites");
  }
  return response.json();
};

export const useFavorites = () => {
  const queryClient = useQueryClient();

  const { data: favorites = {} } = useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: getFavoritesLocal,
    staleTime: Infinity,
  });

  const { data: serverFavorites, refetch: refetchServerFavorites } = useQuery({
    queryKey: SERVER_FAVORITES_QUERY_KEY,
    queryFn: fetchServerFavorites,
    staleTime: 5 * 60 * 1000,
  });

  const addMutation = useMutation({
    mutationFn: ({ dishId }: { dishId: number }) =>
      fetch("/api/user/favorites/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dishId }),
      }),
    onSuccess: () => {
      refetchServerFavorites();
    },
  });

  const removeMutation = useMutation({
    mutationFn: ({ dishId }: { dishId: number }) =>
      fetch("/api/user/favorites/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dishId }),
      }),
    onSuccess: () => {
      refetchServerFavorites();
    },
  });

  const syncMutation = useMutation({
    mutationFn: (items: Array<{ dishId: number }>) =>
      fetch("/api/user/favorites/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      }),
    onSuccess: () => {
      refetchServerFavorites();
    },
  });

  // Автоматическая синхронизация при монтировании
  useEffect(() => {
    const localItems = Object.keys(favorites).map((dishId) => ({
      dishId: Number(dishId),
    }));
    
    if (localItems.length > 0) {
      syncMutation.mutate(localItems);
    } else {
      refetchServerFavorites();
    }
  }, []); // Только при монтировании

  const toggleFavorite = (dishId: number) => {
    const isFavorite = favorites[dishId] || false;
    const newFavorites = { ...favorites };
    
    if (isFavorite) {
      delete newFavorites[dishId];
      removeMutation.mutate({ dishId });
    } else {
      newFavorites[dishId] = true;
      addMutation.mutate({ dishId });
    }

    saveFavoritesLocal(newFavorites);
    queryClient.setQueryData(FAVORITES_QUERY_KEY, newFavorites);
  };

  const syncFavorites = () => {
    const items = Object.keys(favorites).map((dishId) => ({
      dishId: Number(dishId),
    }));
    syncMutation.mutate(items);
  };

  const clearFavorites = () => {
    clearFavoritesLocal();
    queryClient.setQueryData(FAVORITES_QUERY_KEY, {});
    refetchServerFavorites();
  };

  return {
    // Локальные методы
    isFavorite: (dishId: number) => favorites[dishId] || false,
    toggleFavorite,
    getFavoriteItems: () =>
      Object.keys(favorites).map((dishId) => ({
        dishId: Number(dishId),
      })),
    
    // Серверные данные
    serverFavorites: serverFavorites?.favorites || [],
    serverFavoritesCount: serverFavorites?.count || 0,
    
    // Методы синхронизации
    syncFavorites,
    clearFavorites,
    refetchServerFavorites,
    
    // Состояния загрузки
    isLoading: addMutation.isPending || removeMutation.isPending || syncMutation.isPending,
  };
};
