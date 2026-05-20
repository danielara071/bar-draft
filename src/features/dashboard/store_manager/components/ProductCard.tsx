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
  description = "Camiseta oficial del FC Barcelona temporada 2025/26",
  image_url,
  price,
  stock = 150,
  category = "Camisetas",
  premium,
  onEdit,
  onDelete,
}: ProductCardProps) => {
  return (
    <div className="w-full rounded-[2rem] border-2 border-slate-900 bg-[#f5f5f5] p-6 md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-6 md:flex-row md:items-center flex-1">
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

            <p className="mt-3 text-lg text-slate-500">{description}</p>

            <div className="mt-6 flex flex-wrap gap-8">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Precio
                </p>
                <p className="mt-1 text-2xl font-bold text-[#e0b100]">
                  €{price.toFixed(2)}
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

              {premium && (
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Tipo
                  </p>
                  <p className="mt-1 text-2xl font-bold text-amber-500">
                    Premium
                  </p>
                </div>
              )}
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 3.487a2.25 2.25 0 113.182 3.182L8.25 18.462 4 19.5l1.038-4.25L16.862 3.487z"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-crimson text-white transition hover:scale-105 hover:bg-red-600"
            aria-label="Eliminar producto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 7h12M9 7V5.75A1.75 1.75 0 0110.75 4h2.5A1.75 1.75 0 0115 5.75V7m-7 0l.63 10.07A2 2 0 0010.62 19h2.76a2 2 0 001.99-1.93L16 7m-6 4v5m4-5v5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
