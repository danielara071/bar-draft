import { Check, X } from "lucide-react";
import type {
  PredictionHistoryItem,
  PredictionSnapshot,
} from "../Types/predictionResults";

type PredictionResultModalProps = {
  result: PredictionHistoryItem | null;
  onClose: () => void;
};

type ComparisonRow = {
  label: string;
  predicted: string;
  official: string;
  correct: boolean;
};

function halftimeLabel(value: number | null): string {
  if (value === 1) return "Local gana";
  if (value === -1) return "Visitante gana";
  if (value === 0) return "Empate";
  return "Sin predicción";
}

function textValue(value: string | null): string {
  return value?.trim() || "Sin predicción";
}

function scoreValue(snapshot: PredictionSnapshot): string {
  if (snapshot.home_goals == null || snapshot.away_goals == null) {
    return "Sin predicción";
  }
  return `${snapshot.home_goals} - ${snapshot.away_goals}`;
}

export default function PredictionResultModal({
  result,
  onClose,
}: PredictionResultModalProps) {
  if (!result) return null;

  const settlement = result.settlement;
  const rows: ComparisonRow[] = settlement
    ? [
        {
          label: "Ganador",
          predicted: textValue(settlement.prediction_snapshot.winner),
          official: textValue(settlement.official_result.winner),
          correct: settlement.winner_correct,
        },
        {
          label: "Marcador final",
          predicted: scoreValue(settlement.prediction_snapshot),
          official: scoreValue(settlement.official_result),
          correct: settlement.score_correct,
        },
        {
          label: "Total de goles",
          predicted: textValue(settlement.prediction_snapshot.goals_range),
          official: textValue(settlement.official_result.goals_range),
          correct: settlement.goals_range_correct,
        },
        {
          label: "Primer goleador",
          predicted: textValue(settlement.prediction_snapshot.first_scorer),
          official:
            settlement.official_result.first_scorer?.trim() ||
            "Partido sin goles",
          correct: settlement.first_scorer_correct,
        },
        {
          label: "Medio tiempo",
          predicted: halftimeLabel(
            settlement.prediction_snapshot.halftime_result,
          ),
          official: halftimeLabel(settlement.official_result.halftime_result),
          correct: settlement.halftime_correct,
        },
      ]
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 sm:max-w-lg sm:rounded-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#A3205A]">
              Resultado de predicciones
            </p>
            <h2 className="mt-1 text-2xl font-bold text-neutral-900">
              {result.homeTeam} vs {result.awayTeam}
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              {new Date(result.matchDate).toLocaleDateString("es-MX", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {!result.predictionExists && (
          <div className="mt-6 rounded-2xl bg-neutral-50 p-5 text-center">
            <h3 className="font-bold text-neutral-900">
              No realizaste predicciones
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              Este partido ya finalizó, pero no registraste una predicción.
            </p>
          </div>
        )}

        {result.predictionExists && !settlement && (
          <div className="mt-6 rounded-2xl bg-amber-50 p-5 text-center">
            <h3 className="font-bold text-amber-900">
              Resultado en procesamiento
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-amber-700">
              Tu predicción existe, pero la liquidación oficial todavía no está
              disponible.
            </p>
          </div>
        )}

        {settlement && (
          <>
            <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200">
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[1fr_auto] gap-4 border-b border-neutral-100 p-4 last:border-b-0"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                      {row.label}
                    </p>
                    <p className="mt-1 text-sm text-neutral-600">
                      Tu predicción:{" "}
                      <span className="font-semibold text-neutral-900">
                        {row.predicted}
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-neutral-600">
                      Resultado:{" "}
                      <span className="font-semibold text-neutral-900">
                        {row.official}
                      </span>
                    </p>
                  </div>
                  <div
                    className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${
                      row.correct
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                    title={row.correct ? "Predicción correcta" : "Predicción incorrecta"}
                  >
                    {row.correct ? <Check size={17} /> : <X size={17} />}
                  </div>
                </div>
              ))}
            </div>

            <div
              className={`mt-5 rounded-2xl p-5 text-center ${
                settlement.all_correct
                  ? "bg-[#E6B417]/15 text-[#6E5200]"
                  : "bg-neutral-100 text-neutral-700"
              }`}
            >
              <p className="text-sm font-semibold">Experiencia obtenida</p>
              <p className="mt-1 text-4xl font-bold">
                {settlement.xp_awarded} XP
              </p>
              <p className="mt-2 text-xs">
                {settlement.all_correct
                  ? "Acertaste todas tus predicciones."
                  : "Se requieren todos los aciertos para obtener 200 XP."}
              </p>
            </div>
          </>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-[#A3205A] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

