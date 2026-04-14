import { useState, useEffect } from "react";
import ProductoCard from "./ProductoCard";
import PremiumWindow from "./PremiumWindow";
import { supabase } from "../../../shared/services/supabaseClient";
import useSession from "../../../shared/hooks/useSession";
import StripeModal from "./StripeModal";

function mapProducto(row: Record<string, unknown>) { // Mapea los datos de la fila a la estructura esperada por ProductoCard
  const categories = row.categories as { name?: string } | null | undefined;
  return {
    id: Number(row.id),
    nombre: String(row.name ?? "Producto"),
    precio: Number(row.price ?? 0),
    imagen: String(row.image_url ?? ""),
    premium: Boolean(row.premium ?? false),
    categoria: {nombre: categories?.name ?? "Objeto"}
  };
}

const Productos = () => {
  const session = useSession();
  const [productos, setProductos] = useState<ReturnType<typeof mapProducto>[]>([]); // El tipo de productos se infiere a partir de la función mapProducto
  const [error, setError] = useState<string | null>(null);
  const [esPremium, setEsPremium] = useState(false);
  const [mostrarPremium, setMostrarPremium] = useState(false);
  const [monedas, setMonedas] = useState<number>(0);
  const [showStripe, setShowStripe] = useState(false);
  

  useEffect(() => {
    const run = async () => {
      if (!session?.user?.id) {
        setEsPremium(false);
        setMonedas(0);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("membership, monedas")
        .eq("id", session.user.id)
        .single();

      setEsPremium(Boolean(data?.membership));
      setMonedas(Number(data?.monedas ?? 0));
    };

    void run();
  }, [session]);

  const handleComprar = async (producto: ReturnType<typeof mapProducto>) => {
    if (!session?.user?.id) {
      alert("Debes iniciar sesión para comprar.");
      return;
    }

    if (monedas < producto.precio) {
      alert(`No tienes monedas suficientes. Tienes ${monedas} monedas y el producto cuesta ${producto.precio}.`);
      return;
    }

    // Descuenta las monedas
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ monedas: monedas - producto.precio })
      .eq("id", session.user.id);

    if (updateError) {
      alert("Error al procesar la compra.");
      return;
    }

    // Registra la compra
    await supabase.from("purchases").insert({
      user_id: session.user.id,
      product_id: producto.id,
      amount: producto.precio,
    });

    setMonedas((prev) => prev - producto.precio); // Actualiza el estado local
    alert(`¡Compra exitosa! Te quedan ${monedas - producto.precio} monedas.`);
  };

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
        return;
      }

      setError(null);
      setProductos((data ?? []).map((row) => mapProducto(row as Record<string, unknown>)));

    };

    void fetchProductos();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div className="h-25 bg-[#001E44] w-full mb-8" />
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10 px-20 pb-20">
        {productos.map((producto) => (
          <ProductoCard
            key={producto.id}
            producto={producto}
            esPremium={esPremium}
            onPremiumClick={() => setMostrarPremium(true)}
            monedas={monedas}
            onComprar={() => handleComprar(producto)} 
          />
        ))}
      </div>

        {mostrarPremium && (
        <PremiumWindow
          onClose={() => setMostrarPremium(false)}
          onSubscribe={() => {
            setMostrarPremium(false);
            setShowStripe(true); // abre el formulario de Stripe
          }}
        />
      )}

      {showStripe && (
        <StripeModal
          onClose={() => setShowStripe(false)}
          onPremiumActivated={() => setEsPremium(true)}
        />
      )}
    </div>
  );
};

export default Productos;