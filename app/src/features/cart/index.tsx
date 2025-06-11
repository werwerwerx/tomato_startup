"use client";
import { ShoppingCartIcon } from "lucide-react";
import { useState } from "react";

export const CartOverlayFeature = () => {};

const CartOverlayContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative h-[70vw] -translate-y-[50vh]">{children}</div>;
};


const CartOverlayTrigger = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-card hover:bg-card/80 flex h-20 w-20 items-center justify-center rounded-full border transition-colors">
      <ShoppingCartIcon className="h-6 w-6" />
    </div>
  );
};
