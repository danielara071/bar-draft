import { useEffect, useState } from "react";
import type { Fixture } from "../interfaces/index.interfaces";

const BARCA_TEAM_ID = 529;
const API_KEY = import.meta.env.VITE_API_KEY as string;
const BASE_URL = "https://v3.football.api-sports.io";

/** Devuelve la temporada activa: si estamos en enero-mayo, es el año anterior */
function getCurrentSeason(): number {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  return month >= 8 ? now.getFullYear() : now.getFullYear() - 1;
}

/** Formatea una fecha como "YYYY-MM-DD" para la API */
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function mapFixture(item: any): Fixture {
  return {
    fixture_id: item.fixture.id,
    date: item.fixture.date,
    homeTeam: item.teams.home.name,
    awayTeam: item.teams.away.name,
    venue: item.fixture.venue?.name ?? "Por confirmar",
    status: item.fixture.status.short, 
    competition: item.league.name,
  };
}

interface UseFixturesReturn {
  fixtures: Fixture[];
  isLoading: boolean;
  error: string | null;
}

export function useFixtures(): UseFixturesReturn {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFixtures = async () => {
      setIsLoading(true);
      setError(null);

      const today = new Date();
      const twoWeeksLater = new Date();
      twoWeeksLater.setDate(today.getDate() + 14);

      const from = formatDate(today);
      const to = formatDate(twoWeeksLater);
      const season = getCurrentSeason();

      const url = `${BASE_URL}/fixtures?team=${BARCA_TEAM_ID}&from=${from}&to=${to}&season=${season}`;

      try {
        const res = await fetch(url, {
          headers: { "x-apisports-key": API_KEY },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();

        // La API devuelve errores dentro del body con status 200
        if (json.errors && Object.keys(json.errors).length > 0) {
          throw new Error(Object.values<string>(json.errors).join(", "));
        }

        const mapped: Fixture[] = (json.response ?? []).map(mapFixture);
        setFixtures(mapped);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFixtures();
  }, []);

  return { fixtures, isLoading, error };
}