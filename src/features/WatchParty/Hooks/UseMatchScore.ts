import { useEffect, useState } from "react";
import type { LiveMatch } from "../Types/MatchTypes";

export const useMatch = () => {
  const [match, setMatch] = useState<LiveMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);

  const getMatch = async () => {
    try {
      const response = await fetch("/api/watchparty/live-match");
      const data = await response.json();

      if (!response.ok) {
        const message = typeof data?.error === "string" ? data.error : "Error fetching live match";
        throw new Error(message);
      }

      if (data && typeof data === "object" && "fixture" in data) {
        setMatch(data as LiveMatch);
        setError(null);
        setFetchedAt(Date.now());
        return;
      }

      if (data === null) {
        setMatch(null);
        setError(null);
        setFetchedAt(Date.now());
        return;
      }

      throw new Error("Unexpected live match response");
    } catch (error) {
      console.error(error);
      setMatch(null);
      setError(error instanceof Error ? error.message : "Unknown error fetching live match");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMatch();

    const intervalId = setInterval(() => {
      void getMatch();
    }, 45000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return { match, loading, error, fetchedAt };
};