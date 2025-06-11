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
import { UserAdress } from "@/features/user/adress/user-adress";

export interface IProfileProps {}

export default function ProfilePage(props: IProfileProps) {
  const session = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = React.useState(true);

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
                email: session.data?.user?.email || "",
                image: session.data?.user?.image,
              }}
            />
          </CardNavSection>

          <Accordion type="multiple" className="w-full">
            {USER_PROFILE_NAV_ITEMS.map((item) => (
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
                  {item.label === "Настройки" && (
                    <div className="space-y-4">
                      <UserAdress />
                      {/* Уведомления */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <BellIcon className="text-foreground h-4 w-4" />
                          <h4 className="text-foreground text-base font-semibold">
                            Уведомления
                          </h4>
                        </div>
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <p className="text-foreground/80 text-sm">
                            Присылать уведомления о заказах
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
                                notifications
                                  ? "translate-x-6"
                                  : "translate-x-1",
                              )}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Выйти из аккаунта */}
                      <div className="border-foreground/20 border-t pt-3">
                        <SighOutButton className="bg-foreground text-background hover:bg-foreground/90 flex w-full items-center justify-center gap-2 rounded-lg p-3 text-sm font-medium transition-colors" />
                      </div>
                    </div>
                  )}
                  {item.label === "Избранное" && (
                    <div className="text-foreground/80 w-full text-sm">
                      Здесь будут ваши избранные блюда
                    </div>
                  )}
                  {item.label === "Ваши заказы" && (
                    <div className="text-foreground/80 w-full text-sm">
                      Здесь будет история ваших заказов
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
