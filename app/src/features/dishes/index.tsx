import { cn } from "@/shared/lib/utils";
import { getDishes } from "./dishes.repository";
import { DishCard } from "./dish-card";

export const DishesPreview = async ({className, ...props}: {className?: string}) => {
  const dishes = await getDishes();
  return (
    <div className={cn("flex flex-row gap-4 w-full flex-wrap", className)} {...props}>
      {dishes.map((dish) => (
        <DishCard key={dish.id} id={dish.id} image={dish.image} name={dish.name} price={dish.price} description={dish.description} />
      ))}
    </div>
  )
}