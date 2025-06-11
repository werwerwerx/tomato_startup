import { cn } from "@/shared/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { DishPreview } from "./dishes.repository";
import { AddToCartBtn } from "./dish.add-to-cart.btn";

// todo: make fugging some cool animations. card is important. people loving fugging card and touch it and shit. then they will buy stuff.
export const DishCard = ({
  id,
  image,
  name,
  price,
  description,
  index,
  className,
  addToCartBtn,
  ...props
}: DishPreview & {
  className?: string;
  addToCartBtn?: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md",
        "bg-background m-2 h-[180px] w-full flex-row overflow-hidden sm:h-[260px] sm:w-[calc(100%/2-20px)] md:w-[calc(100%/3-20px)] lg:w-[calc(100%/4-20px)] xl:w-[calc(100%/5-20px)]",
        "group relative sm:flex-col",
        index % 2 === 0 ? "flex-row-reverse" : "flex-row",
        className,
      )}
      {...props}
    >
      <div className="relative h-full w-[50%] overflow-hidden sm:h-[40%] sm:w-full">
        <Image
          src={image}
          alt={name}
          className="object-cover transition-all duration-300 group-hover:scale-105"
          loading="lazy"
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
        />
      </div>

      <div className="flex w-[50%] flex-col justify-between bg-white/95 p-4 backdrop-blur-sm sm:h-[60%] sm:w-full">
        <div className="flex flex-col gap-2">
          <h3 className="text-md font-semibold text-gray-900 md:line-clamp-1 md:text-lg">
            {name}
          </h3>
          <div className="h-[2.5em] overflow-hidden">
            <p className="line-clamp-2 text-xs text-gray-600 md:text-sm">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-3 flex w-full flex-row items-center justify-start gap-2">
          {/* it should not be here. TODO: remove, put it in the repo idk. i think we should put it in the create dish method. ridiculous...  */}
          {Math.random() > 0.5 && (
            <p className="text-xs font-bold text-neutral-300 line-through md:text-sm">
              {Math.floor(
                price + (price / 100) * Math.floor(Math.random() * 100),
              )}
              ₽
            </p>
          )}
          <p className="text-md font-bold text-emerald-600 md:text-lg">
            {price}₽
          </p>
        </div>
      </div>

      {/* Кнопка добавления в корзину */}
      {addToCartBtn || <AddToCartBtn dishId={id} />}
    </div>
  );
};
