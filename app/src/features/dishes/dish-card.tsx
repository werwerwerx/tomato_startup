import { cn } from "@/shared/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { DishPreview } from "./dishes.repository";
import { Plus } from "lucide-react";

const AddToCartStab = () => (
  <div className="flex flex-row bg-primary items-center justify-center rounded-full p-2 absolute bottom-2 right-2 z-10">
    <Plus className="w-5 h-5 text-white" />
  </div>
);

export const DishCard = ({
  id,
  image,
  name,
  price,
  description,
  className,
  addToCartBtn = <AddToCartStab />,
  ...props
}: DishPreview & { className?: string; addToCartBtn?: React.ReactNode }) => {
  return (
    <Link
      href={`/dishes/${id}`}
      className={cn(
        "flex rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md",
        "h-[200px] w-[200px] md:h-[250px] md:w-[230px] max-w-sm flex-col overflow-hidden bg-background",
        "group relative",
        className,
      )}
      {...props}
    >
      <div className="relative h-full w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          className="object-cover transition-all duration-300 group-hover:scale-105"
          loading="lazy"
          fill
          sizes="(max-width: 768px) 200px, 250px"
        />
      </div>

      <div className=" flex flex-col justify-between bg-white/95 backdrop-blur-sm p-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-md md:text-lg line-clamp-1 font-semibold text-gray-900">
            {name}
          </h3>
          <div className="h-[2.5em] overflow-hidden">
            <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-3 flex w-full flex-row items-center justify-start gap-2">
          {/* it should not be here. TODO: remove, put it in the repo idk. i think we should put it in the create dish method. ridiculous...  */}
          {Math.random() > 0.5 && (
            <p className="text-xs md:text-sm font-bold text-neutral-300 line-through">
              {Math.floor(price + (price / 100) * Math.floor(Math.random() * 100))}₽
            </p>
          )}
          <p className="text-md md:text-lg font-bold text-emerald-600">{price}₽</p>
        </div>
      </div>
      {addToCartBtn}
    </Link>
  );
};
