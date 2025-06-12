import { useCart } from "./hooks/use-cart";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/shared/components/ui-kit/button";

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface CartItem {
  dishId: number;
  quantity: number;
  dish: Dish;
}

export const ListCart = () => {
  const { cartItems, totalItems, updateQuantity, clearCart, isLoading } = useCart();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="mt-2 text-sm text-gray-500">Загрузка корзины...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ShoppingBag className="mb-4 h-16 w-16 text-gray-300" />
        <h3 className="mb-2 text-lg font-semibold text-gray-600">
          Корзина пуста
        </h3>
        <p className="max-w-sm text-sm text-gray-500">
          Добавьте блюда в корзину, нажав на кнопку "+" рядом с блюдом
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Корзина ({totalItems})</h3>
        {cartItems.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearCart}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Очистить всё
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {cartItems.map((item, index) => (
          <CartItem
            key={`cart-${item.dishId}-${index}`}
            item={item}
            onUpdateQuantity={(newQuantity) =>
              updateQuantity(item.dishId, newQuantity)
            }
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
};

interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  isLoading: boolean;
}

const CartItem = ({ item, onUpdateQuantity, isLoading }: CartItemProps) => {
  const { dish, quantity } = item;

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
            {dish.price}₽ × {quantity} = {dish.price * quantity}₽
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdateQuantity(quantity - 1)}
          disabled={isLoading || quantity <= 0}
          className="h-8 w-8 p-0"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <span className="min-w-[20px] text-center font-medium">{quantity}</span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdateQuantity(quantity + 1)}
          disabled={isLoading}
          className="h-8 w-8 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
