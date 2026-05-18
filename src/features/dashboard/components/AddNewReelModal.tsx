import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/shared/services/supabaseClient";
import { NewReelForm } from "./NewReelForm";
import PreviewReel from "./PreviewReel";

interface AddNewReelModalProps {
  toggleCard: () => void;
  updated: () => void;
}

const AddNewReelModal = ({ toggleCard, updated }: AddNewReelModalProps) => {
  const [message, setMessage] = useState<boolean | null>(null);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [localUrlVideo, setLocalUrlVideo] = useState<string | null>(null);
  const [localThumbnailUrl, setLocalThumbnailUrl] = useState<string | null>(
    null,
  );
  const [isMuted, setIsMuted] = useState(true);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (localUrlVideo) URL.revokeObjectURL(localUrlVideo);
      const url = URL.createObjectURL(file);
      setLocalUrlVideo(url);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (localThumbnailUrl) URL.revokeObjectURL(localThumbnailUrl);
      const url = URL.createObjectURL(file);
      setLocalThumbnailUrl(url);
    }
  };

  const handleRemove = () => {
    if (localUrlVideo) URL.revokeObjectURL(localUrlVideo);
    if (localThumbnailUrl) URL.revokeObjectURL(localThumbnailUrl);

    setLocalUrlVideo(null);
    setLocalThumbnailUrl(null);
  };

  useEffect(() => {
    return () => {
      if (localUrlVideo) URL.revokeObjectURL(localUrlVideo);
      if (localThumbnailUrl) URL.revokeObjectURL(localThumbnailUrl);
    };
  }, [localUrlVideo, localThumbnailUrl]);

  const handleSubmit = async (data: any) => {
    const { error } = await supabase.from("videos").insert([
      {
        video_url: data.video_url,
        thumbnail_url: data.thumbnail_url,
        caption: data.caption,
        category: data.category,
        order_index: data.order_index,
        is_active: data.is_active,
      },
    ]);

    if (error) {
      console.log(error);
      setIsSuccessful(false);
      setMessage(true);
      return;
    }

    setIsSuccessful(true);
    setMessage(true);
    updated();
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4"
      onClick={() => {
        toggleCard();
        setMessage(false);
      }}
    >
      <div
        className="relative z-50 w-full max-w-4xl rounded-2xl bg-brand-white p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            toggleCard();
            setMessage(false);
          }}
          className="absolute right-5 top-5 cursor-pointer rounded-full border border-slate-100 transition hover:border-black/20"
        >
          <X color="gray" />
        </button>

        <div className="mb-5 pr-10">
          <h2 className="text-lg font-semibold text-slate-800">Agregar reel</h2>
          <p className="text-sm text-slate-500">
            Sube el video y la miniatura antes de guardarlo.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <div className="w-full max-w-xs">
            <NewReelForm
              uploadVideo={handleSubmit}
              setLocalVideoPreview={handleVideoChange}
              setLocalThumbnailPreview={handleThumbnailChange}
              handleRemove={handleRemove}
            />
          </div>

          <div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col items-center">
                <p className="mb-2 text-sm font-medium text-slate-600">Video</p>
                {localUrlVideo ? (
                  <PreviewReel
                    video_url={localUrlVideo}
                    muted={isMuted}
                    changeMute={() => setIsMuted((prev) => !prev)}
                  />
                ) : (
                  <div className="h-80 w-60 rounded-2xl border border-brand-navy border-dashed flex items-center justify-center">
                    <p className="text-sm font-medium text-gray-500">
                      Escoge un reel
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center">
                <p className="mb-2 text-sm font-medium text-slate-600">
                  Miniatura
                </p>
                {localThumbnailUrl ? (
                  <img
                    src={localThumbnailUrl}
                    alt="Miniatura del reel"
                    className="h-80 w-60 rounded-2xl object-cover border border-slate-200 shadow-md"
                  />
                ) : (
                  <div className="h-80 w-60 rounded-2xl border border-slate-300 border-dashed flex items-center justify-center">
                    <p className="text-sm font-medium text-gray-500">
                      Escoge una miniatura
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {message &&
          (isSuccessful ? (
            <div className="absolute left-1/2 bottom-2 h-12 w-64 -translate-x-1/2 rounded-md border border-green-200 bg-green-50 p-2 flex items-center justify-center">
              <p className="text-sm font-semibold tracking-tight text-green-600">
                Actualización exitosa
              </p>
            </div>
          ) : (
            <div className="absolute left-1/2 bottom-2 h-12 w-64 -translate-x-1/2 rounded-md border border-red-200 bg-red-50 p-2 flex items-center justify-center">
              <p className="text-sm font-semibold tracking-tight text-red-900">
                Error al actualizar los datos
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AddNewReelModal;
