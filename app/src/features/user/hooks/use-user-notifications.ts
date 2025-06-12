"use client";

import { useState } from "react";

export interface UseUserNotificationsReturn {
  notifications: boolean;
  toggleNotifications: () => void;
  setNotifications: (enabled: boolean) => void;
}
// todo add api / session
export const useUserNotifications = (
  initialValue: boolean = true,
): UseUserNotificationsReturn => {
  const [notifications, setNotifications] = useState(initialValue);

  const toggleNotifications = () => {
    setNotifications((prev) => !prev);
  };

  return {
    notifications,
    toggleNotifications,
    setNotifications,
  };
};
