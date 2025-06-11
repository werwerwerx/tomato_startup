import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const CART_KEY = "CART";
const CART_QUERY_KEY = ["cart"];

const getCartLocal = () => JSON.parse(localStorage.getItem(CART_KEY) || "{}");
const saveCartLocal = (cart: Record<number, number>) =>
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
const clearCartLocal = () => localStorage.removeItem(CART_KEY);

export const useCart = () => {
  const queryClient = useQueryClient();

  const { data: cart = {} } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: getCartLocal,
    staleTime: Infinity,
  });

  const updateMutation = useMutation({
    mutationFn: ({ dishId, quantity }: { dishId: number; quantity: number }) =>
      fetch("/api/user/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dishId, quantity }),
      }),
  });

  const syncMutation = useMutation({
    mutationFn: (items: Array<{ dishId: number; quantity: number }>) =>
      fetch("/api/user/cart/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      }),
  });

  const updateQuantity = (dishId: number, quantity: number) => {
    const newCart = { ...cart, [dishId]: quantity };
    if (quantity === 0) delete newCart[dishId];

    saveCartLocal(newCart);
    queryClient.setQueryData(CART_QUERY_KEY, newCart);
    updateMutation.mutate({ dishId, quantity });
  };

  const syncCart = () => {
    const items = Object.entries(cart).map(([dishId, quantity]) => ({
      dishId: Number(dishId),
      quantity: quantity as number,
    }));
    syncMutation.mutate(items);
  };

  const clearCart = () => {
    clearCartLocal();
    queryClient.setQueryData(CART_QUERY_KEY, {});
  };

  return {
    getItemQuantity: (dishId: number) => cart[dishId] || 0,
    updateQuantity,
    getCartItems: () =>
      Object.entries(cart).map(([dishId, quantity]) => ({
        dishId: Number(dishId),
        quantity,
      })),
    syncCart,
    clearCart,
    isLoading: updateMutation.isPending || syncMutation.isPending,
  };
};
