import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { cartApi } from "../api";

const CART_QUERY_KEY = ["cart"];

export const useCart = () => {
  const queryClient = useQueryClient();

  const { data: cartData, isLoading: isLoadingCart } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: cartApi.getCart,
    staleTime: 2 * 60 * 1000,
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
      updateMutation.mutate({ dishId, quantity });
    },
    [updateMutation],
  );

  const clearCart = useCallback(() => {
    clearMutation.mutate();
  }, [clearMutation]);

  const getItemQuantity = useCallback(
    (dishId: number) => {
      const item = cartData?.cartItems.find((item) => item.dishId === dishId);
      return item?.quantity || 0;
    },
    [cartData],
  );

  const getCartItems = useCallback(() => {
    return cartData?.cartItems || [];
  }, [cartData]);

  return {
    cartItems: cartData?.cartItems || [],
    totalItems: cartData?.cartItems.reduce((sum, item) => sum + item.quantity, 0) || 0,
    getItemQuantity,
    updateQuantity,
    getCartItems,
    clearCart,
    isLoading: isLoadingCart || updateMutation.isPending || clearMutation.isPending,
  };
};
