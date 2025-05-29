import Link from "next/link";
import * as React from "react";
import { cn } from "../lib/utils";
import Image from "next/image";
import { assets } from "@assets";
import { Button } from "@/shared/components/ui-kit/button";
import { ImageUnkownSize } from "./Image";
import { Input } from "@/shared/components/ui-kit/input";
import { useState } from "react";
import { ButtonSearch } from "@/features/search";
const links = [
  {
    label: "Главная",
    href: "/",
  },
  {
    label: "О нас",
    href: "/about",
  },
  {
    label: "Контакты",
    href: "/contacts",
  },
] as const;

export function Header() {
  return (
    <div className="bg-background/20 fixed top-0 right-0 left-0 z-50 container mx-auto flex h-[70px] w-full items-center justify-between border-b px-2 py-4 backdrop-blur-sm">
      <Logo />
      <Nav />
      <ButtonSearch />
    </div>
  );
}

const Nav = () => (
  <Section className="hidden md:flex">
    {links.map((link) => (
      <NavLink key={link.href} href={link.href}>
        {link.label}
      </NavLink>
    ))}
  </Section>
);

const Logo = () => (
  <div className="relative flex h-[40px] w-[100px] items-center justify-center">
    <Image src={assets.logo} alt="Logo" fill className="object-contain" />
  </div>
);

const NavLink = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) => (
  <Link
    href={href}
    className="text-foreground/80 hover:text-foreground text-sm transition-colors"
  >
    {children}
  </Link>
);
const Section = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn("flex w-[50%] items-center justify-center gap-2", className)}
  >
    {children}
  </div>
);
