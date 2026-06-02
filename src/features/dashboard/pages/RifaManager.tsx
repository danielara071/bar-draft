import { useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { supabase } from "@/shared/services/supabaseClient";
import useRifas from "../rifa_manager/hooks/useRifas";
import RifaCard from "../rifa_manager/components/RifaCard";
import AddRifaModal from "../rifa_manager/components/AddRifaModal";
import GanadorModal from "../rifa_manager/components/GanadorModal";
import type { Rifa, RifaGanador } from "../rifa_manager/interfaces/rifa";

const RifaManager = () => {
  const { rifas, loading, fetchRifas } = useRifas();
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [ganador, setGanador] = useState<RifaGanador | null>(null);
  const [rifando, setRifando] = useState<number | null>(null);
  const [rifaAEliminar, setRifaAEliminar] = useState<Rifa | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const filtered = rifas.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const rifasActivas     = filtered.filter((r) => r.estado === "activa");
  const rifasPendientes  = filtered.filter((r) => r.estado === "terminada" && !r.ganador_id);
  const rifasCompletadas = filtered.filter((r) => r.estado === "terminada" && !!r.ganador_id);

  const handleTerminar = async (rifa: Rifa) => {
    const { error } = await supabase
      .from("rifas")
      .update({ estado: "terminada" })
      .eq("id", rifa.id);

    if (!error) await fetchRifas();
  };

  const handleRifar = async (rifa: Rifa) => {
    setRifando(rifa.id);

    const { data: boletos, error } = await supabase
      .from("rifa_boletos")
      .select("user_id, profiles(id, nombre, email)")
      .eq("rifa_id", rifa.id);

    setRifando(null);

    if (error || !boletos || boletos.length === 0) {
      alert("No hay participantes en esta rifa.");
      return;
    }

    const random = boletos[Math.floor(Math.random() * boletos.length)];
    const profile = Array.isArray(random.profiles)
      ? random.profiles[0]
      : random.profiles;

    // Marca como terminada y guarda el ganador en un solo update
    await supabase
      .from("rifas")
      .update({ estado: "terminada", ganador_id: random.user_id })
      .eq("id", rifa.id);

    await fetchRifas();

    setGanador({
      rifa,
      ganador: {
        id: random.user_id,
        nombre: profile?.nombre ?? null,
        email: profile?.email ?? null,
      },
    });
  };

  const handleEliminar = async () => {
    if (!rifaAEliminar) return;
    setEliminando(true);

    const { error } = await supabase
      .from("rifas")
      .delete()
      .eq("id", rifaAEliminar.id);

    setEliminando(false);
    setRifaAEliminar(null);

    if (!error) await fetchRifas();
  };

  return (
    <div className="flex flex-col py-10 px-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-2xl md:text-3xl lg:text-4xl font-sans font-bold">
          <span className="text-brand-navy">Gestión de </span>
          <span className="text-brand-yellow">Rifas</span>
        </p>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#EDBB00] px-5 py-2.5 text-sm font-bold text-[#0d2b4d] transition hover:bg-[#d4a800] active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Añadir Rifa
        </button>
      </div>

      {/* Search */}
      <div className="mb-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <Search className="h-4 w-4 shrink-0 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar Rifa..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Rifa list — scrollable container con secciones */}
      <div className="max-h-[65vh] overflow-y-auto rounded-[28px] border border-slate-200 bg-[#f4f6f9] p-4 flex flex-col gap-6 pr-2">
        {loading && (
          <p className="text-center text-sm text-slate-400 py-8">Cargando rifas...</p>
        )}

        {!loading && filtered.length === 0 && (
          <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-600">No se encontraron rifas</p>
            <p className="mt-1 text-sm text-slate-400">
              Intenta con otro término o añade una nueva rifa.
            </p>
          </div>
        )}

        {/* Sección: Activas */}
        {rifasActivas.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Activas
              </span>
              <span className="rounded-full bg-[#a50044] px-2 py-0.5 text-[10px] font-bold text-white">
                {rifasActivas.length}
              </span>
            </div>
            {rifasActivas.map((rifa) => (
              <RifaCard
                key={rifa.id}
                rifa={rifa}
                onTerminar={() => handleTerminar(rifa)}
                onRifar={() => { if (rifando === null) handleRifar(rifa); }}
                onEliminar={() => setRifaAEliminar(rifa)}
              />
            ))}
          </div>
        )}

        {/* Sección: Terminadas sin ganador */}
        {rifasPendientes.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Pendientes de sorteo
              </span>
              <span className="rounded-full bg-[#0d2b4d] px-2 py-0.5 text-[10px] font-bold text-white">
                {rifasPendientes.length}
              </span>
            </div>
            {rifasPendientes.map((rifa) => (
              <RifaCard
                key={rifa.id}
                rifa={rifa}
                onTerminar={() => handleTerminar(rifa)}
                onRifar={() => { if (rifando === null) handleRifar(rifa); }}
                onEliminar={() => setRifaAEliminar(rifa)}
              />
            ))}
          </div>
        )}

        {/* Sección: Ya rifadas */}
        {rifasCompletadas.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Completadas
              </span>
              <span className="rounded-full bg-[#EDBB00] px-2 py-0.5 text-[10px] font-bold">
                {rifasCompletadas.length}
              </span>
            </div>
            {rifasCompletadas.map((rifa) => (
              <RifaCard
                key={rifa.id}
                rifa={rifa}
                onTerminar={() => handleTerminar(rifa)}
                onRifar={() => { if (rifando === null) handleRifar(rifa); }}
                onEliminar={() => setRifaAEliminar(rifa)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Gestión de Ganadores — placeholder */}
      <div className="mt-12">
        <p className="text-2xl md:text-3xl lg:text-4xl font-sans font-bold">
          <span className="text-brand-navy">Gestión de </span>
          <span className="text-brand-yellow">Ganadores</span>
        </p>
      </div>

      {/* Modal añadir */}
      {showAddModal && (
        <AddRifaModal
          onClose={() => setShowAddModal(false)}
          onCreated={fetchRifas}
        />
      )}

      {/* Modal ganador */}
      {ganador && (
        <GanadorModal
          data={ganador}
          onClose={() => setGanador(null)}
        />
      )}

      {/* Confirmación eliminar */}
      {rifaAEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d2b4d]/45 backdrop-blur-sm">
          <div className="flex w-full max-w-sm flex-col items-center gap-5 rounded-[28px] bg-white p-8 shadow-2xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#a50044]/10">
              <Trash2 className="h-7 w-7 text-[#a50044]" strokeWidth={1.8} />
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold text-[#0d2b4d]">¿Eliminar rifa?</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Estás a punto de eliminar{" "}
                <span className="font-semibold text-[#0d2b4d]">{rifaAEliminar.name}</span>.
                {" "}Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="flex w-full gap-3">
              <button
                onClick={() => setRifaAEliminar(null)}
                disabled={eliminando}
                className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminar}
                disabled={eliminando}
                className="flex-1 rounded-2xl bg-[#a50044] py-3 text-sm font-bold text-white transition hover:bg-[#870038] disabled:opacity-50"
              >
                {eliminando ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RifaManager;
