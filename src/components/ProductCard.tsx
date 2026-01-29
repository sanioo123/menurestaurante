"use client";

import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/app/page";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, incrementQty, decrementQty, getItemQuantity } = useCart();
  const quantity = getItemQuantity(product.id);

  const handleAdd = () => {
    if (quantity === 0) {
      addItem(product);
    } else {
      incrementQty(product.id);
    }
  };

  return (
    <div className="flex flex-col rounded-lg2 bg-white border border-border-empty overflow-hidden w-full">
      {/* Image */}
      <div className="h-40 bg-card rounded-t-lg2 w-full relative">
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-4 w-full">
        <h3 className="text-base font-bold font-dm-sans text-text-primary">{product.name}</h3>
        <p className="text-[13px] text-text-secondary font-dm-sans">{product.description}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 w-full">
        <span className="text-lg font-bold font-bricolage text-coral-500">
          ${product.price.toFixed(2)}
        </span>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => decrementQty(product.id)}
            className="flex items-center justify-center w-8 h-8 rounded-lg2 bg-card transition-colors hover:bg-border-empty"
          >
            <Minus size={14} className="text-text-secondary" />
          </button>

          <span className="text-base font-bold font-dm-sans text-text-primary w-4 text-center">
            {quantity}
          </span>

          <button
            onClick={handleAdd}
            className="flex items-center justify-center w-8 h-8 rounded-lg2 bg-coral-500 transition-colors hover:opacity-90"
          >
            <Plus size={14} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
