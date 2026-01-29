"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const WHATSAPP_NUMBER = "0"; // pone tu numero aca

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [aclaraciones, setAclaraciones] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      router.push("/");
    }
  }, [items.length, router]);

  const handleConfirmarPedido = () => {
    if (items.length === 0) return;

    setIsSubmitting(true);

    let mensaje = "*Hola!* me comunico para realizarle un pedido *Take Away*\n\n";

    if (nombre) {
      mensaje += `*Nombre:* ${nombre}\n`;
    }
    if (telefono) {
      mensaje += `*Teléfono:* ${telefono}\n`;
    }
    mensaje += "\n";

    mensaje += "*Detalle del pedido:*\n";
    mensaje += "─────────────────\n";

    items.forEach((item) => {
      mensaje += `• ${item.product.name}\n`;
      mensaje += `   *Cantidad:* ${item.quantity}\n`;
      mensaje += `   *Precio:* $${(item.product.price * item.quantity).toFixed(2)}\n`;
    });

    mensaje += "─────────────────\n";
    mensaje += `*TOTAL A PAGAR (Sin envio):* $${totalPrice.toFixed(2)}\n`;

    if (aclaraciones) {
      mensaje += `\n*Aclaraciones:* ${aclaraciones}\n`;
    }

    const mensajeCodificado = encodeURIComponent(mensaje);

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensajeCodificado}`;
    window.open(whatsappUrl, "_blank");

    clearCart();
    router.push("/");
  };

  const handleVolver = () => {
    router.back();
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-page">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        {/* Left Column - Order Summary */}
        <div className="flex flex-col gap-6 flex-1 p-10 overflow-y-auto">
          {/* Back button */}
          <button
            onClick={handleVolver}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors self-start"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-dm-sans">Volver al menú</span>
          </button>

          <h1 className="text-[28px] font-semibold font-bricolage text-text-primary">
            Resumen del Pedido
          </h1>

          {/* Order Items */}
          <div className="flex flex-col gap-4 w-full">
            {/* Header */}
            <div className="flex items-center gap-4 px-0 py-3 border-b border-border-empty">
              <span className="text-xs font-semibold font-dm-sans text-text-tertiary w-[180px]">
                Producto
              </span>
              <span className="text-xs font-semibold font-dm-sans text-text-tertiary flex-1">
                Descripción
              </span>
              <span className="text-xs font-semibold font-dm-sans text-text-tertiary w-[60px] text-center">
                Cant.
              </span>
              <span className="text-xs font-semibold font-dm-sans text-text-tertiary w-[80px] text-right">
                Precio
              </span>
            </div>

            {/* Items */}
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-4 rounded-sm2 bg-card p-4"
              >
                <span className="text-sm font-medium font-dm-sans text-text-primary w-[180px]">
                  {item.product.name}
                </span>
                <span className="text-[13px] font-dm-sans text-text-secondary flex-1">
                  {item.product.description}
                </span>
                <span className="text-sm font-medium font-dm-sans text-text-primary w-[60px] text-center">
                  {item.quantity}
                </span>
                <span className="text-sm font-semibold font-dm-sans text-text-primary w-[80px] text-right">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-border-empty w-full" />

          {/* Total */}
          <div className="flex items-center justify-end gap-16 w-full">
            <span className="text-lg font-semibold font-bricolage text-text-primary">
              Total
            </span>
            <span className="text-xl font-bold font-bricolage text-coral-500">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Right Column - Delivery Form */}
        <div className="flex flex-col gap-6 w-[400px] bg-[#FAFAFA] p-10 h-full">
          <h2 className="text-[22px] font-semibold font-bricolage text-text-primary">
            Datos de Entrega
          </h2>

          {/* Name Field */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-[13px] font-medium font-dm-sans text-text-primary">
              Nombre y Apellido
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Juan Pérez"
              className="rounded-sm2 border border-border-empty bg-page h-12 px-4 text-sm font-dm-sans text-text-primary placeholder:text-text-tertiary outline-none focus:border-coral-500 transition-colors"
            />
          </div>

          {/* Phone Field */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-[13px] font-medium font-dm-sans text-text-primary">
              Número de Teléfono
            </label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="+54 11 1234-5678"
              className="rounded-sm2 border border-border-empty bg-page h-12 px-4 text-sm font-dm-sans text-text-primary placeholder:text-text-tertiary outline-none focus:border-coral-500 transition-colors"
            />
          </div>

          {/* Notes Field */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-[13px] font-medium font-dm-sans text-text-primary">
              Aclaraciones
            </label>
            <textarea
              value={aclaraciones}
              onChange={(e) => setAclaraciones(e.target.value)}
              placeholder="Ej: Sin cebolla, timbre roto..."
              className="rounded-sm2 border border-border-empty bg-page h-24 p-4 text-sm font-dm-sans text-text-primary placeholder:text-text-tertiary outline-none resize-none focus:border-coral-500 transition-colors"
            />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Confirm Button */}
          <button
            onClick={handleConfirmarPedido}
            disabled={isSubmitting}
            className="flex items-center justify-center rounded-sm2 bg-coral-500 h-[52px] w-full transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <span className="text-[15px] font-semibold font-dm-sans text-white">
              {isSubmitting ? "Enviando..." : "Confirmar Pedido"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col lg:hidden min-h-screen">
        <div className="flex flex-col gap-5 p-4 flex-1 overflow-y-auto">
          {/* Back button */}
          <button
            onClick={handleVolver}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors self-start"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-dm-sans">Volver</span>
          </button>

          {/* Summary Title */}
          <h1 className="text-lg font-semibold font-bricolage text-text-primary">
            Resumen del Pedido
          </h1>

          {/* Mobile Order Items */}
          <div className="flex flex-col gap-3 w-full">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex flex-col gap-1.5 rounded-sm2 bg-card p-3"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[15px] font-semibold font-dm-sans text-text-primary">
                    {item.product.name}
                  </span>
                  <span className="text-[15px] font-semibold font-dm-sans text-text-primary">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
                <span className="text-xs font-dm-sans text-text-secondary">
                  {item.product.description}
                </span>
                <span className="text-xs font-dm-sans text-text-tertiary">
                  Cantidad: {item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-border-empty w-full" />

          {/* Total */}
          <div className="flex items-center justify-between w-full py-1">
            <span className="text-lg font-semibold font-bricolage text-text-primary">
              Total
            </span>
            <span className="text-xl font-bold font-bricolage text-coral-500">
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          {/* Form Title */}
          <h2 className="text-lg font-semibold font-bricolage text-text-primary">
            Datos de Entrega
          </h2>

          {/* Name Field */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-medium font-dm-sans text-text-primary">
              Nombre y Apellido
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Juan Pérez"
              className="rounded-sm2 border border-border-empty bg-page h-11 px-3.5 text-sm font-dm-sans text-text-primary placeholder:text-text-tertiary outline-none focus:border-coral-500 transition-colors"
            />
          </div>

          {/* Phone Field */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-medium font-dm-sans text-text-primary">
              Número de Teléfono
            </label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="+54 11 1234-5678"
              className="rounded-sm2 border border-border-empty bg-page h-11 px-3.5 text-sm font-dm-sans text-text-primary placeholder:text-text-tertiary outline-none focus:border-coral-500 transition-colors"
            />
          </div>

          {/* Notes Field */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-medium font-dm-sans text-text-primary">
              Aclaraciones
            </label>
            <textarea
              value={aclaraciones}
              onChange={(e) => setAclaraciones(e.target.value)}
              placeholder="Ej: Sin cebolla, timbre roto..."
              className="rounded-sm2 border border-border-empty bg-page h-20 p-3.5 text-sm font-dm-sans text-text-primary placeholder:text-text-tertiary outline-none resize-none focus:border-coral-500 transition-colors"
            />
          </div>

          {/* Spacer */}
          <div className="h-2" />

          {/* Confirm Button */}
          <button
            onClick={handleConfirmarPedido}
            disabled={isSubmitting}
            className="flex items-center justify-center rounded-sm2 bg-coral-500 h-12 w-full transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <span className="text-[15px] font-semibold font-dm-sans text-white">
              {isSubmitting ? "Enviando..." : "Confirmar Pedido"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
