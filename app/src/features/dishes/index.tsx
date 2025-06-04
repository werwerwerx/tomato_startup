import { cn } from "@/shared/lib/utils";
import { getDishes } from "./dishes.repository";
import { DishCard } from "./dish-card";
import { Button } from "@/shared/components/ui-kit/button";
import { ArrowDown, ArrowRight, MenuIcon } from "lucide-react";
import Link from "next/link";

export const DishesPreview = async ({className, ...props}: {className?: string}) => {
  const dishes = await getDishes();
  
  return (
    <div className={cn("flex flex-row items-center justify-center md:justify-start  w-full flex-wrap", className)} {...props}>
      {dishes.map((dish, index) => (
        <DishCard key={dish.id} id={dish.id} image={dish.image} name={dish.name} price={dish.price} description={dish.description} index={index} />
      ))}
      <Link href="/menu"
      className={cn(
        "flex rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md",
        "bg-background m-2 h-[180px] w-full flex-row overflow-hidden sm:h-[260px] sm:w-[calc(100%/2-20px)] p-4 md:w-[calc(100%/3-20px)] lg:w-[calc(100%/4-20px)] xl:w-[calc(100%/5-20px)] items-center justify-center flex-wrap text-primary text-xl font-bold gap-2",
      )}>
        {/* todo fix its bagging*/}
        <h1 className="line-clamp-1 text-center">
        Увидеть больше 

        </h1>
        <ArrowRight className="w-6 h-6" />
      </Link>


    </div>
  )
}