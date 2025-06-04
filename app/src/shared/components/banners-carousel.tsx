"use client"

import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselItem } from "./ui-kit/carousel"

export const BannersCarousel = () => {
  return (
    <Carousel className="w-full h-40" opts={{ align: "center", loop: true }} plugins={[Autoplay({ delay: 4000 })]}>
      <CarouselContent className="">
        <CarouselItem className="h-40 mx-1 rounded-lg basis-3/4 border bg-primary text-3xl text-foreground flex items-center justify-center">
          <div className="text-white">Здесь будет баннер</div>
        </CarouselItem>
        <CarouselItem className="h-40 mx-1 rounded-lg basis-3/4 border bg-primary text-3xl text-foreground flex items-center justify-center">
          <div className="text-white">Здесь будет баннер</div>
        </CarouselItem>
        <CarouselItem className="h-40 mx-1 rounded-lg basis-3/4 border bg-primary text-3xl text-foreground flex items-center justify-center">
          <div className="text-white">Здесь будет баннер</div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  )
}
