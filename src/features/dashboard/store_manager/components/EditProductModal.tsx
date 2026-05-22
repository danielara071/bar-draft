import { useEffect, useRef, useState } from "react";
import { X, UploadCloud, ImageIcon } from "lucide-react";
import type { ProductWithCategory } from "../interfaces/productWithCategory";
import { supabase } from "@/shared/services/supabaseClient";
import PopUp from "./PopUp"; // adjust import path as needed

interface EditProductModalProps {
  toggleCard: () => void;
  product: ProductWithCategory;
  onUpdated: () => Promise<void> | void;
}

interface Category {
  id: number;
  name: string;
}

const BUCKET = "productos";

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
  const [popup, setPopup] = useState<{ message: string; success: boolean } | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(product.image_url);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData({
      name: product.name,
      price: product.price,
      premium: product.premium,
      category_id: product.category_id,
    });
    setImagePreview(product.image_url);
    setImageFile(null);
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

  const applyImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("El archivo debe ser una imagen.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrorMsg("");
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) applyImageFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) applyImageFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

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

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const fileName = `${product.id}_${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
    return data.publicUrl;
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

    try {
      let image_url = product.image_url;

      if (imageFile) {
        image_url = await uploadImage(imageFile);
      }

      const { error } = await supabase
        .from("products")
        .update({
          name: formData.name.trim(),
          price: formData.price,
          premium: formData.premium,
          category_id: formData.category_id,
          image_url,
        })
        .eq("id", product.id);

      if (error) {
        setPopup({ message: "Error al guardar los cambios.", success: false });
        setSaving(false);
        return;
      }

      setPopup({ message: "Producto actualizado correctamente.", success: true });
    } catch (err: unknown) {
      setPopup({
        message: err instanceof Error ? err.message : "Error al subir imagen.",
        success: false,
      });
    }

    setSaving(false);
  };

  return (
    <>
      {popup && (
        <PopUp
          message={popup.message}
          success={popup.success}
          onClose={async () => {
            setPopup(null);
            if (popup.success) {
              await onUpdated();
              toggleCard();
            }
          }}
        />
      )}

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

              {/* Image upload section */}
              <div className="md:col-span-2">
                <p className="mb-2 block text-sm font-semibold text-slate-700">
                  Imagen del producto
                </p>

                <div className="mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt={formData.name}
                      className="h-64 w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-64 items-center justify-center text-slate-400">
                      <ImageIcon className="h-12 w-12" />
                    </div>
                  )}
                </div>

                <label
                  htmlFor="image-upload"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-5 text-center transition
                    ${
                      isDragging
                        ? "border-brand-navy bg-blue-50 text-brand-navy"
                        : "border-slate-300 text-slate-500 hover:border-brand-navy hover:bg-slate-50 hover:text-brand-navy"
                    }`}
                >
                  <UploadCloud className="h-6 w-6" />
                  <p className="text-sm font-medium">
                    {imageFile
                      ? imageFile.name
                      : "Arrastra una imagen o haz clic para seleccionar"}
                  </p>
                  <p className="text-xs text-slate-400">PNG, JPG, WEBP · Max 5 MB</p>
                </label>

                <input
                  id="image-upload"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInput}
                />
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
    </>
  );
};

export default EditProductModal;