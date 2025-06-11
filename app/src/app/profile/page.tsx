"use client";

import { Button } from "@/shared/components/ui-kit/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserAvatar } from "@/features/user/user-avatar";

import * as React from "react";
import { cn } from "@/shared/lib/utils";
import {
  ArrowRightIcon,
  HeartIcon,
  LogOutIcon,
  SettingsIcon,
  MapPinIcon,
  BellIcon,
  EditIcon,
} from "lucide-react";
import { SighOutButton } from "@/features/auth/sigh-out.button";
import { ShoppingBagIcon } from "lucide-react";
import { UserInfo } from "@/features/user/user-info";
import { USER_PROFILE_NAV_ITEMS } from "@/features/user/user.profile-nav.constants";
import {
  CardNavContainer,
  CardNavSection,
  CardNavRow,
} from "@/shared/components/card-nav";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui-kit/accordion";

export interface IProfileProps {}

export default function ProfilePage(props: IProfileProps) {
  const session = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = React.useState(true);
  const [address, setAddress] = React.useState("ул. Пушкина, д. 10, кв. 15");
  const [isEditingAddress, setIsEditingAddress] = React.useState(false);

  if (session.status === "unauthenticated") {
    router.push("/auth");
  }

  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
    setIsEditingAddress(false);
  };

  const map: Record<string, React.ReactNode> = {
    authenticated: (
      <>
        <CardNavContainer className="md:hidden">
          
          <CardNavSection>
            <UserInfo
              user={{
                name: session.data?.user?.name || "",
                email: session.data?.user?.email || "",
                image: session.data?.user?.image,
              }}
            />
          </CardNavSection>
          {USER_PROFILE_NAV_ITEMS.map((item) => (
            <CardNavRow
              href={item.href}
              className="items-center gap-2"
              key={item.href}
            >
              {item.icon}
              <p className="text-bold text-lg">{item.label}</p>
            </CardNavRow>
          ))}
        </CardNavContainer>

        {/* Секция настроек */}
        <section className="w-full" id="settings">
          <div className="bg-background w-full rounded-lg border p-4 md:p-6">
            <div className="mb-4 flex items-center gap-2 md:mb-6 md:gap-3">
              <SettingsIcon className="text-foreground h-5 w-5 md:h-6 md:w-6" />
              <h2 className="text-foreground text-xl font-bold md:text-2xl">
                Настройки
              </h2>
            </div>

            <div className="space-y-4 md:space-y-6">
              {/* Адрес доставки */}
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="text-foreground h-4 w-4 md:h-5 md:w-5" />
                  <h3 className="text-foreground text-base font-semibold md:text-lg">
                    Адрес доставки
                  </h3>
                </div>
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
                  {isEditingAddress ? (
                    <div className="flex w-full flex-col gap-2 md:flex-row">
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="border-foreground/20 bg-background text-foreground placeholder-foreground/60 w-full rounded-lg border px-3 py-2 text-sm md:flex-1 md:text-base"
                        placeholder="Введите адрес"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAddressChange(address)}
                          variant="secondary"
                          size="sm"
                          className="flex-1 md:flex-none"
                        >
                          Сохранить
                        </Button>
                        <Button
                          onClick={() => setIsEditingAddress(false)}
                          variant="outline"
                          size="sm"
                          className="flex-1 md:flex-none"
                        >
                          Отмена
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <p className="text-foreground/80 text-sm md:text-base">
                        {address}
                      </p>
                      <Button
                        onClick={() => setIsEditingAddress(true)}
                        variant="secondary"
                        size="sm"
                        className="w-full gap-2 md:w-auto"
                      >
                        <EditIcon className="h-4 w-4" />
                        Изменить
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Уведомления */}
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center gap-2">
                  <BellIcon className="text-foreground h-4 w-4 md:h-5 md:w-5" />
                  <h3 className="text-foreground text-base font-semibold md:text-lg">
                    Уведомления
                  </h3>
                </div>
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <p className="text-foreground/80 text-sm md:text-base">
                    Присылать ли уведомления о новинках
                  </p>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      notifications ? "bg-primary" : "bg-foreground/30",
                    )}
                  >
                    <span
                      className={cn(
                        "bg-background inline-block h-4 w-4 transform rounded-full transition-transform",
                        notifications ? "translate-x-6" : "translate-x-1",
                      )}
                    />
                  </button>
                </div>
              </div>

              {/* Выйти из аккаунта */}
              <div className="border-foreground/20 border-t pt-3 md:pt-4">
                <SighOutButton className="bg-foreground text-background hover:bg-foreground/90 flex w-full items-center justify-center gap-2 rounded-lg p-3 text-sm font-medium transition-colors md:text-base" />
              </div>
            </div>
          </div>
        </section>

        <section className="text-2xl font-bold" id="orders">
          Ваши заказы:
        </section>
      </>
    ),
    unauthenticated: <div>Unauthenticated</div>,
    loading: <div>Loading...</div>,
  };

  return (
    <div className="mt-5 flex w-full flex-col gap-6">{map[session.status]}</div>
  );
}
