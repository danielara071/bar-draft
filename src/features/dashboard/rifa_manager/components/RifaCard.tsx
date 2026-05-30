import { ShoppingBag } from "lucide-react";
import type { Rifa } from "../interfaces/rifa";

interface RifaCardProps {
  rifa: Rifa;
  onTerminar: () => void;
  onRifar: () => void;
}

const RifaCard = ({ rifa, onTerminar, onRifar }: RifaCardProps) => {
  const disponibles = rifa.total_boletos - rifa.boletos_vendidos;
  const progreso = rifa.total_boletos > 0
    ? Math.min((rifa.boletos_vendidos / rifa.total_boletos) * 100, 100)
    : 0;

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
          <h3 className="truncate text-base font-bold text-[#0d2b4d] md:text-lg mb-2">
            {rifa.name}
          </h3>

          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden mb-2">
            <div
              className="h-full rounded-full bg-[#EDBB00] transition-all duration-500"
              style={{ width: `${progreso}%` }}
            />
          </div>

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
        </div>

        <div className="shrink-0 pl-2">
          {rifa.estado === "activa" ? (
            <button
              onClick={onTerminar}
              className="rounded-xl bg-[#a50044] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#870038] active:scale-95"
            >
              Terminar Rifa
            </button>
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
