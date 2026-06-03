
import { useState, useEffect } from "react";
import { supabase } from "../../../shared/services/supabaseClient";
import RifaCard, { type RifaTienda } from "./RifaCard";
import AlertModal from "./AlertModal";
import AskPopUp from "../../../features/gestorAmigos/AskPopUp";
import { useUserInfo } from "./hooks/useUserInfo";
import RifasResultados from "./RifaResultados";

const Rifas = () => {
  const session = useUserInfo();
  const [rifas, setRifas] = useState<RifaTienda[]>([]);
  const [esPremium, setEsPremium] = useState(false);
  const [monedas, setMonedas] = useState(0);
  const [participando, setParticipando] = useState<Set<number>>(new Set());
  const [modal, setModal] = useState<{
    title: string;
    message: React.ReactNode;
  } | null>(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [rifaSeleccionada, setRifaSeleccionada] = useState<RifaTienda | null>(null);
  const [mostrarPremium, setMostrarPremium] = useState(false);

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

  useEffect(() => {
    let cancelled = false;

    const fetchRifas = async () => {
      if (session === undefined) return;









      const { data, error } = await supabase
        .from("rifas")
        .select("*, rifa_boletos(count)")
        .eq("estado", "activa")
        .order("created_at", { ascending: false });

      if (cancelled || error || !data) return;

      let boletosPorRifa: Record<number, number> = {};

      if (session?.user?.id) {
        const { data: boletos } = await supabase
          .from("rifa_boletos")
          .select("rifa_id")
          .eq("user_id", session.user.id);

        if (!cancelled && boletos) {
          setParticipando(new Set(boletos.map((b) => b.rifa_id)));

          boletosPorRifa = boletos.reduce(
            (acc, b) => {
              acc[b.rifa_id] = (acc[b.rifa_id] ?? 0) + 1;
              return acc;
            },
            {} as Record<number, number>,
          );
        }
      }

      const mapped: RifaTienda[] = data.map((r) => ({
        id: r.id,
        name: r.name,
        type: r.type,
        total_boletos: r.total_boletos,
        costo_monedas: r.costo_monedas,
        premium: r.premium,
        image_url: r.image_url,
        estado: r.estado,
        fecha_cierre: r.fecha_cierre,
        ganador_id: r.ganador_id,
        boletos_vendidos: r.rifa_boletos?.[0]?.count ?? 0,
        mis_boletos: boletosPorRifa[r.id] ?? 0,
        gano: session?.user?.id ? r.ganador_id === session.user.id : false,
      }));

      setRifas(mapped);
    };

    void fetchRifas();





    return () => {
      cancelled = true;


    };



  }, [session]);

  const handleParticipar = (rifa: RifaTienda) => {
    setRifaSeleccionada(rifa);
    setMostrarConfirmacion(true);
  };

  const confirmarParticipacion = async () => {
    if (!rifaSeleccionada) return;
    const rifa = rifaSeleccionada;

    if (!session?.user?.id) {
      setModal({
        title: "Aviso",
        message: "Debes iniciar sesión para participar.",
      });
      setMostrarConfirmacion(false);
      return;
    }

    if (monedas < rifa.costo_monedas) {
      setModal({
        title: "Aviso",
        message: `No tienes monedas suficientes. Tienes ${monedas.toLocaleString("en-US")} monedas y el boleto cuesta ${rifa.costo_monedas.toLocaleString("en-US")}.`,
      });
      setMostrarConfirmacion(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ monedas: monedas - rifa.costo_monedas })
      .eq("id", session.user.id);

    if (updateError) {
      setModal({
        title: "Error",
        message: "Hubo un error al procesar tu compra. Intenta de nuevo.",
      });
      setMostrarConfirmacion(false);
      return;
    }

    await supabase.from("rifa_boletos").insert({
      rifa_id: rifa.id,
      user_id: session.user.id,
    });

    const nuevasMonedas = monedas - rifa.costo_monedas;
    setMonedas(nuevasMonedas);
    setParticipando((prev) => new Set(prev).add(rifa.id));

    setRifas((prev) =>
      prev.map((item) =>
        item.id === rifa.id
          ? {
              ...item,
              boletos_vendidos: item.boletos_vendidos + 1,
              mis_boletos: 1,
            }
          : item,
      ),
    );

    setModal({
      title: "¡Boleto comprado!",
      message: (
        <>
          Ya estás participando en{" "}
          <span className="font-bold">{rifa.name}</span>. Te quedan{" "}
          <span className="font-bold text-[#A50044]">
            {nuevasMonedas.toLocaleString("en-US")} monedas
          </span>
          .
        </>
      ),
    });

    setMostrarConfirmacion(false);
    setRifaSeleccionada(null);
    window.dispatchEvent(new Event("profileUpdated"));
  };

  if (rifas.length === 0) return null;

  return (
    <div className="px-20 pb-10">
      <h2 className="text-3xl font-bold mb-2">Rifas</h2>
      <p className="text-gray-500 mb-6">
        Participa en rifas.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {rifas.map((rifa) => (
          <RifaCard
            key={rifa.id}
            rifa={rifa}
            esPremium={esPremium}
            monedas={monedas}
            yaParticipa={participando.has(rifa.id)}
            onPremiumClick={() => setMostrarPremium(true)}
            onParticipar={() => handleParticipar(rifa)}
          />
        ))}
      </div>

      <div>
        <RifasResultados />
      </div>

      {mostrarPremium && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-2xl">
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              Contenido Premium
            </h2>
            <p className="mb-6 text-gray-600">
              Esta rifa es exclusiva para miembros Premium.
            </p>
            <button
              type="button"
              className="w-full py-3 rounded-xl bg-[#A50044] text-white font-bold hover:bg-[#8a003a] transition"
              onClick={() => setMostrarPremium(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {modal && (
        <AlertModal
          title={modal.title}
          message={modal.message}
          onClose={() => setModal(null)}
        />
      )}

      {mostrarConfirmacion && rifaSeleccionada && (
        <AskPopUp
          pregunta="¿Deseas comprar un boleto?"
          texto={`${rifaSeleccionada.name} cuesta ${rifaSeleccionada.costo_monedas.toLocaleString("en-US")} monedas.`}
          textConf="Cancelar"
          textDeny="Comprar boleto"
          onConfirm={() => {
            setMostrarConfirmacion(false);
            setRifaSeleccionada(null);
          }}
          onDeny={() => confirmarParticipacion()}
        />
      )}
    </div>
  );
};

export default Rifas;