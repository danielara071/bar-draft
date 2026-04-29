import { supabase } from "@/shared/services/supabaseClient";
import { Button } from "../../../shared/components/ui/shadcn/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "../../../shared/components/ui/shadcn/ui/field";
import { Input } from "../../../shared/components/ui/shadcn/ui/input";

interface NewReelFormProps {
  uploadVideo: (data: any) => void;
}

export function NewReelForm({ uploadVideo }: NewReelFormProps) {
  const addToBuckets = async (thumbnail: File, video: File) => {
    const videoPath = `${video.name}`;
    const thumbPath = `${thumbnail.name}`;
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
    const data = new FormData(e.currentTarget);

    const video = data.get("video");
    const thumbnail = data.get("thumbnail");

    if (!(video instanceof File) || !(thumbnail instanceof File)) {
      console.error("Missing or invalid files");
      return;
    }

    const {videoUrl, thumbnailUrl} = await addToBuckets(thumbnail, video);

    const result = {
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl,
      caption: data.get("caption"),
      category: data.get("category"),
      order_index: Number(data.get("order_index")),
      is_active: data.get("is_active") === "yes",
    };


    uploadVideo(result);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel>Agregar Video</FieldLabel>

          <Input type="file" accept="video/*" name="video" />
        </Field>
        <Field>
          <FieldLabel>Agregar Miniatura</FieldLabel>

          <Input type="file" accept="image/*" name="thumbnail" />
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
          <Input name="order_index" type="number" defaultValue={0} />
        </Field>

        <Field>
          <FieldLabel>Mostrar en feed</FieldLabel>
          <select
            name="is_active"
            defaultValue={"yes"}
            className="h-8 w-full rounded-lg border"
          >
            <option value="yes">Si</option>
            <option value="no">No</option>
          </select>
        </Field>

        <Field orientation="horizontal">
          <Button type="reset" variant="outline">
            Cancelar
          </Button>
          <Button type="submit" className="bg-brand-navy">
            Subir
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
