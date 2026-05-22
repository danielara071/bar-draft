import { useEffect, useState } from "react";
import { supabase } from "../../../shared/services/supabaseClient";

export function useBannedWatchPartyAccess(userId?: string) {
  const [isBanned, setIsBanned] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadBanStatus = async () => {
      if (!userId) {
        if (active) setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("is_banned")
        .eq("id", userId)
        .single();

      if (!active) return;

      setIsBanned(!error && Boolean(data?.is_banned));
      setIsLoading(false);
    };

    void loadBanStatus();

    return () => {
      active = false;
    };
  }, [userId]);

  return { isBanned, isLoading };
}