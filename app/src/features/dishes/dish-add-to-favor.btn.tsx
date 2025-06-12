"use client"
import { Heart } from "lucide-react"
import { cn } from "@/shared/lib/utils";
import { useFavorites } from "../favorites/use-favorites";

export const AddToFavoritesButton = ({dishId, className}: {dishId: number, className?: string}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isInFavorites = isFavorite(dishId);

  return (
    <button
      onClick={() => toggleFavorite(dishId)}
      className={cn(
        "absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:scale-110",
        isInFavorites 
          ? "!border-none !bg-transparent" 
          : "",
        className
      )}
    >
      <Heart 
        className={cn(
          "h-5 w-5 transition-all duration-300",
          isInFavorites 
            ? "fill-red-500 text-red-500" 
            : "text-gray-400 hover:text-red-400"
        )}
      />
    </button>
  );
};