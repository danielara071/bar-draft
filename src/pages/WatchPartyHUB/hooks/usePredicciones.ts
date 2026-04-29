import { useState, useCallback } from "react";
import { supabase } from "../../../shared/services/supabaseClient";

export interface PrediccionPayload {
  partido_id: string;
  ganador: string | null;
  goles_local: number;
  goles_visitante: number;
  goles_total: string | null;
  primer_goleador: string | null;
  resultado_medio_tiempo: number | null;
}

interface UsePrediccionesReturn {
  isLoading: boolean;
  error: string | null;
  guardar: (payload: PrediccionPayload) => Promise<boolean>;
}

export function usePredicciones(): UsePrediccionesReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const guardar = useCallback(async (payload: PrediccionPayload): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    // Obtener user_id de la sesión activa — sin esto RLS rechaza el insert
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      setError("Debes iniciar sesión para guardar predicciones.");
      setIsLoading(false);
      return false;
    }

    const { error: sbError } = await supabase.from("predicciones").insert({
      user_id: userId,                                    // requerido por RLS
      partido_id: payload.partido_id,
      ganador: payload.ganador,
      goles_local: payload.goles_local,
      goles_visitante: payload.goles_visitante,
      goles_total: payload.goles_total,
      primer_goleador: payload.primer_goleador,
      resultado_medio_tiempo: payload.resultado_medio_tiempo,
    });

    setIsLoading(false);

    if (sbError) {
      if (sbError.code === "23505") {
        setError("Ya tienes una predicción para este partido.");
      } else if (sbError.code === "42501") {
        setError("No tienes permisos para predecir.");
      } else {
        setError(sbError.message);
      }
      return false;
    }

    return true;
  }, []);

  return { isLoading, error, guardar };
}