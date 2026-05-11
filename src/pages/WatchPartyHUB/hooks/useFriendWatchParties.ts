import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../shared/services/supabaseClient";
import type { WatchParty, WatchPartyMatch } from "../interfaces/index.interfaces";
import { mapToWatchPartyMatch } from "../utils/mapToWatchPartyMatch";

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
  const creatorIdsRef = useRef<string[]>([]);

  useEffect(() => {
    mountedRef.current = true;

    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchParties = async () => {
      if (!mountedRef.current) return;
      setIsLoading(true);
      setError(null);

      const { data: friendIds, error: friendError } = await supabase
        .rpc("get_friend_ids", { p_user_id: userId });

      if (!mountedRef.current) return;

      if (friendError) {
        setError(friendError.message);
        setIsLoading(false);
        return;
      }

      const creatorIds: string[] = [userId, ...(friendIds ?? [])];
      creatorIdsRef.current = creatorIds;

      const { data: watchPartiesData, error: wpError } = await supabase
        .from("watch_parties")
        .select("*")
        .in("created_by", creatorIds)
        .gte("match_date", new Date().toISOString())
        .order("match_date", { ascending: true })
        .limit(10);

      if (!mountedRef.current) return;

      if (wpError) {
        setError(wpError.message);
        setIsLoading(false);
        return;
      }

      const allParties = (watchPartiesData ?? []) as WatchParty[];

      if (allParties.length === 0) {
        setParties([]);
        setIsLoading(false);
        return;
      }

      const fixtureIds = [...new Set(allParties.map((wp) => wp.fixture_id))];
      const { data: fixturesData } = await supabase
        .from("fixtures")
        .select("fixture_id, status")
        .in("fixture_id", fixtureIds);

      if (!mountedRef.current) return;

      const doneIds = new Set(
        (fixturesData ?? [])
          .filter((f) => f.status === "done" || f.status === "finished")
          .map((f) => f.fixture_id)
      );

      const active = allParties
        .filter((wp) => !doneIds.has(wp.fixture_id))
        .map(mapToWatchPartyMatch);

      setParties(active);
      setIsLoading(false);
    };

    fetchParties();

    const channel = supabase
      .channel(`friend-watch-parties-${userId}`)
      .on<WatchParty>(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "watch_parties" },
        (payload) => {
          if (!mountedRef.current) return;
          const newWp = payload.new;
          if (!creatorIdsRef.current.includes(newWp.created_by)) return;
          const newParty = mapToWatchPartyMatch(newWp);
          setParties((prev) => {
            if (prev.some((p) => p.code === newParty.code)) return prev;
            return [...prev, newParty].sort(
              (a, b) =>
                new Date(a.match_date ?? 0).getTime() -
                new Date(b.match_date ?? 0).getTime()
            );
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "fixtures" },
        (payload) => {
          if (!mountedRef.current) return;
          const updated = payload.new as { fixture_id: string; status: string };
          if (updated.status === "done" || updated.status === "finished") {
            setParties((prev) => prev.filter((p) => p.id !== updated.fixture_id));
          }
        }
      )
      .subscribe();

    return () => {
      mountedRef.current = false;
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { parties, isLoading, error };
}