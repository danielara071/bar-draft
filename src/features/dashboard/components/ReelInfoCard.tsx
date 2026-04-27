import { useState } from "react";
import ViewReelCard from "./ViewReelCard";
import { InputFieldgroup } from "./InputFieldGroup";
import { X } from "lucide-react";
import { supabase } from "@/shared/services/supabaseClient";

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

  const handleSubmit = async (data: any) => {
    console.log(data);
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
      console.log("asdfasdf");
      updated();
    }
    setMessage(true);
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
        className="bg-brand-white z-50 rounded-2xl p-8 min-h-8/12 min-w-8/12 relative"
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
          <div>
            <ViewReelCard
              muted={isMuted}
              changeMute={() => setIsMuted((prev) => !prev)}
              video_url={video_url}
            />
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
      </div>
    </div>
  );
};

export default ReelInfoCard;
