interface CartItem {
  dishId: number;
  quantity: number;
  dish: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
  };
}

interface CartResponse {
  success: boolean;
  cartItems: CartItem[];
  count: number;
}

export const cartApi = {
  getCart: async (): Promise<CartResponse> => {
    const response = await fetch("/api/user/cart/dishes");
    if (!response.ok) {
      throw new Error("Failed to fetch cart");
    }
    return response.json();
  },

  updateCartItem: async ({
    dishId,
    quantity,
  }: {
    dishId: number;
    quantity: number;
  }) => {
    const response = await fetch("/api/user/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dishId, quantity }),
    });
    if (!response.ok) {
      throw new Error("Failed to update cart item");
    }
    return response.json();
  },

  clearCart: async () => {
    const response = await fetch("/api/user/cart/clear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error("Failed to clear cart");
    }
    return response.json();
  },
};
