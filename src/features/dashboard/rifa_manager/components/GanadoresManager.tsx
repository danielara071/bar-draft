import { useState } from "react";
import { Search, CheckCircle, XCircle, Clock } from "lucide-react";
import { supabase } from "@/shared/services/supabaseClient";
import useGanadores, { type Ganador } from "../hooks/useGanadores";

const estadoVideo = {
  aceptado: {
    label: "Video Aceptado",
    className: "bg-green-100 text-green-700",
  },
  denegado: {
    label: "Video Denegado",
    className: "bg-slate-100 text-slate-500",
  },
  pendiente: {
    label: "Pendiente",
    className: "bg-[#EDBB00]/15 text-[#8a6200]",
  },
};

interface ConfirmDialogProps {
  accion: "aceptar" | "denegar";
  ganador: Ganador;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

const ConfirmDialog = ({ accion, ganador, onConfirm, onCancel, loading }: ConfirmDialogProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d2b4d]/45 backdrop-blur-sm">
    <div className="flex w-full max-w-sm flex-col items-center gap-5 rounded-[28px] bg-white p-8 shadow-2xl">
      <div className={`flex h-16 w-16 items-center justify-center rounded-full ${
        accion === "aceptar" ? "bg-green-100" : "bg-slate-100"
      }`}>
        {accion === "aceptar"
          ? <CheckCircle className="h-8 w-8 text-green-600" strokeWidth={1.8} />
          : <XCircle className="h-8 w-8 text-slate-500" strokeWidth={1.8} />
        }
      </div>

      <div className="text-center">
        <h2 className="text-xl font-bold text-[#0d2b4d]">
          {accion === "aceptar" ? "¿Aceptar video?" : "¿Denegar video?"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Video de <span className="font-semibold text-[#0d2b4d]">{ganador.ganador_nombre ?? "—"}</span>{" "}
          para la rifa <span className="font-semibold text-[#0d2b4d]">{ganador.rifa_nombre}</span>.
        </p>
      </div>

      <div className="flex w-full gap-3">
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`flex-1 rounded-2xl py-3 text-sm font-bold text-white transition disabled:opacity-50 ${
            accion === "aceptar"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-[#a50044] hover:bg-[#870038]"
          }`}
        >
          {loading ? "Procesando..." : accion === "aceptar" ? "Aceptar" : "Denegar"}
        </button>
      </div>
    </div>
  </div>
);

const VideoCard = ({
  ganador,
  onAceptar,
  onDenegar,
}: {
  ganador: Ganador;
  onAceptar: () => void;
  onDenegar: () => void;
}) => (
  <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-3 flex items-start justify-between gap-3">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Rifa</p>
        <p className="text-base font-bold text-[#0d2b4d]">{ganador.rifa_nombre}</p>
      </div>
      <div className="text-right">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Ganador</p>
        <p className="text-sm font-semibold text-[#0d2b4d]">{ganador.ganador_nombre ?? "—"}</p>
      </div>
    </div>

    {ganador.video_url ? (
      <video
        src={ganador.video_url}
        controls
        className="w-full rounded-2xl bg-black max-h-64 object-contain"
      />
    ) : (
      <div className="flex h-40 w-full items-center justify-center rounded-2xl bg-slate-100">
        <p className="text-sm text-slate-400">Sin video subido aún</p>
      </div>
    )}

    <div className="mt-4 flex gap-3">
      <button
        onClick={onDenegar}
        className="flex-1 rounded-2xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 active:scale-95"
      >
        Denegar Video
      </button>
      <button
        onClick={onAceptar}
        className="flex-1 rounded-2xl bg-[#a50044] py-2.5 text-sm font-bold text-white transition hover:bg-[#870038] active:scale-95"
      >
        Aceptar Video
      </button>
    </div>
  </div>
);

const GanadoresManager = () => {
  const { ganadores, loading, fetchGanadores } = useGanadores();
  const [confirm, setConfirm] = useState<{
    ganador: Ganador;
    accion: "aceptar" | "denegar";
  } | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [historialSearch, setHistorialSearch] = useState("");

  const pendientes  = ganadores.filter((g) => g.estado === "pendiente");
  const historial   = ganadores.filter((g) => g.estado !== "pendiente");
  const historialFiltrado = historial.filter((g) =>
    g.rifa_nombre.toLowerCase().includes(historialSearch.toLowerCase()) ||
    (g.ganador_nombre ?? "").toLowerCase().includes(historialSearch.toLowerCase())
  );

  const handleConfirm = async () => {
    if (!confirm) return;
    setProcesando(true);

    const nuevoEstado = confirm.accion === "aceptar" ? "aceptado" : "denegado";

    const { error } = await supabase
      .from("rifa_ganadores")
      .update({ estado: nuevoEstado })
      .eq("id", confirm.ganador.id);

    setProcesando(false);

    if (!error) {
      await fetchGanadores();
    }
    setConfirm(null);
  };

  if (loading) {
    return <p className="mt-4 text-sm text-slate-400">Cargando ganadores...</p>;
  }

  return (
    <div className="mt-4 flex flex-col gap-6">
      {/* Videos pendientes */}
      {pendientes.length === 0 ? (
        <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
          <Clock className="mx-auto mb-2 h-8 w-8 text-slate-300" strokeWidth={1.5} />
          <p className="text-sm font-semibold text-slate-500">Sin videos pendientes de revisión</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {pendientes.map((g) => (
            <VideoCard
              key={g.id}
              ganador={g}
              onAceptar={() => setConfirm({ ganador: g, accion: "aceptar" })}
              onDenegar={() => setConfirm({ ganador: g, accion: "denegar" })}
            />
          ))}
        </div>
      )}

      {/* Historial */}
      {historial.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">
              Historial revisados ({historial.length})
            </p>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <input
                type="text"
                value={historialSearch}
                onChange={(e) => setHistorialSearch(e.target.value)}
                placeholder="Buscar por rifa o ganador..."
                className="w-48 bg-transparent text-xs outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto rounded-[20px] border border-slate-200 bg-[#f4f6f9] p-3 flex flex-col gap-2">
            {historialFiltrado.length === 0 ? (
              <p className="py-4 text-center text-xs text-slate-400">Sin resultados</p>
            ) : (
              historialFiltrado.map((g) => {
                const cfg = estadoVideo[g.estado];
                return (
                  <div
                    key={g.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#0d2b4d]">
                        {g.rifa_nombre}
                      </p>
                      <p className="text-xs text-slate-400">{g.ganador_nombre ?? "—"}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold ${cfg.className}`}>
                      {cfg.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Confirmación */}
      {confirm && (
        <ConfirmDialog
          accion={confirm.accion}
          ganador={confirm.ganador}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
          loading={procesando}
        />
      )}
    </div>
  );
};

export default GanadoresManager;
