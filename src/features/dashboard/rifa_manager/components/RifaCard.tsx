import { ShoppingBag, Trophy } from "lucide-react";
import type { Rifa } from "../interfaces/rifa";

interface RifaCardProps {
  rifa: Rifa;
  onTerminar: () => void;
  onRifar: () => void;
  onEliminar: () => void;
}

const RifaCard = ({ rifa, onTerminar, onRifar, onEliminar }: RifaCardProps) => {
  const disponibles = rifa.total_boletos - rifa.boletos_vendidos;
  const progreso = rifa.total_boletos > 0
    ? Math.min((rifa.boletos_vendidos / rifa.total_boletos) * 100, 100)
    : 0;

  const tieneGanador = rifa.estado === "terminada" && rifa.ganador_id !== null;

  return (
    <article className="w-full rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d2b4d] via-[#a50044] to-[#EDBB00]/70 flex items-center justify-center">
          {rifa.image_url ? (
            <img
              src={rifa.image_url}
              alt={rifa.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <ShoppingBag className="h-8 w-8 text-[#EDBB00]" strokeWidth={1.8} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="truncate text-base font-bold text-[#0d2b4d] md:text-lg">
              {rifa.name}
            </h3>
            {tieneGanador && (
              <span className="shrink-0 rounded-full bg-[#3FA14D] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                Terminada
              </span>
            )}
          </div>

          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden mb-2">
            <div
              className="h-full rounded-full bg-[#EDBB00] transition-all duration-500"
              style={{ width: `${progreso}%` }}
            />
          </div>

          {tieneGanador ? (
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <Trophy className="h-3.5 w-3.5 text-[#a50044] shrink-0" strokeWidth={2} />
              <span>
                Ganador:{" "}
                <span className="font-bold text-[#0d2b4d]">
                  {rifa.ganador_nombre ?? "—"}
                </span>
              </span>
            </div>
          ) : (
            <div className="flex gap-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  Boletos Vendidos
                </p>
                <p className="text-sm font-bold text-[#EDBB00]">{rifa.boletos_vendidos}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  Boletos Disponibles
                </p>
                <p className="text-sm font-bold text-[#EDBB00]">{disponibles}</p>
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 pl-2 flex items-center gap-2">
          {tieneGanador ? (
            <button
              onClick={onEliminar}
              className="rounded-xl bg-[#EDBB00] px-4 py-2 text-sm font-bold transition hover:bg-slate-500 active:scale-95"
            >
              Eliminar Rifa
            </button>
          ) : rifa.estado === "activa" ? (
            <div className="relative group">
              <button
                onClick={onTerminar}
                disabled={rifa.boletos_vendidos === 0}
                className="rounded-xl bg-[#a50044] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#870038] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Terminar Rifa
              </button>
              {rifa.boletos_vendidos === 0 && (
                <div className="pointer-events-none absolute bottom-full right-0 mb-2 hidden w-44 rounded-xl bg-[#0d2b4d] px-3 py-2 text-center text-[11px] text-white shadow-lg group-hover:block">
                  No hay participantes aún
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onRifar}
              className="rounded-xl bg-[#0d2b4d] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#091f38] active:scale-95"
            >
              Rifar Ganador
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default RifaCard;
