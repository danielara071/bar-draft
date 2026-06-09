import { CheckCircle2, Clock3, CircleSlash2 } from "lucide-react";
import type { PredictionHistoryItem } from "../../../features/WatchParty/Types/predictionResults";

type PredictionHistoryProps = {
  results: PredictionHistoryItem[];
  isLoading: boolean;
  error: string | null;
  onSelect: (result: PredictionHistoryItem) => void;
};

export default function PredictionHistory({
  results,
  isLoading,
  error,
  onSelect,
}: PredictionHistoryProps) {
  return (
    <section className="wp-grid">
      <h2 className="wp-grid__title">
        Resultados de predicciones y partidos pasados
      </h2>

      {isLoading && (
        <div className="wp-grid__cards">
          <div className="wp-skeleton" />
          <div className="wp-skeleton" />
        </div>
      )}

      {!isLoading && error && (
        <p className="wp-grid__empty">
          No se pudieron cargar los resultados: {error}
        </p>
      )}

      {!isLoading && !error && results.length === 0 && (
        <p className="wp-grid__empty">
          Todavía no hay resultados ni partidos pasados.
        </p>
      )}

      {!isLoading && !error && results.length > 0 && (
        <div className="wp-grid__cards">
          {results.map((result) => (
            <button
              key={result.fixtureId}
              type="button"
              className="wp-card text-left"
              onClick={() => onSelect(result)}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`wp-card__badge ${
                    result.settlement?.all_correct
                      ? "wp-card__badge--femenil"
                      : "wp-card__badge--varonil"
                  }`}
                >
                  {result.settlement
                    ? `${result.settlement.xp_awarded} XP`
                    : result.predictionExists
                      ? "Procesando"
                      : "Sin predicción"}
                </span>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    result.settlement?.all_correct
                      ? "bg-emerald-100 text-emerald-700"
                      : result.predictionExists
                        ? "bg-amber-100 text-amber-700"
                        : "bg-neutral-100 text-neutral-500"
                  }`}
                  aria-label={
                    result.settlement?.all_correct
                      ? "Predicción perfecta"
                      : result.predictionExists
                        ? "Predicción realizada"
                        : "Sin predicción"
                  }
                >
                  {result.settlement?.all_correct ? (
                    <CheckCircle2 size={19} />
                  ) : result.predictionExists ? (
                    <Clock3 size={19} />
                  ) : (
                    <CircleSlash2 size={19} />
                  )}
                </span>
              </div>
              <h3 className="wp-card__title">
                {result.homeTeam} vs {result.awayTeam}
              </h3>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Marcador final
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-neutral-900">
                {result.homeGoals != null && result.awayGoals != null
                  ? `${result.homeGoals} - ${result.awayGoals}`
                  : "Marcador no disponible"}
              </p>
              <p className="wp-card__competition">
                {result.competition ?? "Partido finalizado"}
              </p>
              <div className="wp-card__divider" />
              <p className="wp-card__time">
                {new Date(result.matchDate).toLocaleDateString("es-MX", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
