import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useSession } from "next-auth/react";
import { cartApi } from "../api";
import { useMemoryCart } from "@/shared/hooks/use-memory-storage";
import { useSyncData } from "@/shared/hooks/use-sync-data";

const CART_QUERY_KEY = ["cart"];

export const useCart = () => {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const memoryCart = useMemoryCart();

  const { data: cartData, isLoading: isLoadingCart } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: cartApi.getCart,
    staleTime: 2 * 60 * 1000,
    enabled: status === "authenticated",
  });

  useSyncData({
    queryKey: CART_QUERY_KEY,
    syncEndpoint: "/api/user/cart/sync",
    getCacheData: () => memoryCart.getCartForSync(),
    onSync: (success) => {
      if (success) {
        memoryCart.clearCart();
        queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      }
    },
    onLogout: () => {
      if (cartData?.cartItems) {
        cartData.cartItems.forEach(item => {
          memoryCart.addToCart(item.dishId, item.quantity);
        });
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: cartApi.updateCartItem,
    onMutate: async ({ dishId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      
      const previousCart = queryClient.getQueryData(CART_QUERY_KEY);
      
      queryClient.setQueryData(CART_QUERY_KEY, (old: any) => {
        if (!old) return old;
        
        const existingItemIndex = old.cartItems.findIndex((item: any) => item.dishId === dishId);
        const newCartItems = [...old.cartItems];
        
        if (quantity === 0) {
          if (existingItemIndex >= 0) {
            newCartItems.splice(existingItemIndex, 1);
          }
        } else {
          if (existingItemIndex >= 0) {
            newCartItems[existingItemIndex] = {
              ...newCartItems[existingItemIndex],
              quantity,
            };
          }
        }
        
        return {
          ...old,
          cartItems: newCartItems,
          count: newCartItems.length,
        };
      });
      
      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  const clearMutation = useMutation({
    mutationFn: cartApi.clearCart,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      
      const previousCart = queryClient.getQueryData(CART_QUERY_KEY);
      
      queryClient.setQueryData(CART_QUERY_KEY, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          cartItems: [],
          count: 0,
        };
      });
      
      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  const updateQuantity = useCallback(
    (dishId: number, quantity: number) => {
      if (status === "authenticated") {
        updateMutation.mutate({ dishId, quantity });
      } else {
        memoryCart.addToCart(dishId, quantity);
      }
    },
    [updateMutation, status, memoryCart],
  );

  const clearCart = useCallback(() => {
    if (status === "authenticated") {
      clearMutation.mutate();
    } else {
      memoryCart.clearCart();
    }
  }, [clearMutation, status, memoryCart]);

  const getItemQuantity = useCallback(
    (dishId: number) => {
      if (status === "authenticated") {
        const item = cartData?.cartItems.find((item) => item.dishId === dishId);
        return item?.quantity || 0;
      } else {
        return memoryCart.getQuantity(dishId);
      }
    },
    [cartData, status, memoryCart],
  );

  const getCartItems = useCallback(() => {
    if (status === "authenticated") {
      return cartData?.cartItems || [];
    } else {
      return memoryCart.cart.map(item => ({
        dishId: item.dishId,
        quantity: item.quantity,
        dish: null,
      }));
    }
  }, [cartData, status, memoryCart]);

  const totalItems = status === "authenticated" 
    ? cartData?.cartItems.reduce((sum, item) => sum + item.quantity, 0) || 0
    : memoryCart.totalItems;

  return {
    cartItems: getCartItems(),
    totalItems,
    getItemQuantity,
    updateQuantity,
    getCartItems,
    clearCart,
    isLoading: isLoadingCart || updateMutation.isPending || clearMutation.isPending,
  };
};
