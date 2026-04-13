import { useEffect, useState } from "react";
import { supabase } from "../../../shared/services/supabaseClient";
import type { WatchParty, WatchPartyMatch } from "../interfaces/index.interfaces";

function mapToWatchPartyMatch(wp: WatchParty): WatchPartyMatch {
  return {
    id: wp.fixture_id,
    type: "femenil",
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

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchFriendParties = async () => {
      setIsLoading(true);
      setError(null);

      // 1. Obtener IDs de amigos aceptados usando la función SQL helper
      const { data: friendIds, error: friendError } = await supabase
        .rpc("get_friend_ids", { p_user_id: userId });

      if (friendError) {
        setError(friendError.message);
        setIsLoading(false);
        return;
      }

      if (!friendIds || friendIds.length === 0) {
        setParties([]);
        setIsLoading(false);
        return;
      }

      // 2. Traer watch parties de esos amigos con fecha futura
      const { data, error: wpError } = await supabase
        .from("watch_parties")
        .select("*")
        .in("created_by", friendIds)
        .gte("match_date", new Date().toISOString())
        .order("match_date", { ascending: true })
        .limit(10);

      if (wpError) {
        setError(wpError.message);
      } else {
        setParties((data as WatchParty[]).map(mapToWatchPartyMatch));
      }

      setIsLoading(false);
    };

    fetchFriendParties();
  }, [userId]);

  return { parties, isLoading, error };
}
