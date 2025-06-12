import React, { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const ORDERS_KEY = "ORDERS";
const ORDERS_QUERY_KEY = ["orders"];
const SERVER_ORDERS_QUERY_KEY = ["server-orders"];

const getOrdersLocal = () =>
  JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
const saveOrdersLocal = (orders: any[]) =>
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
const clearOrdersLocal = () => localStorage.removeItem(ORDERS_KEY);

interface OrderItem {
  id: string;
  dishId: number;
  quantity: number;
  price: number;
  dish: {
    id: number;
    name: string;
    description: string;
    image: string;
  };
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  deliveryAddress: string;
  createdAt: Date;
  items: OrderItem[];
}

const fetchServerOrders = async (): Promise<{
  orders: Order[];
  count: number;
}> => {
  const response = await fetch("/api/user/orders/get");
  if (!response.ok) {
    throw new Error("Failed to fetch server orders");
  }
  return response.json();
};

const createOrder = async (deliveryAddress: string) => {
  const response = await fetch("/api/user/orders/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deliveryAddress }),
  });
  if (!response.ok) {
    throw new Error("Failed to create order");
  }
  return response.json();
};

export const useOrders = () => {
  const queryClient = useQueryClient();

  const { data: localOrders = [] } = useQuery({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: getOrdersLocal,
    staleTime: Infinity,
  });

  const { data: serverOrders, refetch: refetchServerOrders } = useQuery({
    queryKey: SERVER_ORDERS_QUERY_KEY,
    queryFn: fetchServerOrders,
    staleTime: 2 * 60 * 1000,
  });

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onMutate: async (deliveryAddress) => {
      await queryClient.cancelQueries({ queryKey: ORDERS_QUERY_KEY });
      
      const previousOrders = queryClient.getQueryData(ORDERS_QUERY_KEY) as Order[] || [];
      
      const optimisticOrder: Order = {
        id: `temp-${Date.now()}`,
        status: "pending",
        totalAmount: 0, // Will be calculated on server
        deliveryAddress,
        createdAt: new Date(),
        items: [], // Will be filled from cart on server
      };
      
      const newOrders = [optimisticOrder, ...previousOrders];
      
      saveOrdersLocal(newOrders);
      queryClient.setQueryData(ORDERS_QUERY_KEY, newOrders);
      
      return { previousOrders };
    },
    onError: (err, deliveryAddress, context) => {
      if (context?.previousOrders) {
        saveOrdersLocal(context.previousOrders);
        queryClient.setQueryData(ORDERS_QUERY_KEY, context.previousOrders);
      }
    },
    onSuccess: (data) => {
      // Remove optimistic order and add real one from server response
      const currentOrders = queryClient.getQueryData(ORDERS_QUERY_KEY) as Order[] || [];
      const filteredOrders = currentOrders.filter(order => !order.id.startsWith('temp-'));
      
      queryClient.setQueryData(ORDERS_QUERY_KEY, filteredOrders);
      saveOrdersLocal(filteredOrders);
      
      // Refresh server orders to get the complete data
      refetchServerOrders();
      
      // Clear cart queries since order creation clears the cart
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-dishes"] });
    },
    onSettled: () => {
      refetchServerOrders();
    },
  });

  const syncWithServer = useCallback(async () => {
    try {
      await refetchServerOrders();
      const serverData = await queryClient.getQueryData(SERVER_ORDERS_QUERY_KEY) as any;
      if (serverData?.orders) {
        const mergedOrders = [...serverData.orders];
        saveOrdersLocal(mergedOrders);
        queryClient.setQueryData(ORDERS_QUERY_KEY, mergedOrders);
      }
    } catch (error) {
      console.error("Failed to sync orders with server:", error);
    }
  }, [queryClient, refetchServerOrders]);

  // Combine local and server orders, prioritizing server data
  const allOrders = React.useMemo(() => {
    const serverOrdersList = serverOrders?.orders || [];
    const localOrdersList = localOrders || [];
    
    // Filter out temp orders that might be duplicates
    const validLocalOrders = localOrdersList.filter((order: Order) => 
      !order.id.startsWith('temp-') && 
      !serverOrdersList.find((serverOrder: Order) => serverOrder.id === order.id)
    );
    
    return [...validLocalOrders, ...serverOrdersList].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [localOrders, serverOrders]);

  return {
    orders: allOrders,
    serverOrders: serverOrders?.orders || [],
    ordersCount: allOrders.length,
    
    createOrder: createOrderMutation.mutate,
    syncWithServer,
    refetchServerOrders,
    
    isCreatingOrder: createOrderMutation.isPending,
    isLoading: createOrderMutation.isPending,
  };
}; 