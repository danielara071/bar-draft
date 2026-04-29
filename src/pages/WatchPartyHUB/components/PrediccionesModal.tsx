import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePredicciones } from "../hooks/usePredicciones";
import type { WatchPartyMatch } from "../interfaces/index.interfaces";

type GolesRango = "0-1" | "2-3" | "4-5" | "6+";
type MedioTiempo = 1 | 0 | -1;

interface PrediccionesModalProps {
  match: WatchPartyMatch | null;
  onClose: () => void;
}

function Section({
  icon,
  label,
  children,
}: {
  icon?: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 mb-2 flex items-center gap-1.5">
        {icon && <span className="text-base leading-none">{icon}</span>}
        {label}
      </p>
      {children}
    </div>
  );
}

function ToggleGroup({
  options,
  values,
  selected,
  onSelect,
  cols = 3,
}: {
  options: string[];
  values?: string[];
  selected: string | null;
  onSelect: (v: string) => void;
  cols?: number;
}) {
  const resolveValue = (i: number) => (values ? values[i] : options[i]);

  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {options.map((label, i) => {
        const val = resolveValue(i);
        const active = selected === val;
        return (
          <button
            key={val}
            type="button"
            onClick={() => onSelect(val)}
            className={`py-2.5 text-xs rounded-xl border transition-colors ${
              active
                ? "bg-[#A3205A] border-[#A3205A] text-white"
                : "border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:border-neutral-400"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function ScoreInput({
  value,
  label,
  onChange,
}: {
  value: number;
  label: string;
  onChange: (delta: number) => void;
}) {
  return (
    <div className="flex-1 text-center">
      <div className="flex items-center justify-center gap-2 border border-neutral-200 dark:border-neutral-700 rounded-xl py-2.5 px-2">
        <button
          type="button"
          onClick={() => onChange(-1)}
          className="text-neutral-400 text-xl leading-none px-1 hover:text-neutral-600"
        >
          −
        </button>
        <span className="text-xl font-semibold w-6 text-center text-neutral-900 dark:text-white">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(1)}
          className="text-neutral-400 text-xl leading-none px-1 hover:text-neutral-600"
        >
          +
        </button>
      </div>
      <p className="text-xs text-neutral-400 mt-1 truncate">{label}</p>
    </div>
  );
}

/** Banner que se muestra cuando el usuario ya tiene predicción para este partido */
function PrediccionExistenteBanner({
  match,
  onEntrar,
}: {
  match: WatchPartyMatch;
  onEntrar: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-4">
      {/* Icono */}
      <div className="w-16 h-16 rounded-full bg-[#A3205A]/10 flex items-center justify-center text-3xl">
        ✅
      </div>

      {/* Texto */}
      <div>
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
          Ya hiciste tu predicción
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Ya registraste una predicción para{" "}
          <span className="font-semibold text-neutral-700 dark:text-neutral-300">
            {match.home_team} vs {match.away_team}
          </span>
          . Solo puedes predecir una vez por partido.
        </p>
      </div>

      {/* Botón entrar */}
      <button
        type="button"
        onClick={onEntrar}
        className="w-full py-3 rounded-full bg-[#A3205A] text-white text-sm font-semibold transition-opacity hover:opacity-90"
      >
        Entrar a la sala
      </button>
    </div>
  );
}

export function PrediccionesModal({ match, onClose }: PrediccionesModalProps) {
  const navigate = useNavigate();
  const { isLoading, error, guardar, verificar } = usePredicciones();

  // null = verificando, true = ya existe, false = no existe
  const [yaPredicho, setYaPredicho] = useState<boolean | null>(null);

  // Campos del formulario
  const [ganador, setGanador] = useState<string | null>(null);
  const [golesLocal, setGolesLocal] = useState(0);
  const [golesVisitante, setGolesVisitante] = useState(0);
  const [golesTotal, setGolesTotal] = useState<GolesRango | null>(null);
  const [primerGol, setPrimerGol] = useState("");
  const [medioTiempo, setMedioTiempo] = useState<MedioTiempo | null>(null);

  // Al abrir el modal, verificar si ya existe predicción para este partido
  useEffect(() => {
    if (!match) return;
    setYaPredicho(null); // resetear al cambiar de partido

    verificar(match.id).then((existe) => {
      setYaPredicho(existe);
    });
  }, [match?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!match) return null;

  const entrarASala = () => {
    onClose();
    navigate(`/watchParty/${match.code}`);
  };

  const handleSaltar = () => {
    entrarASala();
  };

  const handleGuardar = async () => {
    const ok = await guardar({
      partido_id: match.id,
      ganador,
      goles_local: golesLocal,
      goles_visitante: golesVisitante,
      goles_total: golesTotal,
      primer_goleador: primerGol.trim() || null,
      resultado_medio_tiempo: medioTiempo,
    });

    if (ok || error !== "Ya tienes una predicción para este partido.") {
      entrarASala();
    }
  };

  const handleScore = (team: "local" | "visitante", delta: number) => {
    if (team === "local") setGolesLocal((v) => Math.max(0, v + delta));
    else setGolesVisitante((v) => Math.max(0, v + delta));
  };

  const GOLES_OPCIONES: GolesRango[] = ["0-1", "2-3", "4-5", "6+"];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-neutral-900 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm p-6 overflow-y-auto max-h-[92dvh]">

        {/* ── Estado: verificando ── */}
        {yaPredicho === null && (
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <div className="w-8 h-8 rounded-full border-2 border-[#A3205A] border-t-transparent animate-spin" />
            <p className="text-sm text-neutral-400">Verificando predicciones...</p>
          </div>
        )}

        {/* ── Estado: ya predijo ── */}
        {yaPredicho === true && (
          <PrediccionExistenteBanner match={match} onEntrar={entrarASala} />
        )}

        {/* ── Estado: no ha predicho → formulario normal ── */}
        {yaPredicho === false && (
          <>
            {/* Header */}
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
              Haz tus predicciones
            </h2>
            <p className="text-sm text-neutral-500 mb-5">
              Antes de unirte, comparte tus predicciones sobre el partido
            </p>

            {/* ¿Quién ganará? */}
            <Section icon="🏆" label="¿Quién ganará?">
              <ToggleGroup
                options={[match.home_team || "", "Empate", match.away_team || ""]}
                selected={ganador}
                onSelect={setGanador}
              />
            </Section>

            {/* Marcador final */}
            <Section icon="🎯" label="Marcador final">
              <div className="flex items-center gap-3">
                <ScoreInput
                  value={golesLocal}
                  label={match.home_team || ""}
                  onChange={(d) => handleScore("local", d)}
                />
                <span className="text-neutral-400 text-xl">—</span>
                <ScoreInput
                  value={golesVisitante}
                  label={match.away_team || ""}
                  onChange={(d) => handleScore("visitante", d)}
                />
              </div>
            </Section>

            {/* Primer gol de... */}
            <Section icon="⭐" label="Primer gol de...">
              <input
                type="text"
                value={primerGol}
                onChange={(e) => setPrimerGol(e.target.value)}
                placeholder="Nombre del jugador"
                className="w-full border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white outline-none focus:border-[#A3205A]"
              />
            </Section>

            {/* Total de goles */}
            <Section label="Total de goles en el partido">
              <ToggleGroup
                options={GOLES_OPCIONES}
                selected={golesTotal}
                onSelect={(v) => setGolesTotal(v as GolesRango)}
                cols={4}
              />
            </Section>

            {/* Resultado al medio tiempo */}
            <Section label="Resultado al medio tiempo">
              <ToggleGroup
                options={["Barça gana", "Empate", `${match.away_team || ""} gana`]}
                values={["1", "0", "-1"]}
                selected={medioTiempo !== null ? String(medioTiempo) : null}
                onSelect={(v) => setMedioTiempo(parseInt(v) as MedioTiempo)}
              />
            </Section>

            {/* Error de Supabase */}
            {error && (
              <p className="text-xs text-red-500 mb-3 -mt-2">{error}</p>
            )}

            {/* Botones */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleSaltar}
                disabled={isLoading}
                className="py-3 rounded-full bg-[#A3205A] text-white text-sm font-semibold disabled:opacity-50 transition-opacity"
              >
                Saltar
              </button>
              <button
                type="button"
                onClick={handleGuardar}
                disabled={isLoading}
                className="py-3 rounded-full bg-[#E6B417] text-[#2C1A00] text-sm font-semibold disabled:opacity-50 transition-opacity"
              >
                {isLoading ? "Guardando..." : "Guardar Predicciones"}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}