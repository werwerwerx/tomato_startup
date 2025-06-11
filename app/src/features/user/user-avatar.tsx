"use client";
import { cn } from "@/shared/lib/utils";
import Image from "next/image";
import { HTMLAttributes } from "react";

export const UserAvatar = ({
  src,
  alt,
  className,
  ...props
}: {
  className: string;
  src: string | undefined;
  alt: string;
} & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "relative h-10 w-10 overflow-hidden rounded-full border",
        className,
      )}
      {...props}
    >
      <Image
        src={
          src ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7vB-49_BT-dirwttYZaeE_VByjlQ3raVJZg&s"
        }
        alt={alt}
        fill
        className="object-cover"
        sizes="40px"
      />
    </div>
  );
};
