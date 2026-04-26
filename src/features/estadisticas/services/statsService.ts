import { supabase } from "../../../shared/services/supabaseClient";
import type {
  AssisterCardData,
  DashboardStats,
  KeeperCardData,
  ScorerCardData,
  TeamType,
} from "../types";

type MesRow = { mes: string; goles: number | null };

function last4<T>(arr: T[]) {
  return arr.slice(Math.max(0, arr.length - 4));
}

function toLabel(mes: string) {
  const m = (mes ?? "").trim();
  return m.length > 3 ? m.slice(0, 3) : m;
}

function efectividadPct(atajadas: number, golesRecibidos: number) {
  const denom = Math.max(0, atajadas) + Math.max(0, golesRecibidos);
  if (!denom) return 0;
  return Math.round((Math.max(0, atajadas) / denom) * 100);
}

async function fetchTopScorer(team: TeamType): Promise<ScorerCardData | null> {
  const table =
    team === "male" ? "barcelona_varonil_jugadores" : "barcelona_femenil_jugadores";
  const mesTable =
    team === "male" ? "estadisticas_mes_varonil" : "estadisticas_mes_femenil";
  const idCol = team === "male" ? "jugador_id" : "jugadora_id";

  const { data, error } = await supabase
    .from(table)
    .select("id,nombre,imagen_url,goles,minutos_jugados")
    .order("goles", { ascending: false })
    .order("minutos_jugados", { ascending: false })
    .limit(1);

  if (error) throw error;
  const top = data?.[0];
  if (!top) return null;

  const { data: rows, error: rowsErr } = await supabase
    .from(mesTable)
    .select("mes,goles")
    .eq(idCol, top.id)
    .order("mes", { ascending: true });

  if (rowsErr) throw rowsErr;

  const series = last4((rows ?? []) as MesRow[]).map((r) => ({
    label: toLabel(r.mes),
    value: r.goles ?? 0,
  }));

  return {
    player: { id: top.id, nombre: top.nombre, imagen_url: top.imagen_url ?? null },
    totalGoles: top.goles ?? 0,
    series,
  };
}

async function fetchTopAssister(team: TeamType): Promise<AssisterCardData | null> {
  const table =
    team === "male" ? "barcelona_varonil_jugadores" : "barcelona_femenil_jugadores";

  const { data, error } = await supabase
    .from(table)
    .select("id,nombre,imagen_url,asistencias,minutos_jugados")
    .order("asistencias", { ascending: false })
    .order("minutos_jugados", { ascending: false })
    .limit(1);

  if (error) throw error;
  const top = data?.[0];
  if (!top) return null;

  return {
    player: { id: top.id, nombre: top.nombre, imagen_url: top.imagen_url ?? null },
    totalAsistencias: top.asistencias ?? 0,
  };
}

async function fetchTopKeeper(team: TeamType): Promise<KeeperCardData | null> {
  const table =
    team === "male" ? "barcelona_varonil_jugadores" : "barcelona_femenil_jugadores";

  const { data, error } = await supabase
    .from(table)
    .select(
      "id,nombre,imagen_url,atajadas,goles_recibidos,posicion,minutos_jugados"
    )
    .or("posicion.ilike.%porter%,posicion.ilike.%goalkeeper%")
    .order("atajadas", { ascending: false })
    .order("minutos_jugados", { ascending: false })
    .limit(1);

  if (error) throw error;
  let topKeeper = data?.[0] ?? null;

  if (!topKeeper) {
    const { data: fallback, error: fallbackErr } = await supabase
      .from(table)
      .select(
        "id,nombre,imagen_url,atajadas,goles_recibidos,posicion,minutos_jugados"
      )
      .order("atajadas", { ascending: false })
      .order("minutos_jugados", { ascending: false })
      .limit(1);

    if (fallbackErr) throw fallbackErr;
    topKeeper = fallback?.[0] ?? null;
  }

  if (!topKeeper) return null;

  const pct = efectividadPct(
    topKeeper.atajadas ?? 0,
    topKeeper.goles_recibidos ?? 0
  );
  return {
    player: {
      id: topKeeper.id,
      nombre: topKeeper.nombre,
      imagen_url: topKeeper.imagen_url ?? null,
    },
    efectividadPct: pct,
  };
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const [maleScorer, femaleScorer, maleAssists, femaleAssists, maleKeeper, femaleKeeper] =
    await Promise.all([
      fetchTopScorer("male"),
      fetchTopScorer("female"),
      fetchTopAssister("male"),
      fetchTopAssister("female"),
      fetchTopKeeper("male"),
      fetchTopKeeper("female"),
    ]);

  return {
    scorers: { male: maleScorer, female: femaleScorer },
    assisters: { male: maleAssists, female: femaleAssists },
    keepers: { male: maleKeeper, female: femaleKeeper },
  };
}

