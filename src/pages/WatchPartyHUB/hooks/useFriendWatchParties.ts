import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../shared/services/supabaseClient";
import type { WatchParty, WatchPartyMatch } from "../interfaces/index.interfaces";
import { mapToWatchPartyMatch } from "../utils/mapToWatchPartyMatch";

const WATCH_PARTY_VISIBILITY_MINUTES = 180;
const SCHEDULED_VISIBILITY_GRACE_MINUTES = 15;

type FixtureVisibilityRow = {
  fixture_id: string;
  status: string;
  match_date: string;
  category: "varonil" | "femenil";
};

function isWithinVisibilityWindow(matchDate: string): boolean {
  const matchTime = Date.parse(matchDate);
  return (
    Number.isFinite(matchTime) &&
    matchTime >= Date.now() - WATCH_PARTY_VISIBILITY_MINUTES * 60_000
  );
}

function isVisibleFixture(fixture: FixtureVisibilityRow): boolean {
  if (fixture.status === "finished") return false;

  const matchTime = Date.parse(fixture.match_date);
  if (!Number.isFinite(matchTime)) return false;

  const minutesSinceStart = (Date.now() - matchTime) / 60_000;
  if (minutesSinceStart <= 0) return true;
  if (fixture.status === "live") {
    return minutesSinceStart <= WATCH_PARTY_VISIBILITY_MINUTES;
  }

  return minutesSinceStart <= SCHEDULED_VISIBILITY_GRACE_MINUTES;
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
  const creatorIdsRef = useRef<string[]>([]);

  useEffect(() => {
    mountedRef.current = true;

    if (!userId) {
      const emptyStateId = window.setTimeout(() => {
        setParties([]);
        setIsLoading(false);
      }, 0);

      return () => {
        mountedRef.current = false;
        window.clearTimeout(emptyStateId);
      };
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
        .gte(
          "match_date",
          new Date(
            Date.now() - WATCH_PARTY_VISIBILITY_MINUTES * 60_000,
          ).toISOString(),
        )
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
        .select("fixture_id, status, match_date, category")
        .in("fixture_id", fixtureIds);

      if (!mountedRef.current) return;

      const visibleFixtures = new Map(
        ((fixturesData ?? []) as FixtureVisibilityRow[])
          .filter(isVisibleFixture)
          .map((fixture) => [fixture.fixture_id, fixture]),
      );

      const active = allParties
        .filter((wp) => visibleFixtures.has(wp.fixture_id))
        .map((wp) => ({
          ...wp,
          match_date:
            visibleFixtures.get(wp.fixture_id)?.match_date ?? wp.match_date,
        }))
        .map((wp) =>
          mapToWatchPartyMatch(
            wp,
            visibleFixtures.get(wp.fixture_id)?.category,
          ),
        );

      setParties(active);
      setIsLoading(false);
    };

    fetchParties();

    const channel = supabase
      .channel(`friend-watch-parties-${userId}`)
      .on<WatchParty>(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "watch_parties" },
        async (payload) => {
          if (!mountedRef.current) return;
          const newWp = payload.new;
          if (!creatorIdsRef.current.includes(newWp.created_by)) return;
          if (!isWithinVisibilityWindow(newWp.match_date)) return;
          const { data: fixture } = await supabase
            .from("fixtures")
            .select("category")
            .eq("fixture_id", newWp.fixture_id)
            .maybeSingle();
          if (!mountedRef.current) return;
          const newParty = mapToWatchPartyMatch(newWp, fixture?.category);
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
            setParties((prev) => prev.filter((p) => p.fixture_id !== updated.fixture_id));
          }
        }
      )
      .subscribe();

    const cleanupIntervalId = window.setInterval(() => {
      setParties((prev) =>
        prev.filter(
          (party) =>
            party.match_date && isWithinVisibilityWindow(party.match_date),
        ),
      );
    }, 60_000);

    return () => {
      mountedRef.current = false;
      window.clearInterval(cleanupIntervalId);
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { parties, isLoading, error };
}
