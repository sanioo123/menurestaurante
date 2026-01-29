"use client";

import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { CartItem as CartItemType } from "@/context/CartContext";

interface CartItemProps {
  item: CartItemType;
  compact?: boolean;
}

export default function CartItem({ item, compact = false }: CartItemProps) {
  const { removeItem, incrementQty, decrementQty } = useCart();
  const subtotal = item.product.price * item.quantity;

  if (compact) {
    /* Mobile cart version */
    return (
      <div className="flex flex-col gap-2.5 rounded-lg2 bg-white p-3.5 w-full">
        {/* Header */}
        <div className="flex justify-between items-start w-full">
          <div className="flex flex-col gap-[3px] flex-1 min-w-0">
            <h4 className="text-sm font-bold font-dm-sans text-text-primary">{item.product.name}</h4>
            <p className="text-[11px] text-text-secondary font-dm-sans">{item.product.description}</p>
          </div>
          <button
            onClick={() => removeItem(item.product.id)}
            className="flex items-center justify-center w-[22px] h-[22px] rounded-[11px] bg-border-empty shrink-0 transition-colors hover:bg-text-tertiary"
          >
            <X size={12} className="text-text-tertiary" />
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between w-full">
          <span className="text-base font-bold font-bricolage text-coral-500">
            ${subtotal.toFixed(2)}
          </span>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => decrementQty(item.product.id)}
              className="flex items-center justify-center w-7 h-7 rounded-[14px] bg-card transition-colors hover:bg-border-empty"
            >
              <Minus size={12} className="text-text-secondary" />
            </button>
            <span className="text-sm font-bold font-dm-sans text-text-primary w-3 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => incrementQty(item.product.id)}
              className="flex items-center justify-center w-7 h-7 rounded-[14px] bg-coral-500 transition-colors hover:opacity-90"
            >
              <Plus size={12} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* Desktop cart version */
  return (
    <div className="flex flex-col gap-3 rounded-lg2 bg-white p-4 w-full">
      {/* Header */}
      <div className="flex justify-between items-start w-full">
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <h4 className="text-[15px] font-bold font-dm-sans text-text-primary">{item.product.name}</h4>
          <p className="text-xs text-text-secondary font-dm-sans">{item.product.description}</p>
        </div>
        <button
          onClick={() => removeItem(item.product.id)}
          className="flex items-center justify-center w-6 h-6 rounded-sm2 bg-border-empty shrink-0 transition-colors hover:bg-text-tertiary"
        >
          <X size={14} className="text-text-tertiary" />
        </button>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between w-full">
        <span className="text-lg font-bold font-bricolage text-coral-500">
          ${subtotal.toFixed(2)}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => decrementQty(item.product.id)}
            className="flex items-center justify-center w-8 h-8 rounded-lg2 bg-card transition-colors hover:bg-border-empty"
          >
            <Minus size={14} className="text-text-secondary" />
          </button>
          <span className="text-base font-bold font-dm-sans text-text-primary w-4 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => incrementQty(item.product.id)}
            className="flex items-center justify-center w-8 h-8 rounded-lg2 bg-coral-500 transition-colors hover:opacity-90"
          >
            <Plus size={14} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
