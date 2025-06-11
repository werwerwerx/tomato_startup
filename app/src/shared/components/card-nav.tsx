import Link from "next/link";
import { cn } from "../lib/utils";

type CardNavSize = "md" | "lg";

interface CardNavContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: CardNavSize;
}

export const CardNavContainer = ({
  children,
  className,
  size = "md",
  ...props
}: CardNavContainerProps) => {
  const sizeClasses = {
    md: "max-w-sm md:max-w-md",
    lg: "max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl",
  };

  return (
    <div
      className={cn(
        className,
        "bg-background flex w-full flex-col justify-center rounded-lg border",
        sizeClasses[size],
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardNavRowProps extends React.ComponentPropsWithoutRef<typeof Link> {
  children: React.ReactNode;
  href: string;
  className?: string;
  size?: CardNavSize;
}

export const CardNavRow = ({
  children,
  href,
  className,
  size = "md",
  ...props
}: CardNavRowProps) => {
  const sizeClasses = {
    md: "p-3",
    lg: "p-5",
  };

  return (
    <Link
      href={href}
      className={cn(
        "flex w-full flex-row items-center gap-2 border-b bg-neutral-200/25 text-neutral-800 transition-colors duration-300 hover:bg-neutral-300/50",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
};

interface CardNavSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: CardNavSize;
}

export const CardNavSection = ({
  className,
  size = "md",
  ...props
}: CardNavSectionProps) => {
  const sizeClasses = {
    md: "p-3 !pb-6",
    lg: "p-5 !pb-10",
  };

  return (
    <div
      className={cn(
        className,
        "flex w-full flex-col gap-2 border-b",
        sizeClasses[size],
      )}
      {...props}
    >
      {props.children}
    </div>
  );
};
