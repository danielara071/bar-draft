import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../shared/services/supabaseClient";
import type { WatchParty, WatchPartyMatch } from "../interfaces/index.interfaces";

function mapToWatchPartyMatch(wp: WatchParty): WatchPartyMatch {
  return {
    id: wp.fixture_id,
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

interface UseFriendWatchPartiesReturn {
  parties: WatchPartyMatch[];
  isLoading: boolean;
  error: string | null;
}

export function useFriendWatchParties(userId: string | undefined): UseFriendWatchPartiesReturn {
  const [parties, setParties] = useState<WatchPartyMatch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetch = async () => {
      if (!mountedRef.current) return;
      setIsLoading(true);
      setError(null);

      // IDs de amigos aceptados
      const { data: friendIds, error: friendError } = await supabase
        .rpc("get_friend_ids", { p_user_id: userId });

      if (!mountedRef.current) return;

      if (friendError) {
        setError(friendError.message);
        setIsLoading(false);
        return;
      }


      //    Si no tiene amigos, solo trae las suyas propias
      const creatorIds: string[] = [userId, ...(friendIds ?? [])];

      const { data, error: wpError } = await supabase
        .from("watch_parties")
        .select("*")
        .in("created_by", creatorIds)
        .gte("match_date", new Date().toISOString())
        .order("match_date", { ascending: true })
        .limit(10);

      if (!mountedRef.current) return;

      if (wpError) {
        setError(wpError.message);
      } else {
        setParties((data as WatchParty[]).map(mapToWatchPartyMatch));
      }

      setIsLoading(false);
    };

    fetch();

    return () => {
      mountedRef.current = false;
    };
  }, [userId]);

  return { parties, isLoading, error };
}