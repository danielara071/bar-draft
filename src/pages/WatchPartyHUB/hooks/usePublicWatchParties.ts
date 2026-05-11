import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../shared/services/supabaseClient";
import type { WatchParty, WatchPartyMatch } from "../interfaces/index.interfaces";
import { mapToWatchPartyMatch } from "../utils/mapToWatchPartyMatch";

interface UsePublicWatchPartiesReturn {
  parties: WatchPartyMatch[];
  isLoading: boolean;
  error: string | null;
}

export function usePublicWatchParties(): UsePublicWatchPartiesReturn {
  const [parties, setParties] = useState<WatchPartyMatch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const fetchPublic = async () => {
      if (!mountedRef.current) return;
      setIsLoading(true);
      setError(null);

      const { data: watchPartiesData, error: wpError } = await supabase
        .from("watch_parties")
        .select("*")
        .eq("privacy", "publica")
        .order("match_date", { ascending: true })
        .limit(8);

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

    fetchPublic();

    const channel = supabase
      .channel("public-watch-parties-realtime")
      .on<WatchParty>(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "watch_parties", filter: "privacy=eq.publica" },
        (payload) => {
          if (!mountedRef.current) return;
          const newParty = mapToWatchPartyMatch(payload.new);
          setParties((prev) => {
            if (prev.some((p) => p.code === newParty.code)) return prev;
            return [...prev, newParty]
              .sort((a, b) => new Date(a.match_date ?? 0).getTime() - new Date(b.match_date ?? 0).getTime())
              .slice(0, 8);
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
  }, []);

  return { parties, isLoading, error };
}