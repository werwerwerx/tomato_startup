"use client";
import { cn } from "@/shared/lib/utils";
import { assets } from "@assets";
import { Button } from "@/shared/components/ui-kit/button";
import {
  ShoppingCartIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { SearchFeature as Search } from "@/features/search";
import { HTMLAttributes } from "react";
import { DesktopNavBar, NavBarBottom, NavIcon } from "@/shared/components/header-navs";


export const foregroundStyles = "bg-background/95 backdrop-blur-3xl"

export const Header = ({isAuthorized}: {isAuthorized: boolean}) => {
  return (
    <>
      <HeaderContainer className={cn("fixed top-0 z-50", foregroundStyles)}>
        <HeaderContent className="justify-between">
          <HeaderSection className="md:w-[20%]">
            <Logo />
          </HeaderSection>

          <HeaderSection className="justify-end  md:justify-start md:w-[30%]">
            <Search />
          </HeaderSection>

          <HeaderSection className="hidden md:flex w-[25%]">
            <DesktopNavBar />
          </HeaderSection>


          <HeaderSection className="hidden md:flex w-[20%] justify-end">
            <Link href="/auth">
            <Button variant="default" className="" size="lg">
              <NavIcon icon={UserIcon} className="text-background" />
              {isAuthorized ? <span className="hidden md:block">Профиль</span> : <span className="hidden md:block">Войти</span>}
            </Button>
            </Link>
            <Button variant="outline" className="" size="lg">
              <NavIcon icon={ShoppingCartIcon} />
              <span className="hidden md:block">Корзина</span>
            </Button>
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
      "flex w-screen items-center justify-center border-b px-2 shadow-neutral-400/5 shadow-lg backdrop-blur-3xl",
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

export const Logo = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <Link href="/">
    <img
      src={assets.logo.src}
      alt="logo"
      className={cn("h-auto w-25", className)}
      {...props}
    />
  </Link>
);