"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminTable from "@/components/admin/AdminTable";
import EditProductModal from "@/components/admin/EditProductModal";
import ImageEditorModal from "@/components/admin/ImageEditorModal";

export interface AdminProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  category_slug: string;
  category_name: string;
  badge_bg: string;
  badge_text: string;
  image_url: string | null;
  image_data: {
    zoom?: number;
    rotation?: number;
    flipH?: boolean;
  } | null;
  in_stock: boolean;
}

export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  badge_bg: string;
  badge_text: string;
  product_count: number;
}

export default function AdminPage() {
  const [activeCategory, setActiveCategory] = useState("todos");
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  // Fetch products
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
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingProduct({
      id: 0,
      name: "",
      description: "",
      price: 0,
      category_id: categories.find(c => c.slug !== "todos")?.id || 1,
      category_slug: "pizzas",
      category_name: "Pizzas",
      badge_bg: "#FFFBEB",
      badge_text: "#D97706",
      image_url: null,
      image_data: null,
      in_stock: true,
    });
    setIsEditModalOpen(true);
  };

  const handleEdit = (product: AdminProduct) => {
    setIsAddingNew(false);
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (productId: number) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchProducts();
        await fetchCategories();
      } else {
        console.error("Error deleting product");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleSave = async (product: AdminProduct) => {
    try {
      const method = isAddingNew ? "POST" : "PUT";
      const url = isAddingNew ? "/api/products" : `/api/products/${product.id}`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          price: product.price,
          category_id: product.category_id,
          image_url: product.image_url,
          image_data: product.image_data,
          in_stock: product.in_stock,
        }),
      });

      if (res.ok) {
        setIsEditModalOpen(false);
        setEditingProduct(null);
        await fetchProducts();
        await fetchCategories();
      } else {
        const errorData = await res.json();
        console.error("Error saving product:", errorData);
        alert(`Error al guardar: ${errorData.error || "Error desconocido"}`);
      }
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Error de conexión al guardar el producto");
    }
  };

  const handleOpenImageEditor = () => {
    setIsImageEditorOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (editingProduct) {
          setEditingProduct({
            ...editingProduct,
            image_url: data.url,
            image_data: { zoom: 100, rotation: 0, flipH: false },
          });
        }
      }
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };

  const handleApplyImageEdits = async (zoom: number, rotation: number, flipH: boolean) => {
    if (!editingProduct?.image_url) return;

    try {
      const res = await fetch("/api/upload/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: editingProduct.image_url,
          zoom,
          rotation,
          flipH,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setEditingProduct({
          ...editingProduct,
          image_url: data.url,
          image_data: { zoom, rotation, flipH },
        });
        setIsImageEditorOpen(false);
      }
    } catch (err) {
      console.error("Error processing image:", err);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-5 px-8 border-b border-border-empty">
        <div className="flex flex-col gap-1">
          <h1 className="text-[28px] font-bold font-bricolage text-text-primary">
            Panel de Administracion
          </h1>
          <p className="text-sm font-dm-sans text-text-secondary">
            Gestiona tus productos
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="flex items-center justify-center gap-2 rounded-xl2 bg-coral-500 px-6 py-3 transition-opacity hover:opacity-90"
        >
          <Plus size={18} className="text-white" />
          <span className="text-sm font-semibold font-dm-sans text-white">
            Agregar Producto
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6 flex-1 p-8 overflow-hidden">
        {/* Filters */}
        <AdminFilterBar
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
          <AdminTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={isEditModalOpen}
        product={editingProduct}
        categories={categories.filter(c => c.slug !== "todos")}
        isNew={isAddingNew}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSave}
        onImageUpload={handleImageUpload}
        onOpenImageEditor={handleOpenImageEditor}
      />

      {/* Image Editor Modal */}
      <ImageEditorModal
        isOpen={isImageEditorOpen}
        imageUrl={editingProduct?.image_url || null}
        initialZoom={editingProduct?.image_data?.zoom || 100}
        initialRotation={editingProduct?.image_data?.rotation || 0}
        initialFlipH={editingProduct?.image_data?.flipH || false}
        onClose={() => setIsImageEditorOpen(false)}
        onApply={handleApplyImageEdits}
      />
    </div>
  );
}
