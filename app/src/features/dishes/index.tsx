import { cn } from "@/shared/lib/utils";
import { getDishes } from "./dishes.repository";
import { DishCard } from "./dish-card";
import { Button } from "@/shared/components/ui-kit/button";
import { ArrowDown, ArrowRight, MenuIcon } from "lucide-react";
import Link from "next/link";

export const DishesPreview = async ({
  className,
  ...props
}: {
  className?: string;
}) => {
  const dishes = await getDishes();

  return (
    <div
      className={cn(
        "flex w-full flex-row flex-wrap items-center justify-center md:justify-start",
        className,
      )}
      {...props}
    >
      {dishes.map((dish, index) => (
        <DishCard
          key={dish.id}
          id={dish.id}
          image={dish.image}
          name={dish.name}
          price={dish.price}
          description={dish.description}
          index={index}
        />
      ))}
      <Link
        href="/menu"
        className={cn(
          "flex rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md",
          "bg-background text-primary m-2 h-[180px] w-full flex-row flex-wrap items-center justify-center gap-2 overflow-hidden p-4 text-xl font-bold sm:h-[260px] sm:w-[calc(100%/2-20px)] md:w-[calc(100%/3-20px)] lg:w-[calc(100%/4-20px)] xl:w-[calc(100%/5-20px)]",
        )}
      >
        {/* todo fix its bagging*/}
        <h1 className="line-clamp-1 text-center">Увидеть больше</h1>
        <ArrowRight className="h-6 w-6" />
      </Link>
    </div>
  );
};
