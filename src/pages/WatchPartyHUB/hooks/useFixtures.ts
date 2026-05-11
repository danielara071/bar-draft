import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../../shared/services/supabaseClient"; 
import type { Fixture } from "../interfaces/index.interfaces";

interface DbFixture {
  fixture_id: string;
  category: "varonil" | "femenil";
  match_date: string;
  home_team: string;
  away_team: string;
  competition: string | null;
  venue: string | null;
  status: "scheduled" | "live" | "finished";
}

function mapDbToFixture(row: DbFixture): Fixture {
  return {
    fixture_id: row.fixture_id,
    date: row.match_date,
    homeTeam: row.home_team,
    awayTeam: row.away_team,
    venue: row.venue || undefined,
    status: row.status === "scheduled" ? "NS" : row.status,
    competition: row.competition || "Por confirmar",
    category: row.category,
  };
}

const FALLBACK_FIXTURES: Fixture[] = [
  {
    fixture_id: "fallback-var-1",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    homeTeam: "FC Barcelona",
    awayTeam: "Por confirmar",
    status: "NS",
    competition: "Por confirmar",
    category: "varonil",
  },
];

interface UseFixturesReturn {
  fixtures: Fixture[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFixtures(): UseFixturesReturn {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFixtures = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from("fixtures")
        .select("*")
        .neq("status", "finished")   // excluir partidos terminados
        .order("match_date", { ascending: true });

      if (supabaseError) throw new Error(supabaseError.message);

      if (data && data.length > 0) {
        setFixtures(data.map(mapDbToFixture));
      } else {
        setFixtures(FALLBACK_FIXTURES);
      }
    } catch (err) {
      console.error("Error al obtener partidos de Supabase:", err);
      setError("No se pudieron cargar los partidos en este momento.");
      setFixtures(FALLBACK_FIXTURES);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFixtures();
  }, [fetchFixtures]);

  return { fixtures, isLoading, error, refetch: fetchFixtures };
}