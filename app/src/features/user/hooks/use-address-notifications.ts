"use client";

import { useEffect } from "react";

export interface UseAddressNotificationsProps {
  isUpdating: boolean;
  error: string | null;
  onError?: (error: string) => void;
  onSuccess?: () => void;
}

export const useAddressNotifications = ({
  isUpdating,
  error,
  onError,
  onSuccess,
}: UseAddressNotificationsProps) => {
  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  useEffect(() => {
    if (!isUpdating && !error && onSuccess) {
      onSuccess();
    }
  }, [isUpdating, error, onSuccess]);
};
