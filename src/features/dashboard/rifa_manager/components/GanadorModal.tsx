import { Trophy } from "lucide-react";
import type { RifaGanador } from "../interfaces/rifa";

interface GanadorModalProps {
  data: RifaGanador;
  onClose: () => void;
}

const GanadorModal = ({ data, onClose }: GanadorModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-[28px] bg-white p-10 shadow-2xl flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#a50044]/10">
          <Trophy className="h-10 w-10 text-[#a50044]" strokeWidth={1.6} />
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[#0d2b4d]">Ganador</h2>
          <p className="mt-1 text-xl font-bold text-[#0d2b4d]">
            {data.ganador.nombre ?? data.ganador.email ?? "Usuario"}
          </p>
          <p className="mt-3 text-sm text-slate-500">
            Rifa:{" "}
            <span className="font-semibold text-[#0d2b4d]">{data.rifa.name}</span>
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-2 w-full rounded-2xl bg-[#a50044] py-3 text-sm font-bold text-white transition hover:bg-[#870038] active:scale-95"
        >
          Mandar Notificación
        </button>
      </div>
    </div>
  );
};

export default GanadorModal;
