"use client";

import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/app/page";

interface MobileProductCardProps {
  product: Product;
}

export default function MobileProductCard({ product }: MobileProductCardProps) {
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
    <div className="flex gap-3 rounded-lg2 bg-white border border-border-empty p-3 w-full">
      {/* Image */}
      <div className="w-[100px] h-[100px] bg-card rounded-sm2 shrink-0 relative overflow-hidden">
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
      <div className="flex flex-col justify-between flex-1 gap-2 min-w-0">
        <div className="flex flex-col gap-1">
          <h3 className="text-[15px] font-bold font-dm-sans text-text-primary">{product.name}</h3>
          <p className="text-xs text-text-secondary font-dm-sans">{product.description}</p>
        </div>

        <div className="flex items-center justify-between w-full">
          <span className="text-lg font-bold font-bricolage text-coral-500">
            ${product.price.toFixed(2)}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => decrementQty(product.id)}
              className="flex items-center justify-center w-7 h-7 rounded-[14px] bg-card transition-colors hover:bg-border-empty"
            >
              <Minus size={12} className="text-text-secondary" />
            </button>

            <span className="text-sm font-bold font-dm-sans text-text-primary w-3 text-center">
              {quantity}
            </span>

            <button
              onClick={handleAdd}
              className="flex items-center justify-center w-7 h-7 rounded-[14px] bg-coral-500 transition-colors hover:opacity-90"
            >
              <Plus size={12} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
