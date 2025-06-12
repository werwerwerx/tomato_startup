import { useFavorites } from "./use-favorites";
import { Heart, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui-kit/button";

export const ListFavorites = () => {
  const {
    serverFavorites,
    serverFavoritesCount,
    toggleFavorite,
    clearFavorites,
    isLoading,
  } = useFavorites();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="mt-2 text-sm text-gray-500">Загрузка избранного...</p>
      </div>
    );
  }

  if (!serverFavoritesCount) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Heart className="mb-4 h-16 w-16 text-gray-300" />
        <h3 className="mb-2 text-lg font-semibold text-gray-600">
          Нет избранных блюд
        </h3>
        <p className="max-w-sm text-sm text-gray-500">
          Добавьте блюда в избранное, нажав на сердечко рядом с блюдом
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Избранное ({serverFavoritesCount})</h3>
        {serverFavoritesCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFavorites}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Очистить всё
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {serverFavorites.map(({ dishId, dish }, index) => (
          <FavoriteItem
            key={`favorite-${dishId}-${index}`}
            dish={dish}
            onRemove={() => toggleFavorite(dishId)}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
};

interface FavoriteItemProps {
  dish: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
  };
  onRemove: () => void;
  isLoading: boolean;
}

const FavoriteItem = ({ dish, onRemove, isLoading }: FavoriteItemProps) => {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
          {dish.image ? (
            <img
              src={dish.image}
              alt={dish.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-2xl">🍽️</span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{dish.name}</h4>
          <p className="line-clamp-2 text-sm text-gray-500">
            {dish.description}
          </p>
          <p className="mt-1 text-sm font-semibold text-emerald-600">
            {dish.price}₽
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        disabled={isLoading}
        className="text-red-500 hover:bg-red-50 hover:text-red-600"
      >
        <Heart className="h-5 w-5 fill-current" />
      </Button>
    </div>
  );
};
