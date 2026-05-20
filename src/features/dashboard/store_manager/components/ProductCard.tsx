import { Pencil, Trash2 } from "lucide-react";

type ProductCardProps = {
  name: string;
  description?: string;
  image_url: string;
  price: number;
  stock?: number;
  category?: string;
  premium?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

const ProductCard = ({
  name,
  image_url,
  price,
  category,
  premium,
  onEdit,
  onDelete,
}: ProductCardProps) => {
  return (
    <div className="w-full rounded-[2rem] border-2 border-slate-900 bg-[#f5f5f5] p-6 md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-6 md:flex-row md:items-center">
          <div className="h-44 w-44 shrink-0 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0d224d] via-[#5a245d] to-[#c10f5a]">
            <img
              src={image_url}
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h3 className="text-3xl font-bold tracking-tight text-[#0d2b4d]">
              {name}
            </h3>

            <div className="mt-6 flex flex-wrap gap-8">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Precio
                </p>
                <p className="mt-1 text-2xl font-bold text-[#e0b100]">
                  {price.toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Categoría
                </p>
                <p className="mt-1 text-2xl font-bold text-[#0d2b4d]">
                  {category}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Tipo
                </p>
                {premium ? (
                  <p className="mt-1 text-2xl font-bold text-amber-500">
                    Premium
                  </p>
                ) : (
                  <p className="mt-1 text-2xl font-bold text-brand-navy">
                    Estándar
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 lg:pl-6">
          <button
            type="button"
            onClick={onEdit}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[#032b5c] text-white transition hover:scale-105 hover:bg-[#021f43]"
            aria-label="Editar producto"
          >
            <Pencil className="h-7 w-7" strokeWidth={2} />
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-crimson text-white transition hover:scale-105 hover:bg-red-600"
            aria-label="Eliminar producto"
          >
            <Trash2 className="h-7 w-7" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
