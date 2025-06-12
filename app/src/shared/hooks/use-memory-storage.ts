"use client";

import { useState, useCallback } from "react";

export interface CartMemoryItem {
  dishId: number;
  quantity: number;
}

export interface FavoriteMemoryItem {
  dishId: number;
}

let memoryCart: CartMemoryItem[] = [];
let memoryFavorites: FavoriteMemoryItem[] = [];

export const useMemoryCart = () => {
  const [, forceUpdate] = useState({});

  const triggerUpdate = useCallback(() => {
    forceUpdate({});
  }, []);

  const getCart = useCallback(() => memoryCart, []);

  const addToCart = useCallback((dishId: number, quantity: number) => {
    const existingIndex = memoryCart.findIndex(item => item.dishId === dishId);
    
    if (existingIndex >= 0) {
      if (quantity <= 0) {
        memoryCart.splice(existingIndex, 1);
      } else {
        memoryCart[existingIndex].quantity = quantity;
      }
    } else if (quantity > 0) {
      memoryCart.push({ dishId, quantity });
    }
    
    triggerUpdate();
    return memoryCart;
  }, [triggerUpdate]);

  const removeFromCart = useCallback((dishId: number) => {
    memoryCart = memoryCart.filter(item => item.dishId !== dishId);
    triggerUpdate();
    return memoryCart;
  }, [triggerUpdate]);

  const clearCart = useCallback(() => {
    memoryCart = [];
    triggerUpdate();
  }, [triggerUpdate]);

  const getQuantity = useCallback((dishId: number): number => {
    const item = memoryCart.find(item => item.dishId === dishId);
    return item?.quantity || 0;
  }, []);

  const getCartForSync = useCallback(() => {
    return [...memoryCart];
  }, []);

  return {
    cart: memoryCart,
    addToCart,
    removeFromCart,
    clearCart,
    getQuantity,
    getCartForSync,
    totalItems: memoryCart.reduce((sum, item) => sum + item.quantity, 0),
  };
};

export const useMemoryFavorites = () => {
  const [, forceUpdate] = useState({});

  const triggerUpdate = useCallback(() => {
    forceUpdate({});
  }, []);

  const getFavorites = useCallback(() => memoryFavorites, []);

  const addToFavorites = useCallback((dishId: number) => {
    const exists = memoryFavorites.some(item => item.dishId === dishId);
    
    if (!exists) {
      memoryFavorites.push({ dishId });
      triggerUpdate();
    }
    
    return memoryFavorites;
  }, [triggerUpdate]);

  const removeFromFavorites = useCallback((dishId: number) => {
    memoryFavorites = memoryFavorites.filter(item => item.dishId !== dishId);
    triggerUpdate();
    return memoryFavorites;
  }, [triggerUpdate]);

  const clearFavorites = useCallback(() => {
    memoryFavorites = [];
    triggerUpdate();
  }, [triggerUpdate]);

  const isFavorite = useCallback((dishId: number): boolean => {
    return memoryFavorites.some(item => item.dishId === dishId);
  }, []);

  const getFavoritesForSync = useCallback(() => {
    return [...memoryFavorites];
  }, []);

  return {
    favorites: memoryFavorites,
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
    isFavorite,
    getFavoritesForSync,
    totalFavorites: memoryFavorites.length,
  };
}; 