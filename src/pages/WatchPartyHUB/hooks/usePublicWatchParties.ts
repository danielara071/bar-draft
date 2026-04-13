import { useEffect, useState } from "react";
import { supabase } from "../../../shared/services/supabaseClient";
import type { WatchParty, WatchPartyMatch } from "../interfaces/index.interfaces";

function mapToWatchPartyMatch(wp: WatchParty): WatchPartyMatch {
  return {
    id: wp.fixture_id,
    type: "femenil",           // ajusta según tu lógica
    title: `${wp.home_team} vs ${wp.away_team}`,
    competition: wp.name,
    time: new Date(wp.match_date).toLocaleString("es-MX", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    code: wp.code,
    home_team: wp.home_team,
    away_team: wp.away_team,
    match_date: wp.match_date,
  };
}

interface UsePublicWatchPartiesReturn {
  parties: WatchPartyMatch[];
  isLoading: boolean;
  error: string | null;
}

export function usePublicWatchParties(): UsePublicWatchPartiesReturn {
  const [parties, setParties] = useState<WatchPartyMatch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublic = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error: sbError } = await supabase
        .from("watch_parties")
        .select("*")
        .eq("privacy", "publica")
        .order("match_date", { ascending: true })
        .limit(8);

      if (sbError) {
        setError(sbError.message);
      } else {
        setParties((data as WatchParty[]).map(mapToWatchPartyMatch));
      }

      setIsLoading(false);
    };

    fetchPublic();

    // Suscripción en tiempo real para actualizar cuando se creen nuevas salas
    const channel = supabase
      .channel("public-watch-parties")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "watch_parties" },
        () => fetchPublic()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { parties, isLoading, error };
}
