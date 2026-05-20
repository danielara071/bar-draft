import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { ProductWithCategory } from "../interfaces/productWithCategory";
import { supabase } from "@/shared/services/supabaseClient";

interface EditProductModalProps {
  toggleCard: () => void;
  product: ProductWithCategory;
  onUpdated: () => Promise<void> | void;
}

interface Category {
  id: number;
  name: string;
}

const EditProductModal = ({
  toggleCard,
  product,
  onUpdated,
}: EditProductModalProps) => {
  const [formData, setFormData] = useState({
    name: product.name,
    price: product.price,
    premium: product.premium,
    category_id: product.category_id,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setFormData({
      name: product.name,
      price: product.price,
      premium: product.premium,
      category_id: product.category_id,
    });
  }, [product]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);

      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name", { ascending: true });

      if (error) {
        setErrorMsg(error.message);
        setLoadingCategories(false);
        return;
      }

      setCategories(data ?? []);
      setLoadingCategories(false);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggleCard();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [toggleCard]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "premium"
          ? value === "true"
          : name === "category_id"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.name.trim()) {
      setErrorMsg("El nombre es obligatorio.");
      return;
    }

    if (formData.price < 0) {
      setErrorMsg("El precio no puede ser negativo.");
      return;
    }

    if (!formData.category_id) {
      setErrorMsg("Debes seleccionar una categoría.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("products")
      .update({
        name: formData.name.trim(),
        price: formData.price,
        premium: formData.premium,
        category_id: formData.category_id,
      })
      .eq("id", product.id);

    if (error) {
      setErrorMsg(error.message);
      setSaving(false);
      return;
    }

    await onUpdated();
    setSaving(false);
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4"
      onClick={toggleCard}
    >
      <div
        className="relative z-50 w-full max-w-2xl rounded-2xl bg-brand-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-product-title"
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2
            id="edit-product-title"
            className="text-2xl font-bold text-brand-navy"
          >
            Editar producto
          </h2>

          <button
            type="button"
            onClick={toggleCard}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Cerrar modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Read-only image preview */}
            <div className="md:col-span-2">
              <p className="mb-2 block text-sm font-semibold text-slate-700">
                Imagen actual
              </p>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-64 w-full object-contain"
                />
              </div>
            </div>

            {/* Name */}
            <div className="md:col-span-2">
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-navy"
                placeholder="Nombre del producto"
              />
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Precio
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-navy"
              />
            </div>

            {/* Premium dropdown */}
            <div>
              <label
                htmlFor="premium"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Tipo de producto
              </label>
              <select
                id="premium"
                name="premium"
                value={String(formData.premium)}
                onChange={handleSelectChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-navy"
              >
                <option value="false">Estándar</option>
                <option value="true">Premium</option>
              </select>
            </div>

            {/* Category dropdown */}
            <div className="md:col-span-2">
              <label
                htmlFor="category_id"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Categoría
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleSelectChange}
                disabled={loadingCategories}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-navy disabled:bg-slate-100"
              >
                <option value="">
                  {loadingCategories
                    ? "Cargando categorías..."
                    : "Selecciona una categoría"}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Error message */}
          {errorMsg && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {errorMsg}
            </p>
          )}

          {/* Actions */}
          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={toggleCard}
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving || loadingCategories}
              className="rounded-xl bg-brand-navy px-5 py-3 font-semibold text-white transition hover:bg-blue-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;