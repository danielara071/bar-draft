import { useState, useEffect } from "react";
import ProductoCard from "./ProductoCard";
import PremiumWindow from "./PremiumWindow";
import { supabase } from "../../../shared/services/supabaseClient";
import StripeModal from "./StripeModal";
import AlertModal from "./AlertModal";
import AskPopUp from "../../../features/gestorAmigos/AskPopUp";
import  {useUserInfo} from "./hooks/useUserInfo";

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
  const session = useUserInfo();
  const [productos, setProductos] = useState<ReturnType<typeof mapProducto>[]>([]); // El tipo de productos se infiere a partir de la función mapProducto
  const [error, setError] = useState<string | null>(null);
  const [esPremium, setEsPremium] = useState(false);
  const [mostrarPremium, setMostrarPremium] = useState(false);
  const [monedas, setMonedas] = useState<number>(0);
  const [showStripe, setShowStripe] = useState(false);
  const [modal, setModal] = useState<{ title: string; message: React.ReactNode } | null>(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<ReturnType<typeof mapProducto> | null>(null);
  

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

  const handleComprar = (producto: ReturnType<typeof mapProducto>) => {
    setProductoSeleccionado(producto);
    setMostrarConfirmacion(true);
  };

  const confirmarCompra = async () => {
    if (!productoSeleccionado) return;
    
    const producto = productoSeleccionado;

    if (!session?.user?.id) {
      setModal({ title: "Aviso", message: "Debes iniciar sesión para comprar." });
      setMostrarConfirmacion(false);
      return;
    }

    if (monedas < producto.precio) {
      setModal({ title: "Aviso", message: `No tienes monedas suficientes. Tienes ${(monedas).toLocaleString('en-US')} monedas y el producto cuesta ${(producto.precio).toLocaleString('en-US')}.` });
      setMostrarConfirmacion(false);
      return;
    }

    // Descuenta las monedas
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ monedas: monedas - producto.precio })
      .eq("id", session.user.id);

    if (updateError) {
      setModal({ title: "Error", message: "Hubo un error al procesar tu compra. Por favor, intenta de nuevo." });
      setMostrarConfirmacion(false);
      return;
    }

    // Registra la compra
    await supabase.from("purchases").insert({
      user_id: session.user.id,
      product_id: producto.id,
      amount: producto.precio,
    });

    setProductos((prev) => prev.filter((p) => p.id !== producto.id));
    setMonedas((prev) => prev - producto.precio); // Actualiza el estado local
    setModal({
      title: "¡Compra exitosa!",
      message: <>Te quedan <span className="font-bold text-[#A50044]">{(monedas - producto.precio).toLocaleString('en-US')} monedas</span>.</>,
    });
    setMostrarConfirmacion(false);
    setProductoSeleccionado(null);
    
    // Notifica al Navbar que debe actualizar el perfil
    window.dispatchEvent(new Event("profileUpdated"));
  };

  useEffect(() => {
    let cancelled = false;
    const fetchProductos = async () => {
      if (session === undefined) return;
      let purchaseiD: number[] = [];

      if (session?.user?.id){
        const { data: purchases } = await supabase
          .from("purchases")
          .select("product_id")
          .eq("user_id", session.user.id);
        purchaseiD = (purchases ?? []).map((p) => Number(p.product_id));
      }

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

      const filtered = (data ?? [])
        .map((row) => mapProducto(row as Record<string, unknown>))
        .filter((p) => !purchaseiD.includes(p.id));

      setError(null);
      setProductos(filtered);

    };

    void fetchProductos();
    return () => {
      cancelled = true;
    };
  }, [session]);

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

      {modal && (
        <AlertModal
          title={modal.title}
          message={modal.message}
          onClose={() => setModal(null)}
        />
      )}

      {mostrarConfirmacion && productoSeleccionado && (
        <AskPopUp
          pregunta="¿Deseas comprar este producto?"
          texto={`${productoSeleccionado.nombre} cuesta ${(productoSeleccionado.precio).toLocaleString('en-US')} monedas.`}
          textConf="Cancelar"
          textDeny="Comprar"
          onConfirm={() => {
            setMostrarConfirmacion(false);
            setProductoSeleccionado(null);
          }}
          onDeny={() => confirmarCompra()}
        />
      )}
    </div>
  );
};

export default Productos;