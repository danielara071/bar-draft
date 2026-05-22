import { useState } from "react";
import { PrimaryButton, SecondaryButton } from "@/shared/components/Buttons";
import type { Article } from "@/shared/components/NewsCard";
import { supabase } from "@/lib/supabase";
import ConfirmationPopup from "../ConfirmationPopUp";

interface EditArticleModalProps {
  article: Article;
  onClose: () => void;
  onSave: (updated: Partial<Article>) => void;
}

export default function EditArticleModal({article, onClose, onSave,}: EditArticleModalProps) {
  const [title, setTitle] = useState(article.title);
  const [description, setDescription] = useState(article.description);
  const [imageUrl, setImageUrl] = useState(article.image_url);
  const [popup, setPopup] = useState<{message: string; success: boolean;} | null>(null);

  const handleSave = async () => {
    const { error } = await supabase
      .from("news_articles")
      .update({
        title,
        description,
        image_url: imageUrl,
      })
      .eq("id", article.id);

    if (error) {
      setPopup({message: "¡Error al guardar los cambios!", success: false,});
    } else {
      onSave({title, description, image_url: imageUrl, });
      setPopup({message: "¡Cambios guardados correctamente!",success: true,});
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl p-8">
        <h2 className="text-2xl font-semibold mb-8">Modificar Noticia</h2>

        <div className="grid grid-cols-2 gap-8">

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Título</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-zinc-500"/>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Descripción</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={12} className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm outline-none resize-none focus:border-zinc-500"/>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">URL de la Imagen</label>
              <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-zinc-500"/>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Vista previa</label>

              <div className="bg-white">
                <a href={article.link} target="_blank" rel="noopener noreferrer" className="flex flex-col no-underline text-inherit">
                  <div className="h-72 overflow-hidden bg-zinc-100">
                    <img src={imageUrl || "https://pbs.twimg.com/media/GxwEjq0XIAALuQp.jpg"} alt={title} className="w-full h-full object-cover" onError={(e) => {e.currentTarget.src = "https://pbs.twimg.com/media/GxwEjq0XIAALuQp.jpg";}}/>
                  </div>

                  <div className="pt-3">
                    <h2 className="text-sm md:text-base font-normal leading-tight">{title || "Título de la noticia"}</h2>
                  </div>

                  <div className="pt-3">
                    <p className="text-brand-gray-mid text-xs font-normal leading-tight">{description || "Descripción de la noticia"}</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Fecha de Publicación</label>
              <p className="text-sm text-zinc-500">{new Date(article.pub_date).toLocaleDateString("es-ES", {year: "numeric",month: "long",day: "numeric",})}</p>
            </div>

            <div className="mt-auto flex justify-end gap-3 pt-6">
              <PrimaryButton onClick={onClose} size="sm">Cancelar</PrimaryButton>
              <SecondaryButton onClick={handleSave} size="sm">Guardar</SecondaryButton>
            </div>
          </div>
        </div>
      </div>

      {popup && (
        <ConfirmationPopup message={popup.message} success={popup.success} onClose={() => {
            setPopup(null);
            if (popup.success) {onClose();        
        }}}/>
      )}
    </div>
  );
}
