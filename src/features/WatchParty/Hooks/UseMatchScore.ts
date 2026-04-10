import { useEffect, useState } from "react";
import { fetchBarcelonaMatch } from "../Services/MatchScore";
import type { MatchResponse } from "../Types/MatchTypes";

export const useMatch = () => {
  const [match, setMatch] = useState<MatchResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const getMatch = async () => {
    try {
      const data = await fetchBarcelonaMatch(true);
      setMatch(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMatch();
    const interval = setInterval(getMatch, 15000);
    return () => clearInterval(interval);
  }, []);

  return { match, loading };
};