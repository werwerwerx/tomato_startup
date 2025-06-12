interface FavoriteItem {
  dishId: number;
  dish: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
  };
}

interface FavoritesResponse {
  success: boolean;
  favorites: FavoriteItem[];
  count: number;
}

export const favoritesApi = {
  getFavorites: async (): Promise<FavoritesResponse> => {
    const response = await fetch("/api/user/favorites/get");
    if (!response.ok) {
      throw new Error("Failed to fetch favorites");
    }
    return response.json();
  },

  addFavorite: async (dishId: number) => {
    const response = await fetch("/api/user/favorites/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dishId }),
    });
    if (!response.ok) {
      throw new Error("Failed to add favorite");
    }
    return response.json();
  },

  removeFavorite: async (dishId: number) => {
    const response = await fetch("/api/user/favorites/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dishId }),
    });
    if (!response.ok) {
      throw new Error("Failed to remove favorite");
    }
    return response.json();
  },

  clearFavorites: async () => {
    const response = await fetch("/api/user/favorites/clear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error("Failed to clear favorites");
    }
    return response.json();
  },
}; 