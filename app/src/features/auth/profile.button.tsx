"use client";
import { Button } from "@/shared/components/ui-kit/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Loader2, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui-kit/dropdown-menu";

export const UserProfileButton = () => {
  const session = useSession();
  const router = useRouter();
  const buttonContent = {
    loading: <Loader2 className="animate-spin" />,
    authenticated: (
      <>
      <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 w-full h-full justify-center">
        <UserIcon className="text-background" />{" "}
        <span className="hidden md:block">Профиль</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-full">
        .
      </DropdownMenuContent>
      </DropdownMenu>
      </div>
      </>
    ),
    unauthenticated: (
      <>
      
        <UserIcon className="text-background" />{" "}
        <span className="hidden md:block">Войти</span>
      </>
    ),
  };

  const buttonBehavior = {
    loading: () => {},
    authenticated: () => goSignOut(), // TODO: add profile page
    unauthenticated: () => router.push("/auth"),
  };

  return (
    <>
      <Button
        variant="default"
        className="w-30"
        size="lg"
        disabled={session.status === "loading"}
        onClick={buttonBehavior[session.status]}
      >
        {buttonContent[session.status]}
      </Button>
    </>
  );
};




const goSignOut = () => {
  signOut();
  const router = useRouter();
  router.push("/");
};
