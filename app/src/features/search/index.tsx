"use client";
import { ImageUnkownSize } from "@/shared/components/Image";
import { Button } from "@/shared/components/ui-kit/button";
import { Input } from "@/shared/components/ui-kit/input";
import { cn } from "@/shared/lib/utils";
import { assets } from "@assets";
import { useState } from "react";

export const ButtonSearch = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const buttonIsExpandedClassCondition: Record<
    "true" | "false" | "boundary",
    string
  > = {
    true: "w-[200px] px-4 flex items-center gap-2 absolute",
    false: "h-[40px] w-[40px] rounded-full p-0",
    boundary: "transition-all duration-300",
  };

  return (
    <Button
      variant="outline"
      className={cn(
        buttonIsExpandedClassCondition.boundary,
        buttonIsExpandedClassCondition[isExpanded ? "true" : "false"],
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <ImageUnkownSize
        src={assets.search_icon.src}
        alt="Search"
        className="h-[15px] w-[15px]"
      />
      <Input
        type="text"
        placeholder="Search"
        className={cn(
          "placeholder:text-foreground/60 border-none bg-transparent p-0 focus-visible:ring-0",
          isExpanded ? "w-full" : "w-0",
        )}
      />
    </Button>
  );
};
