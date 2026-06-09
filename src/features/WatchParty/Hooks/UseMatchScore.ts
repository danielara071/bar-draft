import { useCallback, useEffect, useState } from "react";
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

type FixtureRow = {
  api_fixture_id: number | null;
  match_date: string;
  home_team: string;
  away_team: string;
  competition: string | null;
  venue: string | null;
  status: "scheduled" | "live" | "finished";
  home_goals: number | null;
  away_goals: number | null;
  updated_at: string | null;
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

const mapFixtureToLiveMatch = (row: FixtureRow): LiveMatch => {
  return {
    fixture: {
      date: row.match_date,
      status: {
        elapsed: null,
      },
      venue: {
        name: row.venue,
        city: null,
      },
    },
    league: {
      name: row.competition ?? "No disponible",
      round:
        row.status === "live"
          ? "En vivo"
          : row.status === "finished"
            ? "Finalizado"
            : "Programado",
    },
    teams: {
      home: {
        name: row.home_team,
      },
      away: {
        name: row.away_team,
      },
    },
    goals: {
      home: row.home_goals,
      away: row.away_goals,
    },
  };
};

export const useMatch = (fixtureId: string | null) => {
  const [match, setMatch] = useState<LiveMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);

  const getMatch = useCallback(async () => {
    if (!fixtureId) {
      setMatch(null);
      setLoading(false);
      return;
    }

    try {
      const { data: fixture, error: fixtureError } = await supabase
        .from("fixtures")
        .select(
          "api_fixture_id, match_date, home_team, away_team, competition, venue, status, home_goals, away_goals, updated_at",
        )
        .eq("fixture_id", fixtureId)
        .single();

      if (fixtureError) {
        throw new Error(fixtureError.message);
      }

      const apiFixtureId =
        fixture.api_fixture_id ?? (/^\d+$/.test(fixtureId) ? Number(fixtureId) : null);

      if (apiFixtureId == null) {
        setMatch(mapFixtureToLiveMatch(fixture as FixtureRow));
        setError(null);
        setFetchedAt(Date.now());
        return;
      }

      const { data, error: queryError } = await supabase
        .from("live_match_cache")
        .select(
          "fixture_date,status_elapsed,venue_name,venue_city,league_name,league_round,home_team_name,away_team_name,goals_home,goals_away,fetched_at"
        )
        .eq("fixture_id", apiFixtureId)
        .maybeSingle();

      if (queryError) {
        throw new Error(queryError.message || "Error fetching live match from Supabase");
      }

      const row = data as LiveMatchCacheRow | null;

      if (row) {
        setMatch(mapRowToLiveMatch(row));
        setError(null);
        const parsedFetchedAt = Date.parse(row.fetched_at);
        setFetchedAt(Number.isNaN(parsedFetchedAt) ? Date.now() : parsedFetchedAt);
        return;
      }

      setMatch(mapFixtureToLiveMatch(fixture as FixtureRow));
      setError(null);
      setFetchedAt(Date.now());
    } catch (error) {
      console.error(error);
      setMatch(null);
      setError(error instanceof Error ? error.message : "Unknown error fetching live match");
    } finally {
      setLoading(false);
    }
  }, [fixtureId]);

  useEffect(() => {
    const initialLoadId = window.setTimeout(() => {
      setMatch(null);
      setLoading(true);
      setError(null);
      void getMatch();
    }, 0);

    const intervalId = setInterval(() => {
      void getMatch();
    }, 45000);

    return () => {
      window.clearTimeout(initialLoadId);
      clearInterval(intervalId);
    };
  }, [getMatch]);

  return { match, loading, error, fetchedAt };
};
