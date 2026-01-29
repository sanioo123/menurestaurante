"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import CartItem from "./CartItem";

export default function ShoppingCart() {
  const router = useRouter();
  const { items, totalItems, totalPrice } = useCart();

  const handleRealizarPedido = () => {
    if (items.length === 0) return;
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col gap-5 bg-card h-full p-6 w-[400px] shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-2xl font-bold font-bricolage text-text-primary">
          Carrito de Compras
        </h2>
        <div className="flex items-center justify-center rounded-sm2 bg-coral-500 px-3 py-1.5">
          <span className="text-xs font-semibold font-dm-sans text-white">
            {totalItems} items
          </span>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex items-center justify-center flex-1">
            <p className="text-text-secondary font-dm-sans text-sm">
              Tu carrito esta vacio
            </p>
          </div>
        ) : (
          items.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))
        )}
      </div>

      {/* Total */}
      <div className="flex flex-col gap-4 w-full">
        <div className="h-px bg-border-empty w-full" />

        <div className="flex items-center justify-between w-full">
          <span className="text-xl font-bold font-bricolage text-text-primary">Total:</span>
          <span className="text-2xl font-bold font-bricolage text-coral-500">
            ${totalPrice.toFixed(2)}
          </span>
        </div>

        <button
          onClick={handleRealizarPedido}
          disabled={items.length === 0}
          className="flex items-center justify-center rounded-xl2 bg-coral-500 h-[52px] px-6 py-3.5 w-full transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-base font-bold font-dm-sans text-white">
            Realizar Pedido
          </span>
        </button>
      </div>
    </div>
  );
}
