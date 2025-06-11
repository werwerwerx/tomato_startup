"use client";
import { cn } from "@/shared/lib/utils";
import { Container } from "@/shared/components/container";
import { HTMLAttributes, useState } from "react";

export const MenuListTopBarContainer = ({
  children,
  className,
  ...props
}: { children: React.ReactNode } & HTMLAttributes<HTMLDivElement>) => {
  const [attachedToTop, setAttachedToTop] = useState(false);

  const conditionalIsAttachedStyles: Record<string, string> = {
    false: "",
    true: "fixed top-20 left-0 h-20  border-b",
    boundary:
      "h-20 bg-background/95 w-full backdrop-blur-3xl sm:shadow-none w-full",
  };
  return (
    <div
      className={cn(
        conditionalIsAttachedStyles[String(attachedToTop)],
        conditionalIsAttachedStyles.boundary,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
