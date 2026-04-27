import { Button } from "../../../shared/components/ui/shadcn/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "../../../shared/components/ui/shadcn/ui/field";
import { Input } from "../../../shared/components/ui/shadcn/ui/input";

interface InputFieldGroupProps {
  id: string;  
  caption?: string;
  category?: string;
  order_index?: number;
  is_active?: boolean;
  updateVideo: (data: any) => void;
}

export function InputFieldgroup({  
  id,
  caption,
  category,
  order_index,
  is_active,
  updateVideo
}: InputFieldGroupProps) {

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    const result = {
      id: id,  
      caption: data.get("caption"),
      category: data.get("category"),
      order_index: Number(data.get("order_index")),
      is_active: data.get("is_active") === "yes",
    };

    updateVideo(result);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel>Leyenda</FieldLabel>
          <Input name="caption" defaultValue={caption} />
        </Field>

        <Field>
          <FieldLabel>Categoria</FieldLabel>
          <Input name="category" defaultValue={category} />
        </Field>

        <Field>
          <FieldLabel>Índice de orden</FieldLabel>
          <Input
            name="order_index"
            type="number"
            defaultValue={String(order_index)}
          />
        </Field>

        <Field>
          <FieldLabel>Mostrar en feed</FieldLabel>
          <select
            name="is_active"
            defaultValue={is_active ? "yes" : "no"}
            className="h-8 w-full rounded-lg border"
          >
            <option value="yes">Si</option>
            <option value="no">No</option>
          </select>
        </Field>

        <Field orientation="horizontal">
          <Button type="reset" variant="outline">
            Reset
          </Button>
          <Button type="submit" className="bg-brand-navy">Submit</Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
