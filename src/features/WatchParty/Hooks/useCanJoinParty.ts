import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../../shared/services/supabaseClient";

const JOIN_WINDOW_MINUTES = 5;

type CanJoinStatus = "idle" | "loading" | "allowed" | "too_early" | "finished" | "not_found" | "error";

interface UseCanJoinPartyReturn {
  canJoin: boolean;
  status: CanJoinStatus;
  minutesUntilMatch: number | null; // null si ya empezó o no hay dato
  isLoading: boolean;
  check: (fixture_id: string) => Promise<CanJoinStatus>;
}

/**
 * Verifica si el usuario puede entrar a una sala Watch Party.
 *
 * Reglas:
 * - status === 'live'  → puede entrar siempre
 * - status === 'scheduled' AND faltan ≤ JOIN_WINDOW_MINUTES → puede entrar
 * - status === 'scheduled' AND faltan > JOIN_WINDOW_MINUTES → too_early
 * - status === 'finished' → finished (la sala debería eliminarse, pero bloqueamos igual)
 */
export function useCanJoinParty(): UseCanJoinPartyReturn {
  const [status, setStatus] = useState<CanJoinStatus>("idle");
  const [minutesUntilMatch, setMinutesUntilMatch] = useState<number | null>(null);

  const check = useCallback(async (fixture_id: string): Promise<CanJoinStatus> => {
    setStatus("loading");
    setMinutesUntilMatch(null);

    try {
      const { data, error } = await supabase
        .from("fixtures")
        .select("status, match_date")
        .eq("fixture_id", fixture_id)
        .single();

      if (error || !data) {
        setStatus("not_found");
        return "not_found";
      }

      const fixtureStatus: string = data.status;

      // Partido en vivo → acceso inmediato
      if (fixtureStatus === "live") {
        setStatus("allowed");
        return "allowed";
      }

      // Partido terminado → bloquear
      if (fixtureStatus === "finished") {
        setStatus("finished");
        return "finished";
      }

      // Partido programado → calcular ventana de tiempo
      const matchDateMs = new Date(data.match_date).getTime();
      const nowMs = Date.now();
      const diffMs = matchDateMs - nowMs;
      const diffMinutes = diffMs / 1_000 / 60;

      if (diffMinutes <= JOIN_WINDOW_MINUTES) {
        setStatus("allowed");
        setMinutesUntilMatch(null);
        return "allowed";
      }

      setMinutesUntilMatch(Math.ceil(diffMinutes));
      setStatus("too_early");
      return "too_early";
    } catch {
      setStatus("error");
      return "error";
    }
  }, []);

  return {
    canJoin: status === "allowed",
    status,
    minutesUntilMatch,
    isLoading: status === "loading",
    check,
  };
}

/**
 * Versión que acepta un fixture_id y hace el check automáticamente al montar.
 * Útil para Capa 2 (WatchParty.tsx), donde el fixture_id viene de la sala.
 */
export function useCanJoinPartyAuto(fixture_id: string | null): Omit<UseCanJoinPartyReturn, "check"> {
  const { canJoin, status, minutesUntilMatch, isLoading, check } = useCanJoinParty();

  useEffect(() => {
    if (!fixture_id) return;
    void check(fixture_id);
  }, [fixture_id, check]);

  return { canJoin, status, minutesUntilMatch, isLoading };
}
