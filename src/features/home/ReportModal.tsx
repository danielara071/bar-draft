import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const PAGES = ["Inicio", "WatchParty", "WatchParty Hub", "Wordle", "RA Hub","RA", "Perfil", "Perfil Amigo","Tienda","Estadísticas","Otro"];

interface ReportProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;  
  userId?: string;
}

export default function ReportErrorModal({ isOpen, onClose, userId, onSuccess }: ReportProps) {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if(isOpen) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!description.trim()) return setError("Por favor describe el error.");
    if (!location) return setError("Por favor agrega una ubicación.");
    setLoading(true);
    setError(null);
    onClose();
    onSuccess();

    let screenshot_url: string | null = null;

    if (imageFile) {
      const fileName = `${Date.now()}.${imageFile.name.split(".").pop()}`;
      const { error: uploadErr } = await supabase.storage.from("error-screenshots").upload(fileName, imageFile);
      if (uploadErr) { setError(uploadErr.message); setLoading(false); return; }
      screenshot_url = supabase.storage.from("error-screenshots").getPublicUrl(fileName).data.publicUrl;
    }

    const { error: err } = await supabase.from("error_reports").insert({
      user_id: userId ?? null,
      description: description.trim(),
      location: location || null,
      screenshot_url,
    });

    setLoading(false);
    if (err) return setError(err.message);
    setDescription(""); setLocation(""); setImageFile(null); setPreview(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        <div className="px-8 pt-8 pb-6 text-center">
          <h2 className="text-brand-navy text-3xl font-bold">Reporta un Error</h2>
          <p className="text-brand-gray-mid text-sm mt-2">
            Ayúdanos a mejorar tu experiencia al reportar cualquier error que hayas encontrado.
          </p>
        </div>

        <div className="px-8 py-6 space-y-5">

          <div>
            <label className="flex items-center gap-1 text-sm font-semibold mb-2">
                <span className="material-symbols-outlined text-brand-crimson text-base leading-none">bug_report</span>
                 1. Describe el error <span className="text-brand-crimson">*</span></label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Por favor describe lo que pasó, lo que esperabas que pasara y cualquier paso para reproducir el error."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-brand-crimson/40"
            />
          </div>

          <div>
            <label className="flex items-center gap-1 text-sm font-semibold mb-2">
                <span className="material-symbols-outlined text-brand-crimson text-base leading-none">pageview</span>
                2. ¿Dónde lo encontraste? <span className="text-brand-crimson">*</span></label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-crimson/40"
            >
              <option value="">Selecciona una página...</option>
              {PAGES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-1 text-sm font-semibold mb-2">
                <span className="material-symbols-outlined text-brand-crimson text-base leading-none">image</span>
                3. Sube una foto</label>
            <div
              onClick={() => !preview && fileInputRef.current?.click()}
              className="relative w-full min-h-[100px] rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:bg-gray-50 transition"
            >
              {preview ? (
                <>
                  <img src={preview} alt="preview" className="w-full object-contain max-h-44" />
                  <button
                    onClick={(e) => { e.stopPropagation(); setImageFile(null); setPreview(null); }}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full w-6 h-6 text-xs"
                  >✕</button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-24 text-gray-400 text-sm gap-1">
                  <span className="material-symbols-outlined text-2xl">upload</span>
                  <span>Haz clic para subir una imagen</span>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
        </div>

        <div className="px-8 pb-8 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-full bg-brand-crimson text-white font-semibold text-sm hover:bg-[#8b003a] transition">
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={loading} className="flex-1 py-3 rounded-full bg-brand-navy text-white font-semibold text-sm hover:bg-[#162340] transition disabled:opacity-60">
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </div>

      </div>
    </div>
  );
}