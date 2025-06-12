"use client";

import { UserAdress } from "./adress/user-adress";
import { UserNotifications } from "./user-notifications";
import { SighOutButton } from "@/features/auth/sigh-out.button";

export const UserSettings = () => {
  return (
    <div className="space-y-4">
      <UserAdress />
      <UserNotifications />
      <div className="border-foreground/20 border-t pt-3">
        <SighOutButton className="bg-foreground text-background hover:bg-foreground/90 flex w-full items-center justify-center gap-2 rounded-lg p-3 text-sm font-medium transition-colors" />
      </div>
    </div>
  );
};
