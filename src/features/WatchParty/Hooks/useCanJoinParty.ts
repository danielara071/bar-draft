import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../../shared/services/supabaseClient";

const JOIN_WINDOW_MINUTES = 5;
const SCHEDULED_START_GRACE_MINUTES = 15;
const LIVE_ROOM_MAX_MINUTES = 180;

type CanJoinStatus =
  | "idle"
  | "loading"
  | "allowed"
  | "results_pending"
  | "too_early"
  | "finished"
  | "not_found"
  | "error";

interface UseCanJoinPartyReturn {
  canJoin: boolean;
  status: CanJoinStatus;
  minutesUntilMatch: number | null; // null si ya empezó o no hay dato
  isLoading: boolean;
  check: (
    fixture_id: string,
    options?: { background?: boolean },
  ) => Promise<CanJoinStatus>;
}

/**
 * Verifica si el usuario puede entrar a una sala Watch Party.
 *
 * Reglas:
 * - cualquier partido futuro abre JOIN_WINDOW_MINUTES antes
 * - status === 'scheduled' permite una tolerancia tras el inicio
 * - status === 'live' deja de ser válido si quedó obsoleto en la base de datos
 * - status === 'finished' → finished (la sala debería eliminarse, pero bloqueamos igual)
 */
export function useCanJoinParty(): UseCanJoinPartyReturn {
  const [status, setStatus] = useState<CanJoinStatus>("idle");
  const [minutesUntilMatch, setMinutesUntilMatch] = useState<number | null>(null);

  const check = useCallback(async (
    fixture_id: string,
    options?: { background?: boolean },
  ): Promise<CanJoinStatus> => {
    if (!options?.background) setStatus("loading");
    setMinutesUntilMatch(null);

    try {
      const { data, error } = await supabase
        .from("fixtures")
        .select("status, match_date, results_available_at")
        .eq("fixture_id", fixture_id)
        .single();

      if (error || !data) {
        setStatus("not_found");
        return "not_found";
      }

      const fixtureStatus: string = data.status;
      const matchDateMs = Date.parse(data.match_date);

      if (!Number.isFinite(matchDateMs)) {
        setStatus("error");
        return "error";
      }

      const nowMs = Date.now();
      const minutesUntilMatch = (matchDateMs - nowMs) / 60_000;
      const minutesSinceStart = (nowMs - matchDateMs) / 60_000;

      // La fecha siempre manda antes del inicio, incluso si un fixture fue
      // marcado como live por error.
      if (minutesUntilMatch > JOIN_WINDOW_MINUTES) {
        setMinutesUntilMatch(Math.ceil(minutesUntilMatch));
        setStatus("too_early");
        return "too_early";
      }

      // Un estado live antiguo no debe mantener una sala abierta para siempre.
      if (fixtureStatus === "live") {
        if (minutesSinceStart > LIVE_ROOM_MAX_MINUTES) {
          setStatus("finished");
          return "finished";
        }

        setStatus("allowed");
        return "allowed";
      }

      // Partido terminado → bloquear
      if (fixtureStatus === "finished") {
        const resultsAvailableAt = data.results_available_at
          ? Date.parse(data.results_available_at)
          : null;

        if (resultsAvailableAt !== null && resultsAvailableAt > Date.now()) {
          setStatus("results_pending");
          return "results_pending";
        }

        setStatus("finished");
        return "finished";
      }

      // Si la sincronización tarda unos minutos en cambiar scheduled a live,
      // mantenemos una tolerancia breve después del inicio.
      if (minutesSinceStart <= SCHEDULED_START_GRACE_MINUTES) {
        setStatus("allowed");
        setMinutesUntilMatch(null);
        return "allowed";
      }

      setStatus("finished");
      return "finished";
    } catch {
      setStatus("error");
      return "error";
    }
  }, []);

  return {
    canJoin: status === "allowed" || status === "results_pending",
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

    const intervalId = window.setInterval(() => {
      void check(fixture_id, { background: true });
    }, 30_000);

    return () => window.clearInterval(intervalId);
  }, [fixture_id, check]);

  return { canJoin, status, minutesUntilMatch, isLoading };
}
