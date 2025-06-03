"use client";
import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui-kit/carousel";
import { HTMLAttributes } from "react";

export const MenuRowSlider = ({
  items,
  ...props
}: {
  items: {
    name: string;
    img_url: string;
  }[];
} & HTMLAttributes<HTMLDivElement>) => {
  return (
    <Carousel
      {...props}
      className="w-[90%]"
      opts={{ align: "start", loop: true, }}
    >
      <CarouselContent className="w-full">
        {items.map((item) => (
          <CarouselItem

            key={item.name}
            className="flex basis-1/2 ml-2 sm:basis1/3  md:basis-1/5 lg:basis-1/6 xl:basis-1/7 flex-col items-center gap-2 rounded-lg border p-2 md:p-4 group hover:bg-neutral-400/10 transition-all duration-300"
          >
            <div className="relative h-20 md:h-32 w-20 md:w-32  overflow-hidden group-hover:scale-105 transition-all duration-300">
              <Image
                src={item.img_url}
                alt={item.name}
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>
            <p className="font-xl text-center font-medium text-neutral-600/60 group-hover:text-neutral-600/80 transition-all duration-300">
              {item.name}
            </p>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
