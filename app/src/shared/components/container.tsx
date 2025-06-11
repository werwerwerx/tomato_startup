import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { HTMLAttributes } from "react";

export interface IContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function Container({ children, className, ...props }: IContainerProps) {
  return (
    <div
      className={cn(
        "container mx-auto flex w-full flex-col gap-10 px-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export const FlexRowSection = ({
  children,
  className,
  ...props
}: IContainerProps & HTMLAttributes<HTMLElement>) => {
  return (
    <section
      className={cn(
        "flex w-full flex-row items-center justify-center gap-5",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
};
export const FlexColSection = ({
  children,
  className,
  ...props
}: IContainerProps & HTMLAttributes<HTMLElement>) => {
  return (
    <section
      className={cn(
        "flex w-full flex-col items-center justify-center gap-5",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
};
