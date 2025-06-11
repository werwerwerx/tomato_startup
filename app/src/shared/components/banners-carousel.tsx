"use client";

import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem } from "./ui-kit/carousel";

export const BannersCarousel = () => {
  return (
    <Carousel
      className="h-40 w-full"
      opts={{ align: "center", loop: true }}
      plugins={[Autoplay({ delay: 4000 })]}
    >
      <CarouselContent className="">
        <CarouselItem className="bg-primary text-foreground mx-1 flex h-40 basis-3/4 items-center justify-center rounded-lg border text-3xl">
          <div className="text-white">Здесь будет баннер</div>
        </CarouselItem>
        <CarouselItem className="bg-primary text-foreground mx-1 flex h-40 basis-3/4 items-center justify-center rounded-lg border text-3xl">
          <div className="text-white">Здесь будет баннер</div>
        </CarouselItem>
        <CarouselItem className="bg-primary text-foreground mx-1 flex h-40 basis-3/4 items-center justify-center rounded-lg border text-3xl">
          <div className="text-white">Здесь будет баннер</div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
};
