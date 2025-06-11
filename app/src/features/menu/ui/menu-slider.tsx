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
    <Carousel {...props} className="w-[90%]" opts={{ align: "start" }}>
      <CarouselContent className="w-full">
        {items.map((item) => (
          <CarouselItem
            key={item.name}
            className="sm:basis1/3 group ml-2 flex basis-1/2 flex-col items-center gap-2 rounded-lg border p-2 transition-all duration-300 hover:bg-neutral-400/10 md:basis-1/5 md:p-4 lg:basis-1/6 xl:basis-1/7"
          >
            <div className="relative h-20 w-20 overflow-hidden transition-all duration-300 group-hover:scale-105 md:h-32 md:w-32">
              <Image
                src={item.img_url}
                alt={item.name}
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 20vw, 16vw"
              />
            </div>
            <p className="font-xl text-center font-medium text-neutral-600/60 transition-all duration-300 group-hover:text-neutral-600/80">
              {item.name}
            </p>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
