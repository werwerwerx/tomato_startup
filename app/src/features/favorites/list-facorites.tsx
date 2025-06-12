import { useFavorites } from "./use-favorites"
import { Heart, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/shared/components/ui-kit/button"

export const ListFavorites = () => {
  const {
    serverFavorites,
    serverFavoritesCount,
    toggleFavorite,
    clearFavorites,
    isLoading
  } = useFavorites();

  if (serverFavoritesCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Heart className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Нет избранных блюд
        </h3>
        <p className="text-sm text-gray-500 max-w-sm">
          Добавьте блюда в избранное, нажав на сердечко рядом с блюдом
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Избранное ({serverFavoritesCount})
        </h3>
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
        {serverFavorites.map(({ dishId, dish }) => (
          <FavoriteItem
            key={dishId}
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
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
          {dish.image ? (
            <img 
              src={dish.image} 
              alt={dish.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-2xl">🍽️</span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">
            {dish.name}
          </h4>
          <p className="text-sm text-gray-500 line-clamp-2">
            {dish.description}
          </p>
          <p className="text-sm font-semibold text-emerald-600 mt-1">
            {dish.price}₽
          </p>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        disabled={isLoading}
        className="text-red-500 hover:text-red-600 hover:bg-red-50"
      >
        <Heart className="h-5 w-5 fill-current" />
      </Button>
    </div>
  );
};