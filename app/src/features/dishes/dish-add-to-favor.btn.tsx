"use client";
import { cn } from "@/shared/lib/utils";
import { useFavorites } from "../favorites/use-favorites";
import Heart from "react-animated-heart";
import { AnimatedHeart } from "./animated-heart";
import { EpicHeart } from "./epic-heart";

export const AddToFavoritesButton = ({
  dishId,
  className,
  variant = "epic",
}: {
  dishId: number;
  className?: string;
  variant?: "library" | "custom" | "epic";
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isInFavorites = isFavorite(dishId);

  const handleToggle = () => {
    toggleFavorite(dishId);
  };

  const renderHeartVariant = () => {
    switch (variant) {
      case "library":
        return (
          <Heart
            isClick={isInFavorites}
            onClick={handleToggle}
          />
        );
      case "custom":
        return (
          <AnimatedHeart
            isLiked={isInFavorites}
            onClick={handleToggle}
            size="h-5 w-5"
          />
        );
      case "epic":
        return (
          <EpicHeart
            isLiked={isInFavorites}
            onClick={handleToggle}
            size="h-5 w-5"
          />
        );
      default:
        return (
          <EpicHeart
            isLiked={isInFavorites}
            onClick={handleToggle}
            size="h-5 w-5"
          />
        );
    }
  };

  return (
    <div 
      className={cn(
        "absolute top-2 right-2 z-[1000]",
        className,
      )}
      style={{ 
        position: "absolute",
        top: "8px",
        right: "8px",
        zIndex: 1000,
        pointerEvents: "auto",
      }}
    >
      <button
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white",
          isInFavorites ? "!border-none !bg-transparent" : "",
        )}
        style={{ 
          position: "relative",
          zIndex: 1001,
        }}
      >
        {renderHeartVariant()}
      </button>
    </div>
  );
};
