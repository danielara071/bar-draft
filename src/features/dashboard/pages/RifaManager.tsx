import { useState } from "react";
import { Plus, Search } from "lucide-react";
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

  const filtered = rifas.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

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

    await supabase
      .from("rifas")
      .update({ ganador_id: random.user_id })
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

  return (
    <div className="flex flex-col py-10 px-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-2xl md:text-3xl lg:text-4xl font-semibold">
          <span className="text-black">Gestión de </span>
          <span className="text-[#EDBB00]">Rifas</span>
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

      {/* Rifa list */}
      <div className="flex flex-col gap-3">
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

        {filtered.map((rifa) => (
          <RifaCard
            key={rifa.id}
            rifa={rifa}
            onTerminar={() => handleTerminar(rifa)}
            onRifar={() => {
              if (rifando === null) handleRifar(rifa);
            }}
          />
        ))}
      </div>

      {/* Gestión de Ganadores — placeholder */}
      <div className="mt-12">
        <p className="text-2xl md:text-3xl lg:text-4xl font-semibold">
          <span className="text-black">Gestión de </span>
          <span className="text-[#EDBB00]">Ganadores</span>
        </p>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddRifaModal
          onClose={() => setShowAddModal(false)}
          onCreated={fetchRifas}
        />
      )}

      {ganador && (
        <GanadorModal
          data={ganador}
          onClose={() => setGanador(null)}
        />
      )}
    </div>
  );
};

export default RifaManager;
