"use client";

import { useState, useEffect, useCallback } from "react";
import { ShoppingCart as ShoppingCartIcon } from "lucide-react";
import { useCart } from "@/context/CartContext";
import FilterBar from "@/components/FilterBar";
import ProductCard from "@/components/ProductCard";
import MobileProductCard from "@/components/MobileProductCard";
import ShoppingCart from "@/components/ShoppingCart";
import MobileCartOverlay from "@/components/MobileCartOverlay";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  category_slug: string;
  category_name: string;
  image_url: string | null;
  in_stock: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  product_count: number;
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("todos");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const url = activeCategory === "todos"
        ? "/api/products"
        : `/api/products?category=${activeCategory}`;
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Main Content */}
      <div className="flex flex-col gap-6 flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h1 className="text-[32px] leading-tight font-bold font-bricolage text-text-primary hidden lg:block">
              Menu del Restaurante
            </h1>
            <h1 className="text-[28px] leading-tight font-bold font-bricolage text-text-primary lg:hidden">
              Menu
            </h1>
            <p className="text-[15px] text-text-secondary font-dm-sans hidden lg:block">
              Selecciona tus platillos favoritos
            </p>
            <p className="text-sm text-text-secondary font-dm-sans lg:hidden">
              Selecciona tus platillos favoritos
            </p>
          </div>

          {/* Mobile cart button */}
          <button
            onClick={() => setIsMobileCartOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl2 bg-coral-500 px-4 py-2.5 h-11 lg:hidden transition-opacity hover:opacity-90"
          >
            <ShoppingCartIcon size={20} className="text-white" />
            <span className="text-sm font-bold font-dm-sans text-white">{totalItems}</span>
          </button>
        </div>

        {/* Filters */}
        <FilterBar
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center flex-1">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-500" />
          </div>
        ) : (
          <>
            {/* Desktop Product Grid (2 columns) */}
            <div className="hidden lg:grid grid-cols-2 gap-4 flex-1">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Mobile Product List */}
            <div className="flex flex-col gap-4 lg:hidden flex-1">
              {products.map((product) => (
                <MobileProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Desktop Shopping Cart Sidebar */}
      <div className="hidden lg:block border-l border-border-subtle">
        <ShoppingCart />
      </div>

      {/* Mobile Cart Overlay */}
      <MobileCartOverlay
        isOpen={isMobileCartOpen}
        onClose={() => setIsMobileCartOpen(false)}
      />
    </div>
  );
}
