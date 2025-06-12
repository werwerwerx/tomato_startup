"use client";
import { cn } from "@/shared/lib/utils";
import { assets } from "@assets";
import { Button } from "@/shared/components/ui-kit/button";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import { SearchFeature as Search } from "@/features/search";
import { HTMLAttributes } from "react";
import {
  DesktopNavBar,
  NavBarBottom,
  NavIcon,
} from "@/shared/components/header-navs";
import { UserProfileButton } from "@/features/auth/profile.button";
import { CartButton } from "@/features/cart/cart.button";

export const foregroundStyles = "bg-background/95 backdrop-blur-3xl";

export const Header = () => {
  return (
    <>
      <HeaderContainer className={cn("fixed top-0 z-50", foregroundStyles)}>
        <HeaderContent className="justify-between">
          <HeaderSection className="md:w-[20%]">
            <Logo />
          </HeaderSection>

          <HeaderSection className="justify-end md:w-[30%] md:justify-start">
            <Search />
          </HeaderSection>

          <HeaderSection className="hidden w-[25%] md:flex">
            <DesktopNavBar />
          </HeaderSection>

          <HeaderSection className="hidden w-[20%] justify-end md:flex">
            <Link href="/auth">
              <UserProfileButton />
            </Link>
            
            <CartButton/>
          </HeaderSection>
        </HeaderContent>
      </HeaderContainer>

      {/* MOBILE BOTTOM BAR */}
      <NavBarBottom />
    </>
  );
};

export const HeaderContainer = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <header
    className={cn(
      "flex w-screen items-center justify-center border-b px-2 shadow-lg shadow-neutral-400/5 backdrop-blur-3xl",
      className,
    )}
    {...props}
  >
    {children}
  </header>
);

export const HeaderSection = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex h-full w-full flex-row items-center justify-between gap-2 px-2 py-5",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export const HeaderContent = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("container flex h-20 flex-row items-center", className)}
    {...props}
  >
    {children}
  </div>
);

export const Logo = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <Link href="/">
    <img
      src={assets.logo.src}
      alt="logo"
      className={cn("h-auto w-25", className)}
      {...props}
    />
  </Link>
);
