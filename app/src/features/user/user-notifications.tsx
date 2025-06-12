"use client";

import { BellIcon } from "lucide-react";
import { Switch } from "@/shared/components/ui-kit/switch";
import { useUserNotifications } from "./hooks/use-user-notifications";

export interface UserNotificationsProps {
  initialValue?: boolean;
}
export const UserNotifications = ({
  initialValue = true, // todo api / session in ideal replace it to hook
}: UserNotificationsProps) => {
  const { notifications, toggleNotifications } =
    useUserNotifications(initialValue);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <BellIcon className="text-foreground h-4 w-4" />
        <h4 className="text-foreground text-base font-semibold">Уведомления</h4>
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p className="text-foreground/80 text-sm">
          Присылать уведомления о заказах
        </p>
        <Switch checked={notifications} onCheckedChange={toggleNotifications} />
      </div>
    </div>
  );
};
