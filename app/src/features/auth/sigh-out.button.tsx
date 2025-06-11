import { Button } from "@/shared/components/ui-kit/button";
import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/shared/lib/utils";

export const SighOutButton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) => (
  <Button
    variant="outline"
    className={cn(className, "w-full text-red-500")}
    onClick={() => signOut({ redirectTo: "/auth" })}
    {...props}
  >
    <LogOutIcon className="mr-2 h-4 w-4" />
    Выйти из аккаунта
  </Button>
);
