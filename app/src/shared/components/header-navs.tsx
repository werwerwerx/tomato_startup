import { cn, withDelay } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui-kit/button";
import {
  Grip,
  MenuIcon,
  ShoppingCartIcon,
  UserIcon,
  LucideIcon,
  SearchIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import {  useState } from "react";
import { usePathname } from "next/navigation";
import { foregroundStyles, HeaderContainer, HeaderSection } from "@/app/header";

export const Search = () => {
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
        className="!bg-background border-md flex h-12 w-12 items-center justify-center rounded-md p-0 transition-colors hover:bg-neutral-200 md:h-full md:w-full md:rounded-md"
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
            "bg-foreground/90 fixed inset-0 z-100 flex h-screen w-screen flex-col items-start justify-center transition-opacity duration-300 md:hidden",
            isOpen ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="container mt-5 flex w-full items-center justify-center px-4">
            <div className="flex h-15 w-[90%] items-center justify-between">
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
export const DesktopNavBar = () => {
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

export const NavIcon = ({
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

export const NavBarBottom = () => {
  const pathname = usePathname();

  return (
    <HeaderContainer className={cn("fixed bottom-0 z-50 rounded-t-lg border-t", foregroundStyles)}>
      <div className="container flex h-20 flex-row items-center">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <HeaderSection
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
            </HeaderSection>
          );
        })}
      </div>
    </HeaderContainer>
  );
};
