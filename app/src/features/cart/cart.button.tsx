"use client"
import { useRouter } from "next/navigation";
import { useCart } from "./hooks/use-cart"
import { Button } from "@/shared/components/ui-kit/button";
import { ShoppingCartIcon, ArrowLeft, Plus, Minus, ArrowRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/components/ui-kit/dropdown-menu";
import {
  CardNavSection,
  CardNavRow,
  CardNavContainer,
} from "@/shared/components/card-nav";

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

export const CartButton = () => {
  const router = useRouter();
  const { cartItems, totalItems, updateQuantity, isLoading } = useCart();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative" size={"lg"}>
          <ShoppingCartIcon />
          <span className="hidden md:block">Заказы</span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0" side="bottom" align="end">
        <CardNavContainer>
          <CardNavSection>
            <h3 className="text-lg font-semibold">
              Корзина ({totalItems})
            </h3>
          </CardNavSection>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ShoppingCartIcon className="mb-2 h-12 w-12 text-gray-300" />
              <p className="text-sm text-gray-500">Корзина пуста</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {cartItems.map((item) => (
                <CartItemMini
                  key={item.dishId}
                  item={item}
                  onUpdateQuantity={(newQuantity) =>
                    updateQuantity(item.dishId, newQuantity)
                  }
                  isLoading={isLoading}
                />
              ))}
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="sticky bottom-0 bg-white border-t">
              <CardNavRow
                href="/profile/cart"
                className="bg-primary text-primary-foreground hover:bg-primary/90 m-0 items-center gap-2 p-0"
              >
                <div className="flex h-full w-full items-center justify-center gap-2 p-3">
                  <span className="font-medium">Перейти к созданию заказа</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </CardNavRow>
            </div>
          )}
        </CardNavContainer>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface CartItemMiniProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  isLoading: boolean;
}

const CartItemMini = ({
  item,
  onUpdateQuantity,
  isLoading,
}: CartItemMiniProps) => {
  const { dish, quantity } = item;

  return (
    <div className="flex items-center gap-3 border-b bg-neutral-200/25 p-3 transition-colors duration-300 hover:bg-neutral-300/50">
      <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
        {dish.image ? (
          <img
            src={dish.image}
            alt={dish.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-lg">🍽️</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-gray-900 truncate">
          {dish.name}
        </h4>
        <p className="text-xs text-emerald-600 font-semibold">
          {dish.price}₽ × {quantity} = {dish.price * quantity}₽
        </p>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdateQuantity(quantity - 1)}
          disabled={isLoading || quantity <= 0}
          className="h-6 w-6 p-0"
        >
          <Minus className="h-3 w-3" />
        </Button>

        <span className="min-w-[20px] text-center text-sm font-medium">
          {quantity}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdateQuantity(quantity + 1)}
          disabled={isLoading}
          className="h-6 w-6 p-0"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};