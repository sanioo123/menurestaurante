"use client";

import type { AdminCategory } from "@/app/admin/page";

interface AdminFilterBarProps {
  categories: AdminCategory[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function AdminFilterBar({
  categories,
  activeCategory,
  onCategoryChange,
}: AdminFilterBarProps) {
  return (
    <div className="flex gap-3 w-full flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => onCategoryChange(cat.slug)}
          className={`flex items-center justify-center rounded-xl2 px-5 py-2.5 transition-colors ${
            activeCategory === cat.slug
              ? "bg-coral-500 text-white"
              : "bg-card text-text-primary hover:bg-border-empty"
          }`}
        >
          <span className="text-sm font-semibold font-dm-sans">
            {cat.name} ({cat.product_count})
          </span>
        </button>
      ))}
    </div>
  );
}
