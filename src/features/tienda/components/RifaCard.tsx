import { useState } from "react";
import { Crown, Users, Ticket, X, MapPin, Star, Plane } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export type RifaTienda = {
  id: number;
  name: string;
  type: "boleto" | "experiencia" | "viaje";
  total_boletos: number;
  costo_monedas: number;
  premium: boolean;
  image_url: string | null;
  boletos_vendidos: number;
  estado?: "activa" | "terminada";
  fecha_cierre?: string | null;
  ganador_id?: string | null;
  mis_boletos?: number;
  gano?: boolean;
};

type Props = {
  rifa: RifaTienda;
  esPremium: boolean;
  monedas: number;
  yaParticipa: boolean;
  onPremiumClick: () => void;
  onParticipar: () => void;
};

const TYPE_INFO: Record<
  RifaTienda["type"],
  { label: string; icon: React.ReactNode; descripcion: string; incluye: string[] }
> = {
  boleto: {
    label: "Rifa de Boleto",
    icon: <Ticket size={18} className="text-[#004d98]" />,
    descripcion:
      "Gana una entrada para el próximo partido del FC Barcelona. Vive el ambiente del estadio y forma parte de una experiencia única como aficionado.",
    incluye: [
      "1 boleto oficial para partido seleccionado",
      "Acceso digital a la confirmación",
      "Participación individual por usuario",
    ],
  },
  experiencia: {
    label: "Rifa de Experiencia",
    icon: <Star size={18} className="text-[#EDBB00]" />,
    descripcion:
      "Participa por una experiencia exclusiva relacionada con el club. Este tipo de premio puede incluir dinámicas especiales, accesos únicos o apariciones destacadas.",
    incluye: [
      "Experiencia exclusiva vinculada al club",
      "Confirmación digital del premio",
      "Beneficio personal e intransferible",
    ],
  },
  viaje: {
    label: "Rifa de Viaje",
    icon: <Plane size={18} className="text-[#A50044]" />,
    descripcion:
      "Participa para ganar un viaje temático relacionado con el FC Barcelona. Ideal para vivir el club y la ciudad desde una experiencia más completa.",
    incluye: [
      "Viaje temático relacionado con la rifa",
      "Experiencia especial para el ganador",
      "Confirmación y seguimiento digital",
    ],
  },
};

