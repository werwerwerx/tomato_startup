import { HeartIcon, SettingsIcon, ShoppingBagIcon, ClipboardListIcon } from "lucide-react";

export const getUserProfileNavItems = (favoritesCount: number = 0, cartCount: number = 0) => [
  {
    icon: <SettingsIcon className="h-4 w-4" />,
    label: "Настройки",
    href: "/profile/#settings",
  },
  {
    icon: <HeartIcon className="h-4 w-4" />,
    label: `Избранное${favoritesCount > 0 ? ` (${favoritesCount})` : ""}`,
    href: "/profile/#favorites",
  },
  {
    icon: <ShoppingBagIcon className="h-4 w-4" />,
    label: `Корзина${cartCount > 0 ? ` (${cartCount})` : ""}`,
    href: "/profile/#cart",
  },
  {
    icon: <ClipboardListIcon className="h-4 w-4" />,
    label: "Ваши заказы",
    href: "/profile/orders",
  },
];

export const USER_PROFILE_NAV_ITEMS = getUserProfileNavItems();
