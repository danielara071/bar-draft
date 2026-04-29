import { useState } from "react";
import ViewReelCard from "./ViewReelCard";
import { InputFieldgroup } from "./InputFieldGroup";
import { X } from "lucide-react";
import { supabase } from "@/shared/services/supabaseClient";
import { Button } from "@/shared/components/ui/shadcn/ui/button";

interface ReelInfoCardProps {
  id: string;
  video_url: string;
  thumbnail_url: string;
  caption: string;
  duration: number;
  category: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  toggleCard: () => void;
  updated: () => void;
}

const ReelInfoCard = ({
  id,
  video_url,
  thumbnail_url,
  caption,
  duration,
  category,
  order_index,
  is_active,
  created_at,
  toggleCard,
  updated,
}: ReelInfoCardProps) => {
  const [isMuted, setIsMuted] = useState(true);
  const [message, setMessage] = useState<boolean | null>(null);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleSubmit = async (data: any) => {
    const { error } = await supabase
      .from("videos")
      .update({
        caption: data.caption,
        category: data.category,
        order_index: data.order_index,
        is_active: data.is_active,
      })
      .eq("id", data.id);

    if (error) {
      console.log(error);
      setIsSuccessful(false);
      return;
    } else {
      setIsSuccessful(true);
      updated();
    }
    setMessage(true);
  };

  const handleDelete = async (
    videoId: string,
    video_url: string,
    thumbnail_url: string,
  ) => {
    const getPath = (url: string) => {
      if (!url) return null;

      const parts = url.split("/object/public/");
      if (parts.length < 2) return null;

      const pathWithBucket = parts[1];
      const segments = pathWithBucket.split("/");

      segments.shift();
      return decodeURIComponent(segments.join("/"));
    };

    const videoPath = getPath(video_url);
    const thumbnailPath = getPath(thumbnail_url);


    const { error: errorTable } = await supabase
      .from("videos")
      .delete()
      .eq("id", videoId);

    if (errorTable) {
      console.error("Error deleting video row:", errorTable);
      return;
    }

    if (videoPath) {
      const { error } = await supabase.storage
        .from("videos")
        .remove([videoPath]);

      if (error) console.error("Error deleting video file:", error);
    }

    if (thumbnailPath) {
      const { error } = await supabase.storage
        .from("thumbnails")
        .remove([thumbnailPath]);

      if (error) console.error("Error deleting thumbnail:", error);
    }

    setIsDeleteModalOpen(false);
    updated();
    toggleCard();
  };

  return (
    <div
      className=" fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-40 cursor-default"
      onClick={() => {
        toggleCard();
        setMessage(false);
      }}
    >
      <div
        className="bg-brand-white z-50 rounded-2xl p-8 min-h-7/12 min-w-7/12 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            toggleCard();
            setMessage(false);
          }}
          className="absolute right-5 top-5 cursor-pointer border  hover:border-black/20 border-slate-50  transition rounded-4xl"
        >
          <X color="gray" />
        </button>
        <div className="flex flex-row gap-x-10">
          <div className="flex flex-col items-center">
            <ViewReelCard
              muted={isMuted}
              changeMute={() => setIsMuted((prev) => !prev)}
              video_url={video_url}
            />
            <div className="flex flex-row gap-x-2 mt-4">
              <p className="font-semibold text-gray-500 text-sm">
                Fecha de creación:
              </p>
              <p className="text-gray-500 text-sm">{created_at.slice(0, 10)}</p>
            </div>
            <Button
              type="submit"
              className="bg-brand-crimson mt-2"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Eliminar
            </Button>
          </div>
          <div className="w-56">
            <InputFieldgroup
              id={id}
              caption={caption}
              category={category}
              order_index={order_index}
              is_active={is_active}
              updateVideo={handleSubmit}
            />
          </div>
        </div>
        {message &&
          (isSuccessful ? (
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bottom-2 border rounded-md border-green-200 bg-green-50 w-64 flex items-center justify-center p-2 h-12 ">
              <p className="font-semibold tracking-tight text-sm text-green-600">
                Actualización exitosa
              </p>
            </div>
          ) : (
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bottom-2 border rounded-md border-red-200 bg-red-50 w-64 flex items-center justify-center p-2 h-12 ">
              <p className="font-semibold tracking-tight text-sm text-red-900">
                Error al actualizar los datos
              </p>
            </div>
          ))}
        {isDeleteModalOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-40 cursor-default">
            <div
              className="bg-brand-white z-50 rounded-2xl p-8 min-h-2/12 min-w-4/12 flex items-center justify-center flex-col gap-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-semibold">
                ¿Estas seguro que quieres eliminar este reel?
              </h2>
              <div className="flex flex-row gap-x-10">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="bg-brand-navy"
                  onClick={() => handleDelete(id, video_url, thumbnail_url)}
                >
                  Confirmar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReelInfoCard;
