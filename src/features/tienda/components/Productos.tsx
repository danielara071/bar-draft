import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import ProductoCard from "./ProductoCard";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL2 ?? import.meta.env.VITE_SUPABASE_URL ?? "";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY2 ??
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  "";

const supabase = createClient(supabaseUrl, supabaseKey);

function mapProducto(row: Record<string, unknown>) { // Mapea los datos de la fila a la estructura esperada por ProductoCard
  const categories = row.categories as { name?: string } | null | undefined;
  return {
    id: Number(row.id),
    nombre: String(row.name ?? "Producto"),
    precio: Number(row.price ?? 0),
    imagen: String(row.image_url ?? ""),
    premium_only: Boolean(row.premium_only ?? false),
    categoria: {
      nombre: categories?.name ?? String(row.categoria_nombre ?? "Objeto"),
    },
  };
}

const Productos = () => {
  const [productos, setProductos] = useState<ReturnType<typeof mapProducto>[]>([]); // El tipo de productos se infiere a partir de la función mapProducto
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProductos = async () => {
      const { data, error: supaError } = await supabase
        .from("products")
        .select("*, categories(name)")
        .order("id");

      if (cancelled) return;

      if (supaError) {
        console.error("Supabase products:", supaError);
        setError(supaError.message || "No se pudieron cargar los productos");
        setProductos([]);
      } else {
        setProductos((data ?? []).map((row) => mapProducto(row as Record<string, unknown>)));
      }
    };

    void fetchProductos();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold mt-4 px-20">Tienda FC Barcelona</h1>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 mx-auto max-w-7xl mt-6">
        <p className="text-[#555555] text-[1.15rem] leading-relaxed font-normal tracking-tight">
          Canjea tus monedas por insignias digitales exclusivas para personalizar tu perfil de culé, o
          participa en rifas increíbles para ganar viajes a Barcelona, tours por el Camp Nou, boletos VIP
          o incluso la oportunidad de aparecer en el estadio durante un partido.
        </p>
        <p className="text-[#555555] text-[1.15rem] leading-relaxed font-normal tracking-tight mt-4">
          ¡Demuestra tu pasión blaugrana y vive experiencias únicas! Més que un club.
        </p>
      </div>

      {error && (
        <p className="text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6 px-20 pb-12">
        {productos.map((producto) => (
          <ProductoCard key={producto.id} producto={producto} /> // Renderiza cada producto usando ProductoCard
        ))}
      </div>
    </div>
  );
};

export default Productos;