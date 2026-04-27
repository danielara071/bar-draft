import { useEffect, useState } from "react";
import type { LiveMatch } from "../Types/MatchTypes";
import { supabase } from "../../../shared/services/supabaseClient";

type LiveMatchCacheRow = {
  fixture_date: string;
  status_elapsed: number | null;
  venue_name: string | null;
  venue_city: string | null;
  league_name: string | null;
  league_round: string | null;
  home_team_name: string | null;
  away_team_name: string | null;
  goals_home: number | null;
  goals_away: number | null;
  fetched_at: string;
};

const mapRowToLiveMatch = (row: LiveMatchCacheRow): LiveMatch => ({
  fixture: {
    date: row.fixture_date,
    status: {
      elapsed: row.status_elapsed,
    },
    venue: {
      name: row.venue_name,
      city: row.venue_city,
    },
  },
  league: {
    name: row.league_name ?? "No disponible",
    round: row.league_round ?? "No disponible",
  },
  teams: {
    home: {
      name: row.home_team_name ?? "Local",
    },
    away: {
      name: row.away_team_name ?? "Visitante",
    },
  },
  goals: {
    home: row.goals_home,
    away: row.goals_away,
  },
});

export const useMatch = () => {
  const [match, setMatch] = useState<LiveMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);

  const getMatch = async () => {
    try {
      const { data, error: queryError } = await supabase
        .from("live_match_cache")
        .select(
          "fixture_date,status_elapsed,venue_name,venue_city,league_name,league_round,home_team_name,away_team_name,goals_home,goals_away,fetched_at"
        )
        .order("fetched_at", { ascending: false })
        .limit(1);

      if (queryError) {
        throw new Error(queryError.message || "Error fetching live match from Supabase");
      }

      const row = data?.[0] as LiveMatchCacheRow | undefined;

      if (row) {
        setMatch(mapRowToLiveMatch(row));
        setError(null);
        const parsedFetchedAt = Date.parse(row.fetched_at);
        setFetchedAt(Number.isNaN(parsedFetchedAt) ? Date.now() : parsedFetchedAt);
        return;
      }

      setMatch(null);
      setError(null);
      setFetchedAt(Date.now());
    } catch (error) {
      console.error(error);
      setMatch(null);
      setError(error instanceof Error ? error.message : "Unknown error fetching live match");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMatch();

    const intervalId = setInterval(() => {
      void getMatch();
    }, 45000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return { match, loading, error, fetchedAt };
};