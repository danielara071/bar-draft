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
    <article className="w-full rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-1 items-center gap-4">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d2b4d] via-[#a50044] to-[#EDBB00]/70">
            <img
              src={image_url}
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold text-[#0d2b4d] md:text-lg">
              {name}
            </h3>

            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Precio
                </p>
                <p className="mt-1 text-sm font-bold tabular-nums text-[#0d2b4d] md:text-base">
                  ${price.toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Categoría
                </p>
                <p className="mt-1 text-sm font-bold text-[#0d2b4d] md:text-base">
                  {category}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Tipo
                </p>

                <span
                  className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    premium
                      ? "bg-[#EDBB00]/15 text-[#8a6200]"
                      : "bg-[#0d2b4d]/8 text-[#0d2b4d]"
                  }`}
                >
                  {premium ? "Premium" : "Estándar"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:pl-4">
          <button
            data-cy="edit-product-panel"
            type="button"
            onClick={onEdit}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0d2b4d] text-white transition hover:scale-105 hover:bg-[#091f38]"
            aria-label="Editar producto"
          >
            <Pencil className="h-4 w-4" strokeWidth={2.2} />
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#a50044]/10 text-[#a50044] transition hover:scale-105 hover:bg-[#a50044] hover:text-white"
            aria-label="Eliminar producto"
          >
            <Trash2 className="h-4 w-4" strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;