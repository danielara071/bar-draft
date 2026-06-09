import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../../shared/services/supabaseClient";
import type {
  PredictionHistoryItem,
  PredictionSettlement,
} from "../Types/predictionResults";

type FixtureRow = {
  fixture_id: string;
  home_team: string;
  away_team: string;
  competition: string | null;
  match_date: string;
  home_goals: number | null;
  away_goals: number | null;
};

type PredictionRow = {
  partido_id: string;
};

type UsePredictionResultsReturn = {
  results: PredictionHistoryItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function usePredictionResults(): UsePredictionResultsReturn {
  const [results, setResults] = useState<PredictionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadResults = useCallback(async (background = false) => {
    if (!background) setIsLoading(true);
    setError(null);

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user.id;

    if (!userId) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const pastMatchCutoff = new Date(
      Date.now() - 180 * 60_000,
    ).toISOString();
    const { data: fixturesData, error: fixturesError } = await supabase
      .from("fixtures")
      .select(
        "fixture_id, home_team, away_team, competition, match_date, home_goals, away_goals",
      )
      .or(`status.eq.finished,match_date.lte.${pastMatchCutoff}`)
      .order("match_date", { ascending: false })
      .limit(12);

    if (fixturesError) {
      setError(fixturesError.message);
      setIsLoading(false);
      return;
    }

    const fixtures = (fixturesData ?? []) as FixtureRow[];
    const fixtureIds = fixtures.map((fixture) => fixture.fixture_id);

    if (fixtureIds.length === 0) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const [predictionsResponse, settlementsResponse] = await Promise.all([
      supabase
        .from("predicciones")
        .select("partido_id")
        .eq("user_id", userId)
        .in("partido_id", fixtureIds),
      supabase
        .from("prediction_settlements")
        .select(
          "id, fixture_id, prediction_snapshot, official_result, winner_correct, score_correct, goals_range_correct, first_scorer_correct, halftime_correct, all_correct, xp_awarded, evaluated_at",
        )
        .eq("user_id", userId)
        .in("fixture_id", fixtureIds),
    ]);

    if (predictionsResponse.error || settlementsResponse.error) {
      setError(
        predictionsResponse.error?.message ??
          settlementsResponse.error?.message ??
          "No se pudieron cargar los resultados",
      );
      setIsLoading(false);
      return;
    }

    const predictedIds = new Set(
      ((predictionsResponse.data ?? []) as PredictionRow[]).map(
        (prediction) => prediction.partido_id,
      ),
    );
    const settlements = new Map(
      ((settlementsResponse.data ?? []) as PredictionSettlement[]).map(
        (settlement) => [settlement.fixture_id, settlement],
      ),
    );

    setResults(
      fixtures.map((fixture) => {
        const settlement = settlements.get(fixture.fixture_id) ?? null;

        return {
          fixtureId: fixture.fixture_id,
          homeTeam: fixture.home_team,
          awayTeam: fixture.away_team,
          competition: fixture.competition,
          matchDate: fixture.match_date,
          homeGoals:
            settlement?.official_result.home_goals ?? fixture.home_goals,
          awayGoals:
            settlement?.official_result.away_goals ?? fixture.away_goals,
          predictionExists: predictedIds.has(fixture.fixture_id),
          settlement,
        };
      }),
    );
    setIsLoading(false);
  }, []);

  const refetch = useCallback(
    () => loadResults(false),
    [loadResults],
  );

  useEffect(() => {
    const initialLoadId = window.setTimeout(() => {
      void loadResults(false);
    }, 0);

    const intervalId = window.setInterval(() => {
      void loadResults(true);
    }, 30_000);

    return () => {
      window.clearTimeout(initialLoadId);
      window.clearInterval(intervalId);
    };
  }, [loadResults]);

  return { results, isLoading, error, refetch };
}