const RifaDetalleModal = ({
  rifa,
  yaParticipa,
  monedas,
  esPremium,
  onClose,
  onParticipar,
  onPremiumClick,
}: {
  rifa: RifaTienda;
  yaParticipa: boolean;
  monedas: number;
  esPremium: boolean;
  onClose: () => void;
  onParticipar: () => void;
  onPremiumClick: () => void;
}) => {
  const info = TYPE_INFO[rifa.type];
  const progreso =
    rifa.total_boletos > 0
      ? Math.min((rifa.boletos_vendidos / rifa.total_boletos) * 100, 100)
      : 0;
  const agotado = rifa.boletos_vendidos >= rifa.total_boletos;
  const sinMonedas = monedas < rifa.costo_monedas;
  const terminada = rifa.estado === "terminada";
  const gano = rifa.gano === true;

  const fechaCierre = rifa.fecha_cierre
    ? new Date(rifa.fecha_cierre).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const handleComprar = () => {
    if (agotado || terminada || yaParticipa || sinMonedas) return;

    if (rifa.premium && !esPremium) {
      onClose();
      onPremiumClick();
      return;
    }

    onClose();
    onParticipar();
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="relative w-full h-48 bg-gradient-to-br from-[#0d2b4d] via-[#1a3a6b] to-[#0a1f3d]">
          {rifa.image_url ? (
            <img src={rifa.image_url} alt={rifa.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Ticket className="w-16 h-16 text-[#EDBB00]/60" strokeWidth={1.2} />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          <div className="absolute bottom-4 left-5 right-12">
            <p className="text-white/70 text-[11px] font-semibold uppercase tracking-widest mb-0.5">
              {info.label}
            </p>
            <h2 className="text-white text-xl font-extrabold leading-snug">
              {rifa.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition"
          >
            <X size={16} />
          </button>

          {gano && (
            <span className="absolute top-3 left-3 bg-[#EDBB00] text-gray-900 text-[10px] font-bold px-2.5 py-1 rounded-full">
              🏆 ¡GANASTE!
            </span>
          )}

          {terminada && !gano && (
            <span className="absolute top-3 left-3 bg-gray-700 text-gray-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
              FINALIZADA
            </span>
          )}

          {!terminada && !gano && (
            <span className="absolute top-3 left-3 flex items-center gap-1 bg-[#16a34a] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
              ACTIVA
            </span>
          )}
        </div>

        <div className="p-5 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
          <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
            <div className="mt-0.5">{info.icon}</div>
            <div>
              <p className="text-[13px] font-bold text-gray-900 mb-1">{info.label}</p>
              <p className="text-[12px] text-gray-500 leading-relaxed">{info.descripcion}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <Users size={14} className="text-gray-400 mx-auto mb-1" />
              <p className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">
                Participantes
              </p>
              <p className="text-[16px] font-extrabold text-gray-900 mt-0.5">
                {rifa.boletos_vendidos.toLocaleString("en-US")}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <Ticket size={14} className="text-gray-400 mx-auto mb-1" />
              <p className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">
                Tus boletos
              </p>
              <p className="text-[16px] font-extrabold text-[#A50044] mt-0.5">
                {rifa.mis_boletos ?? (yaParticipa ? 1 : 0)}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <MapPin size={14} className="text-gray-400 mx-auto mb-1" />
              <p className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">
                Cierre
              </p>
              <p className="text-[11px] font-bold text-gray-900 mt-0.5 leading-tight">
                {fechaCierre ?? "—"}
              </p>
            </div>
          </div>

          {!terminada && (
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-gray-500 font-medium">
                  Progreso del sorteo
                </span>
                <span className="text-[11px] font-bold text-gray-800">
                  {Math.round(progreso)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#004d98] transition-all duration-500"
                  style={{ width: `${progreso}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-400">
                {formatNumber(rifa.boletos_vendidos)} / {formatNumber(rifa.total_boletos)} boletos vendidos
              </span>
            </div>
          )}

          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
              ¿Qué incluye?
            </p>
            <ul className="flex flex-col gap-1.5">
              {info.incluye.map((item) => (
                <li key={item} className="flex items-center gap-2 text-[12px] text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#004d98] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">
                Inversión
              </p>
              <p className="text-[16px] font-extrabold text-[#A50044] mt-1">
                {rifa.costo_monedas.toLocaleString("en-US")} Monedas
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">
                Estado
              </p>
              <p className="text-[13px] font-bold text-gray-900 mt-1">
                {terminada ? "Finalizada" : "Activa"}
              </p>
            </div>
          </div>

          <p className="text-[10px] text-gray-300">ID: {rifa.id}</p>
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-[13px] px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
          >
            Cerrar
          </button>

          {!terminada && !gano && !yaParticipa && !agotado && (
            <button
              type="button"
              disabled={sinMonedas}
              onClick={handleComprar}
              className={`font-bold text-[13px] px-6 py-2.5 rounded-xl transition-all ${
                sinMonedas
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#A50044] hover:bg-[#8a003a] text-white"
              }`}
            >
              Comprar boleto
            </button>
          )}

          {yaParticipa && (
            <span className="text-[12px] font-bold text-[#004d98] bg-blue-50 px-4 py-2 rounded-xl">
              ✓ Ya participas
            </span>
          )}

          {(agotado || terminada) && !gano && (
            <span className="text-[12px] font-semibold text-gray-400 bg-gray-100 px-4 py-2 rounded-xl">
              {agotado ? "Agotado" : "Finalizada"}
            </span>
          )}

          {gano && (
            <span className="text-[12px] font-bold text-gray-900 bg-[#EDBB00] px-4 py-2 rounded-xl">
              🏆 ¡Ganaste esta rifa!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const RifaCard = ({
  rifa,
  esPremium,
  monedas,
  yaParticipa,
  onPremiumClick,
  onParticipar,
}: Props) => {
  const [mostrarModal, setMostrarModal] = useState(false);

  const progreso =
    rifa.total_boletos > 0
      ? Math.min((rifa.boletos_vendidos / rifa.total_boletos) * 100, 100)
      : 0;

  const agotado = rifa.boletos_vendidos >= rifa.total_boletos;
  const sinMonedas = monedas < rifa.costo_monedas;
  const terminada = rifa.estado === "terminada";
  const gano = rifa.gano === true;

  const diasRestantes = (() => {
    if (!rifa.fecha_cierre) return null;
    const hoy = new Date();
    const cierre = new Date(rifa.fecha_cierre);
    const diff = Math.ceil(
      (cierre.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff > 0 ? diff : null;
  })();

  const handleComprarClick = () => {
    if (agotado || terminada || yaParticipa || sinMonedas) return;



    if (rifa.premium && !esPremium) {
      onPremiumClick();
      return;
    }

    onParticipar();
  };

  const typeLabel = TYPE_INFO[rifa.type].label;

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col">
        <div className="relative w-full h-44 bg-gradient-to-br from-[#0d2b4d] via-[#1a3a6b] to-[#0a1f3d] overflow-hidden">
          {rifa.image_url ? (
            <img
              src={rifa.image_url}
              alt={rifa.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Ticket className="w-16 h-16 text-[#EDBB00]/60" strokeWidth={1.2} />
            </div>
          )}

          {!terminada && !gano && !yaParticipa && (
            <span className="absolute top-2 left-2 flex items-center gap-1 bg-[#16a34a] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
              ACTIVA
            </span>
          )}

          {yaParticipa && !terminada && (
            <span className="absolute top-2 left-2 bg-[#A50044] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              Ya participas
            </span>
          )}

          {gano && (
            <span className="absolute top-2 right-2 flex items-center gap-1 bg-[#EDBB00] text-gray-900 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              🏆 ¡GANASTE!
            </span>
          )}

          {terminada && !gano && (
            <span className="absolute top-2 right-2 bg-gray-700 text-gray-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              FINALIZADA
            </span>
          )}

          {rifa.premium && (
            <div className="absolute top-2 right-2 bg-gradient-to-br from-[#802244] via-[#4e1b7c] to-[#1a45a0] p-1.5 rounded-full shadow border border-white/20">
              <Crown size={14} color="white" fill="white" strokeWidth={1.5} />
            </div>
          )}

          {diasRestantes !== null && !terminada && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
              <span>🕐</span>
              <span>Finaliza en {diasRestantes}d</span>
            </div>
          )}
        </div>


        <div className="p-4 flex flex-col gap-3 flex-1">
          <span className="text-[10px] font-semibold text-[#004d98] uppercase tracking-widest">
            {typeLabel}
          </span>

          <h3 className="text-[15px] font-bold text-gray-900 leading-snug -mt-1">
            {rifa.name}
          </h3>

          <div className="flex gap-6">
            <div className="flex flex-col gap-0.5">
              <span className="flex items-center gap-1 text-[9px] font-semibold text-gray-400 uppercase tracking-widest">
                <Users size={10} />
                Participantes
              </span>
              <span className="text-[15px] font-bold text-gray-900">
                {rifa.boletos_vendidos.toLocaleString("en-US")}
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="flex items-center gap-1 text-[9px] font-semibold text-gray-400 uppercase tracking-widest">
                <Ticket size={10} />
                Tus boletos
              </span>
              <span className="text-[15px] font-bold text-[#A50044]">
                {rifa.mis_boletos ?? (yaParticipa ? 1 : 0)}
              </span>
            </div>
          </div>

          {!terminada && (
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-gray-500">Progreso</span>
                <span className="text-[11px] font-bold text-gray-800">
                  {Math.round(progreso)}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#004d98] transition-all duration-500"
                  style={{ width: `${progreso}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-400">
                {formatNumber(rifa.boletos_vendidos)} / {formatNumber(rifa.total_boletos)} boletos vendidos
              </span>
            </div>
          )}

          <div className="flex items-center justify-between mt-auto pt-1">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">
                Inversión
              </span>
              <span
                className={`text-[15px] font-extrabold ${
                  sinMonedas && !yaParticipa ? "text-gray-400" : "text-[#A50044]"
                }`}
              >
                {rifa.costo_monedas.toLocaleString("en-US")} Monedas
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMostrarModal(true)}
              className="text-[12px] font-bold px-4 py-2 rounded-xl transition-all bg-[#004d98] hover:bg-[#003a75] text-white"
            >
              Ver detalles
            </button>

            <button
              type="button"
              onClick={handleComprarClick}
              disabled={agotado || yaParticipa || sinMonedas || terminada}
              className={`text-[12px] font-bold px-4 py-2 rounded-xl transition-all ${
                agotado || yaParticipa || sinMonedas || terminada
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#A50044] hover:bg-[#8a003a] text-white"
              }`}
            >
              {agotado
                ? "Agotado"
                : terminada
                ? "Finalizada"
                : yaParticipa
                ? "Ya participas"
                : sinMonedas
                ? "Sin monedas"
                : "Comprar boleto"}
            </button>
          </div>

          <span className="text-[10px] text-gray-300">ID: {rifa.id}</span>
        </div>




      </div>

      {mostrarModal && (
        <RifaDetalleModal
          rifa={rifa}
          yaParticipa={yaParticipa}
          monedas={monedas}
          esPremium={esPremium}
          onClose={() => setMostrarModal(false)}
          onParticipar={onParticipar}
          onPremiumClick={onPremiumClick}
        />


      )}
    </>
  );
};

export default RifaCard;