"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import * as React from "react";
import { ClipboardListIcon, SettingsIcon } from "lucide-react";
import { UserInfo } from "@/features/user/user-info";
import { getUserProfileNavItems } from "@/features/user/user.profile-nav.constants";
import { CardNavContainer, CardNavSection } from "@/shared/components/card-nav";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui-kit/accordion";
import { UserSettings } from "@/features/user/user-settings";
import { ListFavorites } from "@/features/favorites/list-favorites";
import { useFavorites } from "@/features/favorites/use-favorites";
import { ListCart } from "@/features/cart/list-cart";
import { useCart } from "@/features/cart/hooks/use-cart";

export interface IProfileProps {}

export default function ProfilePage(props: IProfileProps) {
  const session = useSession();
  const router = useRouter();
  const { serverFavoritesCount } = useFavorites();
  const { getCartItems } = useCart();

  const cartItems = getCartItems();
  const cartItemsCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const profileNavItems = getUserProfileNavItems(
    serverFavoritesCount,
    cartItemsCount,
  );
  if (session.status === "unauthenticated") {
    router.push("/auth");
  }

  const map: Record<string, React.ReactNode> = {
    authenticated: (
      <>
        <CardNavContainer size="full" className="w-full">
          <CardNavSection size="full" className="w-full">
            <UserInfo
              size="lg"
              user={{
                name: session.data?.user?.name || "",
                email: session.data?.user?.email || "unkown@unkown.com",
                image: session.data?.user?.image,
              }}
            />
            <div className="mt-5 flex flex-col gap-4">
              <div className="flex items-center gap-2 border-t pt-4 text-lg font-bold">
                <SettingsIcon className="h-4 w-4" />
                <span>Настройки</span>
              </div>
              <UserSettings />
            </div>
          </CardNavSection>

          <Accordion type="multiple" className="w-full">
            {profileNavItems.map((item) => (
              <AccordionItem
                key={item.href}
                value={item.href}
                className="w-full"
              >
                <AccordionTrigger className="flex w-full items-center gap-2 px-5 py-4 hover:bg-neutral-300/50">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-lg font-bold">{item.label}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="w-full px-5 pb-5">
                  {item.label === "Настройки" && <UserSettings />}
                  {item.label.startsWith("Избранное") && <ListFavorites />}
                  {item.label.startsWith("Корзина") && <ListCart />}
                  {item.label === "Ваши заказы" && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <ClipboardListIcon className="mb-4 h-16 w-16 text-gray-300" />
                      <h3 className="mb-2 text-lg font-semibold text-gray-600">
                        Вы пока не делали заказы
                      </h3>
                      <p className="max-w-sm text-sm text-gray-500">
                        Добавьте блюда в корзину и оформите ваш первый заказ
                      </p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardNavContainer>
      </>
    ),
    unauthenticated: <div>Unauthenticated</div>,
    loading: <div>Loading...</div>,
  };

  return (
    <div className="mt-5 flex w-full flex-col gap-6">{map[session.status]}</div>
  );
}
