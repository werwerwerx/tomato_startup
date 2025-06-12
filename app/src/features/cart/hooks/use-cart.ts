import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useEffect } from "react";
import { syncCart, clearCart as clearCartAPI } from "../api";

const CART_KEY = "CART";
const CART_QUERY_KEY = ["cart"];
const CART_DISHES_QUERY_KEY = ["cart-dishes"];
const SYNC_DELAY_MS = 1000;

const getCartLocal = () => JSON.parse(localStorage.getItem(CART_KEY) || "{}");
const saveCartLocal = (cart: Record<number, number>) =>
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
const clearCartLocal = () => localStorage.removeItem(CART_KEY);

export const useCart = () => {
  const queryClient = useQueryClient();
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingSyncRef = useRef(false);

  const { data: cart = {} } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: getCartLocal,
    staleTime: Infinity,
  });

  const syncMutation = useMutation({
    mutationFn: syncCart,
    onMutate: () => {
      pendingSyncRef.current = true;
    },
    onSettled: () => {
      pendingSyncRef.current = false;
      queryClient.invalidateQueries({ queryKey: CART_DISHES_QUERY_KEY });
    },
  });

  const clearMutation = useMutation({
    mutationFn: clearCartAPI,
    onSuccess: () => {
      clearCartLocal();
      queryClient.setQueryData(CART_QUERY_KEY, {});
      queryClient.invalidateQueries({ queryKey: CART_DISHES_QUERY_KEY });
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = null;
      }
    },
  });

  const debouncedSync = useCallback(() => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(() => {
      const items = Object.entries(cart)
        .map(([dishId, quantity]) => ({
          dishId: Number(dishId),
          quantity: quantity as number,
        }))
        .filter((item) => item.quantity > 0);

      if (items.length > 0 && !pendingSyncRef.current) {
        syncMutation.mutate(items);
      }
    }, SYNC_DELAY_MS);
  }, [cart, syncMutation]);

  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  const updateQuantity = useCallback(
    (dishId: number, quantity: number) => {
      const newCart = { ...cart, [dishId]: quantity };
      if (quantity === 0) delete newCart[dishId];

      saveCartLocal(newCart);
      queryClient.setQueryData(CART_QUERY_KEY, newCart);

      debouncedSync();
    },
    [cart, queryClient, debouncedSync],
  );

  const forceSyncNow = useCallback(() => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = null;
    }

    const items = Object.entries(cart)
      .map(([dishId, quantity]) => ({
        dishId: Number(dishId),
        quantity: quantity as number,
      }))
      .filter((item) => item.quantity > 0);

    if (items.length > 0) {
      syncMutation.mutate(items);
    }
  }, [cart, syncMutation]);

  const clearCart = useCallback(() => {
    clearMutation.mutate();
  }, [clearMutation]);

  return {
    getItemQuantity: (dishId: number) => cart[dishId] || 0,
    updateQuantity,
    getCartItems: () =>
      Object.entries(cart).map(([dishId, quantity]) => ({
        dishId: Number(dishId),
        quantity: quantity as number,
      })),
    forceSyncNow,
    clearCart,
    isLoading: syncMutation.isPending || clearMutation.isPending,
    hasPendingSync: !!syncTimeoutRef.current,
  };
};
