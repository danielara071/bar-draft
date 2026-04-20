import { useEffect, useState, useCallback } from "react";
import type { Fixture } from "../interfaces/index.interfaces";

const SCRAPER_URL = "https://barca-scraper-7tag.onrender.com";
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1500;

interface ScraperMatch {
  fixture_id: string;
  category: "varonil" | "femenil";
  datetime: string;
  home_team: string;
  away_team: string;
  competition: string;
  venue?: string;
}

interface ScraperResponse {
  varonil: ScraperMatch[];
  femenil: ScraperMatch[];
  total: number;
}

function mapToFixture(match: ScraperMatch): Fixture {
  return {
    fixture_id: match.fixture_id,
    date: match.datetime,
    homeTeam: match.home_team,
    awayTeam: match.away_team,
    venue: match.venue,
    status: "NS",
    competition: match.competition || "Por confirmar",
    category: match.category,
  };
}

// Fixtures de fallback si el scraper falla
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

async function fetchWithRetry(url: string, retries: number): Promise<Response> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
  } catch (err) {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      return fetchWithRetry(url, retries - 1);
    }
    throw err;
  }
}

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
      const res = await fetchWithRetry(`${SCRAPER_URL}/next-matches`, MAX_RETRIES);
      const json: ScraperResponse = await res.json();

      const all: Fixture[] = [
        ...(json.varonil ?? []).map(mapToFixture),
        ...(json.femenil ?? []).map(mapToFixture),
      ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setFixtures(all.length > 0 ? all : FALLBACK_FIXTURES);
    } catch (err) {
      // Scraper caído — usar fallback y mostrar aviso
      setError("No se pudieron cargar los partidos en tiempo real.");
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