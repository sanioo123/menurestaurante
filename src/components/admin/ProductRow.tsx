"use client";

import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import type { AdminProduct } from "@/app/admin/page";

interface ProductRowProps {
  product: AdminProduct;
  onEdit: (product: AdminProduct) => void;
  onDelete: (productId: number) => void;
}

export default function ProductRow({ product, onEdit, onDelete }: ProductRowProps) {
  return (
    <div className="flex items-center p-4 border-b border-border-empty w-full">
      {/* Image */}
      <div className="w-20">
        <div className="w-[50px] h-[50px] rounded-lg bg-card relative overflow-hidden">
          {product.image_url && (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
            />
          )}
        </div>
      </div>

      {/* Name & Description */}
      <div className="flex flex-col gap-0.5 w-[280px]">
        <span className="text-sm font-semibold font-dm-sans text-text-primary">
          {product.name}
        </span>
        <span className="text-xs font-dm-sans text-text-secondary">
          {product.description}
        </span>
      </div>

      {/* Category Badge */}
      <div className="w-[150px]">
        <span
          className="inline-flex items-center rounded-sm2 px-3 py-1.5 text-xs font-semibold font-dm-sans"
          style={{ backgroundColor: product.badge_bg, color: product.badge_text }}
        >
          {product.category_name}
        </span>
      </div>

      {/* Price */}
      <div className="w-[120px]">
        <span className="text-base font-bold font-bricolage text-coral-500">
          ${product.price.toFixed(2)}
        </span>
      </div>

      {/* Stock */}
      <div className="w-[100px] flex items-center">
        {product.in_stock ? (
          <span className="inline-flex items-center rounded-[10px] px-2.5 py-1 text-[11px] font-semibold font-dm-sans bg-badge-green text-accent-green">
            En stock
          </span>
        ) : (
          <span className="inline-flex items-center rounded-[10px] px-2.5 py-1 text-[11px] font-semibold font-dm-sans bg-[#FEE2E2] text-coral-500">
            Sin stock
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex-1 flex items-center justify-center gap-2">
        <button
          onClick={() => onEdit(product)}
          className="flex items-center justify-center gap-1.5 rounded-sm2 bg-card px-4 py-2 transition-colors hover:bg-border-empty"
        >
          <Pencil size={14} className="text-text-primary" />
          <span className="text-[13px] font-semibold font-dm-sans text-text-primary">
            Editar
          </span>
        </button>

        <button
          onClick={() => onDelete(product.id)}
          className="flex items-center justify-center gap-1.5 rounded-sm2 border border-coral-500 px-4 py-2 transition-colors hover:bg-coral-500/10"
        >
          <Trash2 size={14} className="text-coral-500" />
          <span className="text-[13px] font-semibold font-dm-sans text-coral-500">
            Eliminar
          </span>
        </button>
      </div>
    </div>
  );
}
