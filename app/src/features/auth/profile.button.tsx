"use client";
import { Button } from "@/shared/components/ui-kit/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Loader2, UserIcon, Package, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui-kit/dropdown-menu";
import { UserAvatar } from "../user/user-avatar";
import { UserInfo } from "../user/user-info";
import { USER_PROFILE_NAV_ITEMS } from "../user/user.profile-nav.constants";
import { SighOutButton } from "./sigh-out.button";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import {
  CardNavSection,
  CardNavRow,
  CardNavContainer,
} from "@/shared/components/card-nav";
export const UserProfileButton = () => {
  const session = useSession();
  const router = useRouter();
  const buttonContent = {
    loading: (
      <Button variant="default" className="w-30" size="lg" disabled={true}>
        <Loader2 className="animate-spin" />
      </Button>
    ),
    authenticated: (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" className="w-30" size="lg">
            <UserIcon className="text-background" />
            <span className="hidden md:block">Профиль</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-70 p-0">
          <CardNavContainer>
            <CardNavSection>
              <UserInfo
                size="md"
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
                <p className="text-bold text-base">{item.label}</p>
              </CardNavRow>
            ))}
            <CardNavRow
              href="/auth/sign-out"
              className="m-0 items-center gap-2 p-0"
            >
              <SighOutButton className="text-foreground/90 m-0 h-full w-full items-center justify-start gap-2 bg-none p-3 !pl-4 text-base hover:text-red-600" />
            </CardNavRow>
          </CardNavContainer>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    unauthenticated: (
      <>
        <Button
          variant="default"
          className="w-30"
          size="lg"
          onClick={() => router.push("/auth")}
        >
          <UserIcon className="text-background" />{" "}
          <span className="hidden md:block">Войти</span>
        </Button>
      </>
    ),
  };

  return <>{buttonContent[session.status]}</>;
};
