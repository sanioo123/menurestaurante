"use client";

import { type Category } from "@/app/page";

interface FilterBarProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function FilterBar({ categories, activeCategory, onCategoryChange }: FilterBarProps) {
  return (
    <div className="flex gap-3 flex-wrap">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.slug;
        return (
          <button
            key={cat.slug}
            onClick={() => onCategoryChange(cat.slug)}
            className={`flex items-center justify-center rounded-xl2 px-5 py-2.5 text-sm font-semibold font-dm-sans transition-colors
              ${
                isActive
                  ? "bg-coral-500 text-white"
                  : "bg-card text-text-primary hover:bg-border-empty"
              }`}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
