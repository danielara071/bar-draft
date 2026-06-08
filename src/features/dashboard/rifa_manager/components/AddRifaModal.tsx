import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/shared/services/supabaseClient";

interface AddRifaModalProps {
  onClose: () => void;
  onCreated: () => Promise<void>;
}

type RifaType = "boleto" | "experiencia" | "viaje";

const RIFA_TYPES: { value: RifaType; label: string }[] = [
  { value: "boleto", label: "RIFA DE BOLETO" },
  { value: "experiencia", label: "RIFA DE EXPERIENCIA" },
  { value: "viaje", label: "RIFA DE VIAJE" },
];

const AddRifaModal = ({ onClose, onCreated }: AddRifaModalProps) => {
  const [tipo, setTipo] = useState<RifaType>("boleto");
  const [nombre, setNombre] = useState("");
  const [totalBoletos, setTotalBoletos] = useState(100);
  const [costoMonedas, setCostoMonedas] = useState(2000);
  const [fechaCierre, setFechaCierre] = useState("");
  const [premium, setPremium] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const filePath = `rifas/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("productos")
      .upload(filePath, file, { upsert: false });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from("productos").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    if (!nombre.trim()) {
      setErrorMsg("El nombre es obligatorio.");
      return;
    }
    if (totalBoletos < 1) {
      setErrorMsg("Debe haber al menos 1 boleto.");
      return;
    }
    if (!fechaCierre) {
      setErrorMsg("La fecha de cierre es obligatoria.");
      return;
    }

    setSaving(true);

    let image_url: string | null = null;

    if (imageFile) {
      try {
        image_url = await uploadImage(imageFile);
      } catch (err) {
        setErrorMsg((err as Error).message ?? "Error al subir la imagen.");
        setSaving(false);
        return;
      }
    }

    const { error } = await supabase.from("rifas").insert({
      name: nombre.trim(),
      type: tipo,
      total_boletos: totalBoletos,
      costo_monedas: costoMonedas,
      premium,
      image_url,
      fecha_cierre: fechaCierre,
      estado: "activa",
    });

    setSaving(false);

    if (error) {
      setErrorMsg(`Error al crear la rifa: ${error.message}`);
      console.error("Supabase insert rifas:", error);
      return;
    }

    await onCreated();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="relative z-50 w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#0d2b4d]">Añadir Nueva Rifa</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Tipo */}
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-700">¿Qué tipo de Rifa?</p>
            <div className="flex flex-wrap gap-2">
              {RIFA_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTipo(t.value)}
                  className={`rounded-xl border px-4 py-2 text-xs font-bold transition ${
                    tipo === t.value
                      ? "border-[#0d2b4d] bg-[#0d2b4d] text-white"
                      : "border-slate-300 bg-white text-slate-600 hover:border-[#0d2b4d]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Nombre */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Nombre
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Escribe el nombre de la rifa..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#0d2b4d]"
            />
          </div>

          {/* Boletos y monedas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                ¿Cuántos boletos?
              </label>
              <input
                type="number"
                min={1}
                value={totalBoletos}
                onChange={(e) => setTotalBoletos(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#0d2b4d]"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                ¿Cuántas monedas costará?
              </label>
              <input
                type="number"
                min={1}
                value={costoMonedas}
                onChange={(e) => setCostoMonedas(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#0d2b4d]"
              />
            </div>
          </div>

          {/* Fecha de cierre */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Fecha de cierre
            </label>
            <input
              type="date"
              value={fechaCierre}
              min={(() => {
                const d = new Date();
                d.setDate(d.getDate() + 1);
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
              })()}
              onChange={(e) => setFechaCierre(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#0d2b4d]"
            />
          </div>

          {/* Tipo de usuario */}
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-700">
              ¿Para qué tipo de usuarios es esta Rifa?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPremium(true)}
                className={`flex-1 rounded-xl border py-2 text-sm font-semibold transition ${
                  premium
                    ? "border-[#EDBB00] bg-[#EDBB00]/15 text-[#8a6200]"
                    : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
                }`}
              >
                Usuarios Premium
              </button>
              <button
                type="button"
                onClick={() => setPremium(false)}
                className={`flex-1 rounded-xl border py-2 text-sm font-semibold transition ${
                  !premium
                    ? "border-[#0d2b4d] bg-[#0d2b4d]/10 text-[#0d2b4d]"
                    : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
                }`}
              >
                Usuarios Estándar
              </button>
            </div>
          </div>

          {/* Imagen */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Agrega imagen
            </label>
            <div
              onClick={() => !imagePreview && fileInputRef.current?.click()}
              className="relative w-full min-h-[100px] rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:bg-gray-50 transition"
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Vista previa" className="w-full object-contain max-h-44" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      URL.revokeObjectURL(imagePreview);
                      setImageFile(null);
                      setImagePreview("");
                    }}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-24 text-gray-400 text-sm gap-1">
                  <span className="material-symbols-outlined text-2xl">upload</span>
                  <span>Haz clic para subir una imagen</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {errorMsg && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {errorMsg}
            </p>
          )}

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl bg-[#a50044] py-3 text-sm font-bold text-white transition hover:bg-[#870038]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-2xl bg-[#EDBB00] py-3 text-sm font-bold text-[#0d2b4d] transition hover:bg-[#d4a800] disabled:opacity-60"
            >
              {saving ? "Publicando..." : "Publicar Rifa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRifaModal;
