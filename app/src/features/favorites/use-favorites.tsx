import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const FAVORITES_KEY = "FAVORITES";
const FAVORITES_QUERY_KEY = ["favorites"];
const SERVER_FAVORITES_QUERY_KEY = ["server-favorites"];

const getFavoritesLocal = () =>
  JSON.parse(localStorage.getItem(FAVORITES_KEY) || "{}");
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

const fetchServerFavorites = async (): Promise<{
  favorites: ServerFavorite[];
  count: number;
}> => {
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
    onMutate: async ({ dishId }) => {
      await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY });
      
      const previousFavorites = queryClient.getQueryData(FAVORITES_QUERY_KEY) as Record<number, boolean> || {};
      const newFavorites = { ...previousFavorites, [dishId]: true };
      
      saveFavoritesLocal(newFavorites);
      queryClient.setQueryData(FAVORITES_QUERY_KEY, newFavorites);
      
      return { previousFavorites };
    },
    onError: (err, { dishId }, context) => {
      if (context?.previousFavorites) {
        saveFavoritesLocal(context.previousFavorites);
        queryClient.setQueryData(FAVORITES_QUERY_KEY, context.previousFavorites);
      }
    },
    onSettled: () => {
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
    onMutate: async ({ dishId }) => {
      await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY });
      
      const previousFavorites = queryClient.getQueryData(FAVORITES_QUERY_KEY) as Record<number, boolean> || {};
      const newFavorites = { ...previousFavorites };
      delete newFavorites[dishId];
      
      saveFavoritesLocal(newFavorites);
      queryClient.setQueryData(FAVORITES_QUERY_KEY, newFavorites);
      
      return { previousFavorites };
    },
    onError: (err, { dishId }, context) => {
      if (context?.previousFavorites) {
        saveFavoritesLocal(context.previousFavorites);
        queryClient.setQueryData(FAVORITES_QUERY_KEY, context.previousFavorites);
      }
    },
    onSettled: () => {
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

  const clearMutation = useMutation({
    mutationFn: () =>
      fetch("/api/user/favorites/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY });
      
      const previousFavorites = queryClient.getQueryData(FAVORITES_QUERY_KEY) as Record<number, boolean> || {};
      
      clearFavoritesLocal();
      queryClient.setQueryData(FAVORITES_QUERY_KEY, {});
      
      return { previousFavorites };
    },
    onError: (err, variables, context) => {
      if (context?.previousFavorites) {
        saveFavoritesLocal(context.previousFavorites);
        queryClient.setQueryData(FAVORITES_QUERY_KEY, context.previousFavorites);
      }
    },
    onSettled: () => {
      refetchServerFavorites();
    },
  });

  useEffect(() => {
    const localItems = Object.keys(favorites).map((dishId) => ({
      dishId: Number(dishId),
    }));

    if (localItems.length > 0) {
      syncMutation.mutate(localItems);
    } else {
      refetchServerFavorites();
    }
  }, []);

  const toggleFavorite = (dishId: number) => {
    const isFavorite = favorites[dishId] || false;

    if (isFavorite) {
      removeMutation.mutate({ dishId });
    } else {
      addMutation.mutate({ dishId });
    }
  };

  const syncFavorites = () => {
    const items = Object.keys(favorites).map((dishId) => ({
      dishId: Number(dishId),
    }));
    syncMutation.mutate(items);
  };

  const clearFavorites = () => {
    clearMutation.mutate();
  };

  return {
    isFavorite: (dishId: number) => favorites[dishId] || false,
    toggleFavorite,
    getFavoriteItems: () =>
      Object.keys(favorites).map((dishId) => ({
        dishId: Number(dishId),
      })),

    serverFavorites: serverFavorites?.favorites || [],
    serverFavoritesCount: serverFavorites?.count || 0,

    syncFavorites,
    clearFavorites,
    refetchServerFavorites,

    isLoading:
      addMutation.isPending ||
      removeMutation.isPending ||
      syncMutation.isPending ||
      clearMutation.isPending,
  };
};
