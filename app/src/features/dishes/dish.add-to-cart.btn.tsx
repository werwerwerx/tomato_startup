"use client";
import { Plus, Minus } from "lucide-react";
import * as React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/shared/lib/utils";
import { useCart } from "@/features/cart/hooks/use-cart";

export interface IAddToCartBtnProps {
  dishId: number;
  className?: string;
}

export function AddToCartBtn({ dishId, className }: IAddToCartBtnProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getItemQuantity, updateQuantity, isLoading } = useCart();

  const quantity = getItemQuantity(dishId);

  useEffect(() => {
    setIsExpanded(quantity > 0);
  }, [quantity]);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 0) return;
    await updateQuantity(dishId, newQuantity);
  };

  const handleAddClick = () => {
    handleQuantityChange(quantity + 1);
  };

  const handleRemoveClick = () => {
    handleQuantityChange(quantity - 1);
  };

  const handleInitialClick = () => {
    if (quantity === 0) {
      handleQuantityChange(1);
    }
  };

  return (
    <div
      className={cn(
        "absolute right-2 bottom-2 z-10 flex flex-row items-center justify-center transition-all duration-300",
        isExpanded
          ? "bg-primary rounded-full px-2 py-2"
          : "bg-primary rounded-full p-2",
        className,
      )}
    >
      {!isExpanded ? (
        <button
          onClick={handleInitialClick}
          disabled={isLoading}
          className="flex items-center justify-center"
        >
          <Plus className="h-5 w-5 text-white" />
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={handleRemoveClick}
            disabled={isLoading}
            className="flex items-center justify-center rounded-full p-1 transition-colors hover:bg-white/20"
          >
            <Minus className="h-4 w-4 text-white" />
          </button>

          <span className="min-w-[20px] text-center font-medium text-white">
            {quantity}
          </span>

          <button
            onClick={handleAddClick}
            className="flex items-center justify-center rounded-full p-1 transition-colors hover:bg-white/20"
          >
            <Plus className="h-4 w-4 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}
