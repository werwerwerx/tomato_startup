"use client";

import { assets, food_list } from "@assets";
import { cn } from "@/shared/lib/utils";
import { HTMLAttributes, Suspense, useEffect, useState } from "react";
import Image from "next/image";

const HeadingImages = [
  { src: assets.header_img.src, foreground: "light" },
  { src: assets.heading2.src, foreground: "dark" },
  { src: assets.heading3.src, foreground: "dark" },
];

export const BlockHeading = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev + 1) % HeadingImages.length);

      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500);

      return () => clearTimeout(timer);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn("relative w-full overflow-hidden rounded-lg", className)}
      {...props}
    >
      <div
        className="relative h-full w-full"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
          transition: isAnimating ? "transform 0.5s ease-out" : "none",
          display: "flex",
        }}
      >
        {HeadingImages.map((image, index) => (
          <div
            key={image.src}
            className="h-full min-w-full flex-shrink-0"
            style={{
              transform: isAnimating ? "scale(1.05)" : "scale(1)",
              transition: "transform 0.5s ease-out",
            }}
          >
            <Image
              src={image.src}
              fill
              alt={`Слайд ${index + 1}`}
              className="object-cover"
              priority={index === 0 ? true : false}
              quality={100}
            />
          </div>
        ))}
      </div>
      <div
        className={cn(
          "absolute inset-0 z-10 transition-colors duration-500",
          HeadingImages[currentSlide].foreground === "light"
            ? "bg-foreground/20"
            : "from-foreground/60 to-foreground/30 bg-gradient-to-b",
        )}
      >
        {children}
      </div>
    </div>
  );
};
