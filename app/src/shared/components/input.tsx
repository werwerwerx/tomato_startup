import { cn } from "../lib/utils";

export const Input = ({
  className,
  ...props
}: React.ComponentProps<"input">) => (
  <input
    className={cn(
      "placeholder:text-foreground/60 p-2 bg-transparent rounded-lg text-base outline-none border",
      className,
    )}
    autoFocus
    {...props}
  />
);
