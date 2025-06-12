"use client";

import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api/user.api";

const DEFAULT_ADDRESS = "Вы ещё не указали адрес доставки";

const USER_QUERY_KEYS = {
  session: ["user", "session"],
  address: ["user", "address"],
} as const;

export interface UseUserAddressReturn {
  currentAddress: string;
  isUpdating: boolean;
  error: string | null;
  updateAddress: (newAddress: string) => Promise<void>;
}

export const useUserAddress = (): UseUserAddressReturn => {
  const { data: session, update } = useSession();
  const queryClient = useQueryClient();

  const updateAddressMutation = useMutation({
    mutationFn: userApi.updateAddress,
    onMutate: async (newAddress) => {
      await queryClient.cancelQueries({ queryKey: USER_QUERY_KEYS.session });
      
      const previousSession = queryClient.getQueryData(USER_QUERY_KEYS.session);
      
      if (session?.user) {
        const optimisticSession = {
          ...session,
          user: {
            ...session.user,
            adress: newAddress,
          },
        };
        
        queryClient.setQueryData(USER_QUERY_KEYS.session, optimisticSession);
      }

      return { previousSession };
    },
    onSuccess: async (data) => {
      if (data.shouldRefreshSession) {
        await update();
      }
      
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.session });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.address });
    },
    onError: (error, newAddress, context) => {
      if (context?.previousSession) {
        queryClient.setQueryData(USER_QUERY_KEYS.session, context.previousSession);
      }
      console.error("Ошибка при обновлении адреса:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.session });
    },
  });

  const currentAddress = session?.user?.adress || DEFAULT_ADDRESS;

  const updateAddress = async (newAddress: string): Promise<void> => {
    if (!newAddress.trim()) {
      throw new Error("Адрес не может быть пустым");
    }

    await updateAddressMutation.mutateAsync(newAddress);
  };

  return {
    currentAddress,
    isUpdating: updateAddressMutation.isPending,
    error: updateAddressMutation.error
      ? updateAddressMutation.error instanceof Error
        ? updateAddressMutation.error.message
        : "Произошла ошибка при обновлении адреса"
      : null,
    updateAddress,
  };
};
