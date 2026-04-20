import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../shared/services/supabaseClient";
import type { WatchParty, WatchPartyMatch } from "../interfaces/index.interfaces";

function mapToWatchPartyMatch(wp: WatchParty): WatchPartyMatch {
  return {
    id: wp.fixture_id,           // string — corregido
    type: wp.fixture_id.startsWith("femenil") ? "femenil" : "varonil",
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

  // Ref para evitar setState en componente desmontado
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const fetchPublic = async () => {
      if (!mountedRef.current) return;
      setIsLoading(true);
      setError(null);

      const { data, error: sbError } = await supabase
        .from("watch_parties")
        .select("*")
        .eq("privacy", "publica")
        .order("match_date", { ascending: true })
        .limit(8);

      if (!mountedRef.current) return;

      if (sbError) {
        setError(sbError.message);
      } else {
        setParties((data as WatchParty[]).map(mapToWatchPartyMatch));
      }
      setIsLoading(false);
    };

    fetchPublic();

    // Suscripción en tiempo real — agrega la nueva sala directamente
    // sin refetch completo (más eficiente)
    const channel = supabase
      .channel("public-watch-parties-realtime")
      .on<WatchParty>(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "watch_parties", filter: "privacy=eq.publica" },
        (payload) => {
          if (!mountedRef.current) return;
          const newParty = mapToWatchPartyMatch(payload.new);
          setParties((prev) => {
            // Evitar duplicados
            if (prev.some((p) => p.code === newParty.code)) return prev;
            // Mantener límite de 8 y orden por fecha
            const updated = [...prev, newParty]
              .sort((a, b) => new Date(a.match_date ?? 0).getTime() - new Date(b.match_date ?? 0).getTime())
              .slice(0, 8);
            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      mountedRef.current = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { parties, isLoading, error };
}