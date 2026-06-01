import { useState } from "react";
import { Crown, Ticket } from "lucide-react";

export type RifaTienda = {
  id: number;
  name: string;
  type: "boleto" | "experiencia" | "viaje";
  total_boletos: number;
  costo_monedas: number;
  premium: boolean;
  image_url: string | null;
  boletos_vendidos: number;
};

type Props = {
  rifa: RifaTienda;
  esPremium: boolean;
  monedas: number;
  yaParticipa: boolean;
  onPremiumClick: () => void;
  onParticipar: () => void;
};

const TYPE_LABEL: Record<RifaTienda["type"], string> = {
  boleto: "Rifa de Boleto",
  experiencia: "Rifa de Experiencia",
  viaje: "Rifa de Viaje",
};

const RifaCard = ({
  rifa,
  esPremium,
  monedas,
  yaParticipa,
  onPremiumClick,
  onParticipar,
}: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const disponibles = rifa.total_boletos - rifa.boletos_vendidos;
  const progreso = rifa.total_boletos > 0
    ? Math.min((rifa.boletos_vendidos / rifa.total_boletos) * 100, 100)
    : 0;
  const sinMonedas = monedas < rifa.costo_monedas;
  const agotado = disponibles <= 0;

  const handleClick = () => {
    if (yaParticipa || agotado) return;
    if (rifa.premium && !esPremium) {
      onPremiumClick();
      return;
    }
    onParticipar();
  };

  return (
    <div
      className="relative bg-white rounded-lg shadow-md overflow-hidden py-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {rifa.premium && (
        <div className="absolute top-3 right-3 z-20 bg-gradient-to-br from-[#802244] via-[#4e1b7c] to-[#1a45a0] p-1.5 rounded-full shadow-lg border border-white/20">
          <Crown size={16} color="white" fill="white" strokeWidth={1.5} />
        </div>
      )}

      {yaParticipa && (
        <div className="absolute top-3 left-3 z-20 bg-[#A50044] px-2.5 py-1 rounded-full">
          <p className="text-[10px] font-bold text-white uppercase tracking-wide">Ya participas</p>
        </div>
      )}

      <div className="w-full h-48 bg-gradient-to-br from-[#0d2b4d] via-[#a50044] to-[#EDBB00]/70 flex items-center justify-center">
        {rifa.image_url ? (
          <img
            src={rifa.image_url}
            alt={rifa.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <Ticket className="h-16 w-16 text-[#EDBB00]/80" strokeWidth={1.4} />
        )}
      </div>

      <div className="p-4">
        <p className="text-gray-600">{TYPE_LABEL[rifa.type]}</p>
        <h2 className="text-lg font-bold">{rifa.name}</h2>

        <div className="mt-2 mb-1">
          <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#EDBB00] transition-all"
              style={{ width: `${progreso}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">{disponibles} boletos disponibles</p>
        </div>

        <p className={`text-xl font-bold ${sinMonedas && !yaParticipa ? "text-gray-400" : "text-[#A50044]"}`}>
          {agotado ? "Agotado" : `${rifa.costo_monedas.toLocaleString("en-US")} Monedas`}
        </p>
      </div>

      {!yaParticipa && !agotado && (
        <div className="absolute inset-0 px-10 flex items-center justify-center pointer-events-none">
          <button
            type="button"
            className={`pointer-events-auto text-xl bg-[#A50044] text-white font-bold px-10 py-3 rounded-xl hover:bg-[#A50044]/90 transition-all duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleClick}
          >
            Participar
          </button>
        </div>
      )}
    </div>
  );
};

export default RifaCard;
