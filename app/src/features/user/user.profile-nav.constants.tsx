import { HeartIcon, SettingsIcon, ShoppingBagIcon } from "lucide-react";

export const USER_PROFILE_NAV_ITEMS: {
  icon: React.ReactNode;
  label: string;
  href: string;
}[] = [
  {
    icon: <SettingsIcon className="h-4 w-4" />,
    label: "Настройки",
    href: "/profile/#settings",
  },
  {
    icon: <HeartIcon className="h-4 w-4" />,
    label: "Избранное",
    href: "/profile/#favorites",
  },
  {
    icon: <ShoppingBagIcon className="h-4 w-4" />,
    label: "Ваши заказы",
    href: "/profile/orders",
  },
];
