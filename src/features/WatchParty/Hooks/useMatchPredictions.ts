import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../../shared/services/supabaseClient";

type PredictionItem = {
  label: string;
  value: string;
};

// Fila como viene de Supabase
interface PrediccionRow {
  ganador: string | null;
  goles_local: number | null;
  goles_visitante: number | null;
  goles_total: string | null;
  primer_goleador: string | null;
  resultado_medio_tiempo: number | null;
}

//devuelve el valor más frecuente en un array, o null si el array está vacío
function moda<T>(values: T[]): T | null {
  if (values.length === 0) return null;
  const freq = new Map<T, number>();
  for (const v of values) freq.set(v, (freq.get(v) ?? 0) + 1);
  return [...freq.entries()].reduce((a, b) => (b[1] > a[1] ? b : a))[0];
}

function labelMedioTiempo(value: number): string {
  if (value === 1) return "Local gana";
  if (value === -1) return "Visitante gana";
  return "Empate";
}

//default en caso de no haber predicciones
function buildPopularPredictions(rows: PrediccionRow[]): PredictionItem[] {
  if (rows.length === 0) {
    return [
      { label: "Ganador", value: "Sin predicciones aún" },
      { label: "Marcador final", value: "Sin predicciones aún" },
      { label: "Total de goles", value: "Sin predicciones aún" },
    ];
  }

  const ganadores = rows.map((r) => r.ganador).filter(Boolean) as string[];
  const golesTotal = rows.map((r) => r.goles_total).filter(Boolean) as string[];
  const primerGoleador = rows.map((r) => r.primer_goleador).filter(Boolean) as string[];
  const medioTiempo = rows.map((r) => r.resultado_medio_tiempo).filter((v) => v !== null) as number[];

  const items: PredictionItem[] = [];

  // 1. Ganador más votado
  const ganadorModa = moda(ganadores);
  items.push({
    label: "Ganador más votado",
    value: ganadorModa ?? "Sin datos",
  });

  // 2. Marcador más votado (local - visitante)
  const marcadores = rows
    .filter((r) => r.goles_local !== null && r.goles_visitante !== null)
    .map((r) => `${r.goles_local} - ${r.goles_visitante}`);
  const marcadorModa = moda(marcadores);
  items.push({
    label: "Marcador más votado",
    value: marcadorModa ?? "Sin datos",
  });

  // 3. Total de goles más votado
  const totalModa = moda(golesTotal);
  items.push({
    label: "Total de goles más votado",
    value: totalModa ?? "Sin datos",
  });

  // 4. Primer goleador más votado (solo si hay datos)
  const goleadorModa = moda(primerGoleador);
  if (goleadorModa) {
    items.push({
      label: "Primer goleador más votado",
      value: goleadorModa,
    });
  }

  // 5. Resultado al medio tiempo más votado (solo si hay datos)
  const medioTiempoModa = moda(medioTiempo);
  if (medioTiempoModa !== null) {
    items.push({
      label: "Medio tiempo más votado",
      value: labelMedioTiempo(medioTiempoModa),
    });
  }

  return items;
}

interface UseMatchPredictionsReturn {
  predictions: PredictionItem[];
  isLoading: boolean;
  totalVotes: number;
  refetch: () => void;
}

export function useMatchPredictions(fixture_id: string | null): UseMatchPredictionsReturn {
  const [predictions, setPredictions] = useState<PredictionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);

  const fetchPredictions = useCallback(async () => {
    if (!fixture_id) {
      setPredictions([]);
      setTotalVotes(0);
      return;
    }

    setIsLoading(true);

    const { data, error } = await supabase
      .from("predicciones")
      .select(
        "ganador, goles_local, goles_visitante, goles_total, primer_goleador, resultado_medio_tiempo"
      )
      .eq("partido_id", fixture_id);

    if (error || !data) {
      setPredictions([
        { label: "Ganador más votado", value: "Error al cargar" },
        { label: "Marcador más votado", value: "Error al cargar" },
        { label: "Total de goles más votado", value: "Error al cargar" },
      ]);
      setIsLoading(false);
      return;
    }

    setTotalVotes(data.length);
    setPredictions(buildPopularPredictions(data as PrediccionRow[]));
    setIsLoading(false);
  }, [fixture_id]);

  useEffect(() => {
    void fetchPredictions();

    // Refrescar cada 2 minutos para mostrar cambios en tiempo casi-real
    const intervalId = setInterval(() => void fetchPredictions(), 2 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [fetchPredictions]);

  return { predictions, isLoading, totalVotes, refetch: fetchPredictions };
}