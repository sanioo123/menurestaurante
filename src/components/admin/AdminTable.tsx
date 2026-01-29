"use client";

import type { AdminProduct } from "@/app/admin/page";
import ProductRow from "./ProductRow";

interface AdminTableProps {
  products: AdminProduct[];
  onEdit: (product: AdminProduct) => void;
  onDelete: (productId: number) => void;
}

export default function AdminTable({ products, onEdit, onDelete }: AdminTableProps) {
  return (
    <div className="flex flex-col rounded-lg2 bg-white border border-border-empty flex-1 overflow-hidden">
      {/* Table Header */}
      <div className="flex items-center p-4 border-b border-border-empty">
        <div className="w-20">
          <span className="text-xs font-semibold font-dm-sans text-text-tertiary">
            Imagen
          </span>
        </div>
        <div className="w-[280px]">
          <span className="text-xs font-semibold font-dm-sans text-text-tertiary">
            Nombre
          </span>
        </div>
        <div className="w-[150px]">
          <span className="text-xs font-semibold font-dm-sans text-text-tertiary">
            Categoria
          </span>
        </div>
        <div className="w-[120px]">
          <span className="text-xs font-semibold font-dm-sans text-text-tertiary">
            Precio
          </span>
        </div>
        <div className="w-[100px]">
          <span className="text-xs font-semibold font-dm-sans text-text-tertiary">
            Stock
          </span>
        </div>
        <div className="flex-1 flex justify-center">
          <span className="text-xs font-semibold font-dm-sans text-text-tertiary">
            Acciones
          </span>
        </div>
      </div>

      {/* Table Body */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {products.length === 0 ? (
          <div className="flex items-center justify-center flex-1 p-8">
            <p className="text-text-secondary font-dm-sans">No hay productos</p>
          </div>
        ) : (
          products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
