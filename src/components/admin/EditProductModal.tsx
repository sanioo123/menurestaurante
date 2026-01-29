"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, Upload, ChevronDown, Pencil } from "lucide-react";
import type { AdminProduct, AdminCategory } from "@/app/admin/page";

interface EditProductModalProps {
  isOpen: boolean;
  product: AdminProduct | null;
  categories: AdminCategory[];
  isNew: boolean;
  onClose: () => void;
  onSave: (product: AdminProduct) => void;
  onImageUpload: (file: File) => void;
  onOpenImageEditor: () => void;
}

export default function EditProductModal({
  isOpen,
  product,
  categories,
  isNew,
  onClose,
  onSave,
  onImageUpload,
  onOpenImageEditor,
}: EditProductModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState(1);
  const [inStock, setInStock] = useState(true);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setCategoryId(product.category_id);
      setInStock(product.in_stock);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleSave = () => {
    const selectedCategory = categories.find((c) => c.id === categoryId);
    onSave({
      ...product,
      name,
      description,
      price: parseFloat(price) || 0,
      category_id: categoryId,
      category_slug: selectedCategory?.slug || "pizzas",
      category_name: selectedCategory?.name || "Pizzas",
      in_stock: inStock,
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleImageAreaClick = () => {
    if (product.image_url) {
      onOpenImageEditor();
    } else {
      fileInputRef.current?.click();
    }
  };

  const selectedCategoryName =
    categories.find((c) => c.id === categoryId)?.name || "Seleccionar";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-20"
      onClick={onClose}
    >
      <div
        className="flex flex-col rounded-xl2 bg-white w-[600px] max-h-[calc(100vh-160px)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-empty">
          <h2 className="text-2xl font-bold font-bricolage text-text-primary">
            {isNew ? "Agregar Producto" : "Editar Producto"}
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg2 bg-border-empty transition-colors hover:bg-text-tertiary"
          >
            <X size={18} className="text-text-primary" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-5 p-6 overflow-y-auto">
          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-semibold font-dm-sans text-text-primary">
              Imagen del producto
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={handleImageAreaClick}
              className="flex flex-col items-center justify-center gap-3 rounded-sm2 border-2 border-dashed border-border-empty h-[200px] w-full transition-colors hover:border-text-tertiary hover:bg-card/50 relative overflow-hidden"
            >
              {product.image_url ? (
                <>
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      transform: `scale(${(product.image_data?.zoom || 100) / 100}) rotate(${product.image_data?.rotation || 0}deg) scaleX(${product.image_data?.flipH ? -1 : 1})`,
                    }}
                  >
                    <Image
                      src={product.image_url}
                      alt="Preview"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10">
                    <div className="flex items-center gap-2 text-white">
                      <Pencil size={20} />
                      <span className="text-sm font-semibold font-dm-sans">
                        Editar imagen
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-[120px] h-[120px] rounded-sm2 bg-card" />
                  <Upload size={24} className="text-text-tertiary" />
                  <span className="text-[13px] font-dm-sans text-text-tertiary">
                    Click para subir imagen
                  </span>
                </>
              )}
            </button>
            {product.image_url && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="self-start text-sm text-coral-500 font-dm-sans hover:underline"
              >
                Cambiar imagen
              </button>
            )}
          </div>

          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-semibold font-dm-sans text-text-primary">
              Nombre del producto
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Pizza Margarita"
              className="flex items-center rounded-sm2 border border-border-empty h-11 px-4 text-sm font-dm-sans text-text-primary outline-none focus:border-coral-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-semibold font-dm-sans text-text-primary">
              Descripcion
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Mozzarella, tomate, albahaca"
              className="rounded-sm2 border border-border-empty h-20 p-4 text-sm font-dm-sans text-text-primary outline-none resize-none focus:border-coral-500 transition-colors"
            />
          </div>

          {/* Price & Category Row */}
          <div className="flex gap-4 w-full">
            {/* Price */}
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-[13px] font-semibold font-dm-sans text-text-primary">
                Precio
              </label>
              <div className="flex items-center rounded-sm2 border border-border-empty h-11 px-4 gap-2 focus-within:border-coral-500 transition-colors">
                <span className="text-sm font-semibold font-dm-sans text-text-tertiary">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 text-sm font-dm-sans text-text-primary outline-none"
                />
              </div>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2 flex-1 relative">
              <label className="text-[13px] font-semibold font-dm-sans text-text-primary">
                Categoria
              </label>
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center justify-between rounded-sm2 border border-border-empty h-11 px-4"
              >
                <span className="text-sm font-dm-sans text-text-primary">
                  {selectedCategoryName}
                </span>
                <ChevronDown size={16} className="text-text-tertiary" />
              </button>

              {showCategoryDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-sm2 border border-border-empty bg-white shadow-lg z-10">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCategoryId(cat.id);
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-dm-sans transition-colors hover:bg-card ${
                        categoryId === cat.id ? "text-coral-500 bg-card" : "text-text-primary"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stock Toggle */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-semibold font-dm-sans text-text-primary">
              Estado de stock
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setInStock(!inStock)}
                className={`relative w-12 h-7 rounded-full p-0.5 transition-colors ${
                  inStock ? "bg-coral-500" : "bg-border-empty"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white transition-transform ${
                    inStock ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-sm font-semibold font-dm-sans text-text-primary">
                {inStock ? "En stock" : "Sin stock"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border-empty">
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg2 border border-border-empty px-6 py-3 transition-colors hover:bg-card"
          >
            <span className="text-sm font-semibold font-dm-sans text-text-primary">
              Cancelar
            </span>
          </button>
          <button
            onClick={handleSave}
            disabled={!name || !price}
            className="flex items-center justify-center rounded-lg2 bg-coral-500 px-6 py-3 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-sm font-semibold font-dm-sans text-white">
              {isNew ? "Agregar Producto" : "Guardar Cambios"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
