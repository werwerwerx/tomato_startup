"use client";
import { cn } from "@/shared/lib/utils";
import { assets } from "@assets";
import { Button } from "@/shared/components/ui-kit/button";
import {
  Grip,
  MenuIcon,
  ShoppingCartIcon,
  UserIcon,
  LucideIcon,
  SearchIcon,
  X,
  Icon,
  PhoneIcon,
} from "lucide-react";
import Link from "next/link";
import { HTMLAttributes, useState } from "react";
import { usePathname } from "next/navigation";

const withDelay = (callback: () => void, delay = 100) => {
  setTimeout(callback, delay);
};

export const Header = () => {
  return (
    <>
      <Container>
        <Content className="justify-between">
          <Section className="md:w-[20%]">
            <Logo />
          </Section>

          <Section className="justify-end md:justify-start md:w-[30%]">
            <Search />
          </Section>

          <Section className="hidden md:flex w-[25%]">
            <DesktopNavBar />
          </Section>


          <Section className="hidden md:flex w-[20%] justify-end">
            <Button variant="default" className="h-full">
              <NavIcon icon={UserIcon} className="text-background" />
              <span className="hidden md:block">Профиль</span>
            </Button>

            <Button variant="outline" className="h-full">
              <NavIcon icon={ShoppingCartIcon} />
              <span className="hidden md:block">Корзина</span>
            </Button>
          </Section>
        </Content>
      </Container>

      {/* MOBLIE BOTTOM BAR */}
      <NavBarBottom />
    </>
  );
};

const Search = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    withDelay(() => setIsInputVisible(true));
  };

  const handleClose = () => {
    setIsInputVisible(false);
    withDelay(() => setIsOpen(false));
  };

  return (
    <>
    {/* default state */}
      <Button
        onClick={handleOpen}
        variant="outline"
        className="hover:bg-foreground/5 flex h-12 w-12 items-center justify-center rounded-md md:rounded-md p-0 transition-colors md:h-full md:w-full"
      >
        <SearchIcon className="text-foreground/80" />
        <input
          type="text"
          placeholder="Поиск..."
          className="placeholder:text-foreground/60 hidden h-full w-full bg-transparent text-base outline-none md:block"
          autoFocus
        />
      </Button>

      {/* mobile open state */}
      {isOpen && (
        <div
          className={cn(
            "bg-background/80 fixed inset-0 z-50 flex flex-col items-start justify-center backdrop-blur-sm transition-opacity duration-300 md:hidden",
            isOpen ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="container mt-10 flex w-full items-center justify-center px-4">
            <div className="flex h-15 w-[80%] items-center justify-between">
              <div
                className={cn(
                  "bg-card relative flex w-full items-center rounded-md border px-4 transition-all duration-300",
                  isInputVisible ? "h-full opacity-100" : "h-0 opacity-0",
                )}
              >
                <SearchIcon
                  size={20}
                  className="text-foreground/60 mr-2 shrink-0"
                />
                <input
                  type="text"
                  placeholder="Поиск..."
                  className="placeholder:text-foreground/60 h-full w-full bg-transparent text-base outline-none"
                  autoFocus
                />
                <button
                  onClick={handleClose}
                  className="hover:bg-foreground/5 ml-4 rounded-full p-2 transition-colors"
                >
                  <X size={20} className="text-foreground/80" />
                </button>
              </div>
            </div>
          </div>
          <div className="h-full w-full" onClick={handleClose}></div>
        </div>
      )}
    </>
  );
};

const navsHeader = [
  {
    label: "Главная",
    href: "/",
  },
  {
    label: "Меню",
    href: "/menu",
  },
  {
    label: "Контакты",
    href: "/contacts",
  },
];
const DesktopNavBar = () => {
  const currRoute = usePathname();
  return (
    <div className="flex gap-4">
      {navsHeader.map((nav) => (
        <Link
          href={nav.href}
          key={nav.label}
          className={cn(
            "text-md font-bold transition-colors duration-300",
            currRoute === nav.href ? "text-primary" : "text-foreground/50",
          )}
        >
          {nav.label}
        </Link>
      ))}
    </div>
  );
};

const NavIcon = ({
  icon: Icon,
  isActive,
  className = "",
}: {
  icon: LucideIcon;
  isActive?: boolean;
  className?: string;
}) => (
  <Icon
    size={25}
    strokeWidth={1.5}
    className={cn(
      "transition-colors duration-300",
      isActive ? "text-primary" : "text-foreground/90",
      className,
    )}
  />
);
const bottomNavItems = [
  {
    label: "Главная",
    icon: Grip,
    href: "/",
  },
  {
    label: "Меню",
    icon: MenuIcon,
    href: "/menu",
  },
  {
    label: "Заказы",
    icon: ShoppingCartIcon,
    href: "/orders",
  },
  {
    label: "Профиль",
    icon: UserIcon,
    href: "/profile",
  },
] as const;

const NavBarBottom = () => {
  const pathname = usePathname();

  return (
    <Container className="fixed bottom-0 rounded-t-lg border-t bg-neutral-400/5 backdrop-blur-sm md:hidden">
      <Content>
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Section
              key={item.label}
              className="flex-col items-center justify-center"
            >
              <Link
                href={item.href}
                className="flex flex-col items-center justify-center gap-2"
              >
                <NavIcon icon={item.icon} isActive={isActive} />
                <span
                  className={cn(
                    "text-sm font-bold transition-colors duration-300",
                    isActive ? "text-primary" : "text-foreground/50",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </Section>
          );
        })}
      </Content>
    </Container>
  );
};

const Container = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <header
    className={cn(
      "flex w-screen items-center justify-center border-b px-2 shadow-2xl",
      className,
    )}
    {...props}
  >
    {children}
  </header>
);

const Section = ({
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

const Content = ({
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

const Logo = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <Link href="/">
    <img
      src={assets.logo.src}
      alt="logo"
      className={cn("h-auto w-25", className)}
      {...props}
    />
  </Link>
);
