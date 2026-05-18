import { supabase } from "@/shared/services/supabaseClient";
import { Button } from "../../../shared/components/ui/shadcn/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "../../../shared/components/ui/shadcn/ui/field";
import { Input } from "../../../shared/components/ui/shadcn/ui/input";
import { useState } from "react";
import { MoonLoader } from "react-spinners";

interface NewReelFormProps {
  uploadVideo: (data: any) => void;
  setLocalVideoPreview: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setLocalThumbnailPreview: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemove: () => void;
}

export function NewReelForm({
  uploadVideo,
  setLocalVideoPreview,
  setLocalThumbnailPreview,
  handleRemove,
}: NewReelFormProps) {
  const [isUploading, setIsUploading] = useState(false);

  const addToBuckets = async (thumbnail: File, video: File) => {
    const videoPath = `${Date.now()}-${video.name}`;
    const thumbPath = `${Date.now()}-${thumbnail.name}`;

    const { error: upVid } = await supabase.storage
      .from("videos")
      .upload(videoPath, video, {
        cacheControl: "3600",
        upsert: false,
      });

    if (upVid) throw upVid;

    const { error: upThumb } = await supabase.storage
      .from("thumbnails")
      .upload(thumbPath, thumbnail, {
        cacheControl: "3600",
        upsert: false,
      });

    if (upThumb) throw upThumb;

    const {
      data: { publicUrl: videoUrl },
    } = supabase.storage.from("videos").getPublicUrl(videoPath);

    const {
      data: { publicUrl: thumbnailUrl },
    } = supabase.storage.from("thumbnails").getPublicUrl(thumbPath);

    return { videoUrl, thumbnailUrl };
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const data = new FormData(e.currentTarget);

      const video = data.get("video");
      const thumbnail = data.get("thumbnail");

      if (!(video instanceof File) || !(thumbnail instanceof File)) {
        throw new Error("Missing or invalid files");
      }

      const { videoUrl, thumbnailUrl } = await addToBuckets(thumbnail, video);

      const result = {
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        caption: data.get("caption") || "",
        category: data.get("category") || "",
        order_index: Number(data.get("order_index")),
        is_active: data.get("is_active") === "yes",
      };

      await uploadVideo(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel>Agregar Video</FieldLabel>
          <Input
            type="file"
            accept="video/*"
            name="video"
            required
            onChange={setLocalVideoPreview}
            
          />
        </Field>

        <Field>
          <FieldLabel>Agregar Miniatura</FieldLabel>
          <Input
            type="file"
            accept="image/*"
            name="thumbnail"
            required
            onChange={setLocalThumbnailPreview}
            
          />
        </Field>

        <Field>
          <FieldLabel>Leyenda</FieldLabel>
          <Input name="caption" placeholder="Que buen gol" />
        </Field>

        <Field>
          <FieldLabel>Categoria</FieldLabel>
          <Input name="category" placeholder="Femenil o Masculino" />
        </Field>

        <Field>
          <FieldLabel>Índice de orden</FieldLabel>
          <Input name="order_index" type="number" defaultValue={0} required />
        </Field>

        <Field>
          <FieldLabel>Mostrar en feed</FieldLabel>
          <select
            name="is_active"
            defaultValue={"yes"}
            className="h-8 w-full rounded-lg border border-slate-300 px-2 text-sm"
          >
            <option value="yes">Si</option>
            <option value="no">No</option>
          </select>
        </Field>

        <Field orientation="horizontal">
          {!isUploading ? (
            <div className="flex flex-row items-center gap-x-2">
              <Button type="reset" variant="outline" onClick={handleRemove}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-brand-navy">
                Subir
              </Button>
            </div>
          ) : (
            <div className="flex flex-row items-center gap-x-2">
              <Button variant="outline" type="button" className="cursor-not-allowed">
                Cancelar
              </Button>
              <Button type="button" className="bg-brand-navy">
                <MoonLoader size={15} color="white" />
              </Button>
            </div>
          )}
        </Field>
      </FieldGroup>
    </form>
  );
}