import Link from "next/link";
import Image from "next/image";
import { getMenuItems, MenuItem } from "./categories.repository";
import { FlexRowSection } from "@/shared/components/container";
import { HTMLAttributes } from "react";
import { MenuRowSlider } from "./ui/menu-slider";
import { cn } from "@/shared/lib/utils";
import { MenuListTopBarContainer } from "./ui/menu-list-top-bar";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
} from "@/shared/components/ui-kit/carousel";

export const menuRoute = "/menu";

export const MenuList = async ({
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  const items = await getMenuItems();
  return (
    <div
      className={cn(
        "mt-5 flex w-full items-center justify-center",
        props.className,
      )}
      {...props}
    >
      <MenuRowSlider
        items={items.map((item) => ({
          name: item.name,
          img_url: item.img_url || "",
        }))}
      />
    </div>
  );
};

export const MenuListTopBar =  ({items}: {items: MenuItem[]}) => {
  return (
    <MenuListTopBarContainer>
      <FlexRowSection>
        <Carousel 
          className="w-full" 
          opts={{
            align: "start",
          }}
        >
          <CarouselContent className="-ml-2 w-full py-4">
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className="pl-2 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
              >
                <div className="p-1">
                  <Link
                    href={`#${item.name}`}
                    className={cn(
                      "group flex items-center gap-2 rounded-lg border bg-card p-2",
                      "transition-all duration-300 hover:bg-accent",
                      "shadow-lg shadow-neutral-300/50"
                    )}
                  >
                    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={item.img_url || ""}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium line-clamp-1 text-foreground/80 group-hover:text-foreground">
                      {item.name}
                    </span>
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </FlexRowSection>
    </MenuListTopBarContainer>
  );
};
