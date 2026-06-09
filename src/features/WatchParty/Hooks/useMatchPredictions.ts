import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../../shared/services/supabaseClient";

type PredictionItem = {
  label: string;
  value: string;
};

type Distribution = {
  home: number;
  draw: number;
  away: number;
};

type PredictionStatsRow = {
  fixture_id: string;
  total_predictions: number;
  winner_distribution: Distribution;
  average_home_goals: number | null;
  average_away_goals: number | null;
  most_common_score: string | null;
  goals_range_distribution: Record<string, number>;
  most_common_first_scorer: string | null;
  halftime_distribution: Distribution;
};

function percentage(value: number, total: number): string {
  if (total === 0) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}

function mostPopularRange(distribution: Record<string, number>): string | null {
  const entries = Object.entries(distribution);
  if (entries.length === 0) return null;
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}

function buildPopularPredictions(stats: PredictionStatsRow): PredictionItem[] {
  if (stats.total_predictions === 0) {
    return [
      { label: "Ganador", value: "Sin predicciones aún" },
      { label: "Marcador final", value: "Sin predicciones aún" },
      { label: "Total de goles", value: "Sin predicciones aún" },
    ];
  }

  const winner = stats.winner_distribution;
  const halftime = stats.halftime_distribution;

  return [
    {
      label: "Ganador",
      value: `Local ${percentage(winner.home, stats.total_predictions)} · Empate ${percentage(winner.draw, stats.total_predictions)} · Visitante ${percentage(winner.away, stats.total_predictions)}`,
    },
    {
      label: "Promedio de goles",
      value:
        stats.average_home_goals == null || stats.average_away_goals == null
          ? "Sin datos"
          : `${stats.average_home_goals} - ${stats.average_away_goals}`,
    },
    {
      label: "Marcador más votado",
      value: stats.most_common_score ?? "Sin datos",
    },
    {
      label: "Rango de goles más votado",
      value: mostPopularRange(stats.goals_range_distribution) ?? "Sin datos",
    },
    {
      label: "Primer goleador más votado",
      value: stats.most_common_first_scorer ?? "Sin datos",
    },
    {
      label: "Resultado al descanso",
      value: `Local ${percentage(halftime.home, stats.total_predictions)} · Empate ${percentage(halftime.draw, stats.total_predictions)} · Visitante ${percentage(halftime.away, stats.total_predictions)}`,
    },
  ];
}

interface UseMatchPredictionsReturn {
  predictions: PredictionItem[];
  isLoading: boolean;
  totalVotes: number;
  refetch: () => void;
}

export function useMatchPredictions(fixture_id: string | null): UseMatchPredictionsReturn {
  const [predictions, setPredictions] = useState<PredictionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);

  const fetchPredictions = useCallback(async () => {
    if (!fixture_id) {
      setPredictions([]);
      setTotalVotes(0);
      return;
    }

    setIsLoading(true);

    const { data, error } = await supabase.rpc(
      "get_fixture_prediction_stats",
      { p_fixture_id: fixture_id },
    );

    const stats = data?.[0] as PredictionStatsRow | undefined;

    if (error || !stats) {
      setPredictions([
        { label: "Ganador más votado", value: "Error al cargar" },
        { label: "Marcador más votado", value: "Error al cargar" },
        { label: "Total de goles más votado", value: "Error al cargar" },
      ]);
      setIsLoading(false);
      return;
    }

    setTotalVotes(Number(stats.total_predictions));
    setPredictions(buildPopularPredictions(stats));
    setIsLoading(false);
  }, [fixture_id]);

  useEffect(() => {
    const initialLoadId = window.setTimeout(() => {
      void fetchPredictions();
    }, 0);

    // Refrescar cada 2 minutos para mostrar cambios en tiempo casi-real
    const intervalId = setInterval(() => void fetchPredictions(), 2 * 60 * 1000);
    return () => {
      window.clearTimeout(initialLoadId);
      clearInterval(intervalId);
    };
  }, [fetchPredictions]);

  return { predictions, isLoading, totalVotes, refetch: fetchPredictions };
}
