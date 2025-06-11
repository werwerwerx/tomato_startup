import { cn } from "../lib/utils";

export const Input = ({
  className,
  ...props
}: React.ComponentProps<"input">) => (
  <input
    className={cn(
      "placeholder:text-foreground/60 rounded-lg border bg-transparent p-2 text-base outline-none",
      className,
    )}
    autoFocus
    {...props}
  />
);
