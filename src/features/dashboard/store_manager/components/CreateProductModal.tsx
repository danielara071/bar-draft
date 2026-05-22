import { useEffect, useRef, useState } from "react";
import { X, UploadCloud } from "lucide-react";
import { supabase } from "@/shared/services/supabaseClient";

interface CreateProductModalProps {
  toggleCard: () => void;
  onCreated: () => Promise<void> | void;
}

interface Category {
  id: number;
  name: string;
}

const CreateProductModal = ({
  toggleCard,
  onCreated,
}: CreateProductModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    premium: false,
    category_id: 0,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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

  // Clean up the object URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke previous preview URL
    if (imagePreview) URL.revokeObjectURL(imagePreview);

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;
    const filePath = fileName; // root of the bucket, no subfolder

    const { error: uploadError } = await supabase.storage
      .from("productos")
      .upload(filePath, file, { upsert: false });

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage.from("productos").getPublicUrl(filePath);

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

    if (!imageFile) {
      setErrorMsg("Debes seleccionar una imagen.");
      return;
    }

    setSaving(true);

    let image_url = "";

    try {
      image_url = await uploadImage(imageFile);
    } catch (err) {
      setErrorMsg((err as Error).message);
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("products").insert({
      name: formData.name.trim(),
      price: formData.price,
      premium: formData.premium,
      category_id: formData.category_id,
      image_url,
    });

    if (error) {
      setErrorMsg(error.message);
      setSaving(false);
      return;
    }

    await onCreated();
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
        aria-labelledby="create-product-title"
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2
            id="create-product-title"
            className="text-2xl font-bold text-brand-navy"
          >
            Nuevo producto
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

            {/* Image upload */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Imagen
              </label>

              {/* Drop zone / click to upload */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-slate-500 transition hover:border-brand-navy hover:bg-slate-100"
              >
                <UploadCloud className="h-8 w-8" />
                <span className="text-sm font-medium">
                  {imageFile
                    ? imageFile.name
                    : "Haz clic para seleccionar una imagen"}
                </span>
                <span className="text-xs text-slate-400">
                  PNG, JPG, WEBP — máx. 5 MB
                </span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Live preview */}
              {imagePreview && (
                <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <img
                    src={imagePreview}
                    alt="Vista previa"
                    className="h-48 w-full object-contain"
                  />
                </div>
              )}
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
              {saving ? "Subiendo..." : "Crear producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
