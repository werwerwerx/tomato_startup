"use client";
import { cn, withDelay } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui-kit/button";
import { SearchIcon, X } from "lucide-react";
import { useState } from "react";
export const SearchFeature = () => {
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
