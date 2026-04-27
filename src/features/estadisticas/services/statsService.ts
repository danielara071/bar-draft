import { supabase } from "../../../shared/services/supabaseClient";
import type {
  AssisterCardData,
  DashboardStats,
  KeeperCardData,
  RankingItem,
  ScorerCardData,
  TeamType,
} from "../types";

type MesRow = { mes: string; año: number | null; goles: number | null };

function last4<T>(arr: T[]) {
  return arr.slice(Math.max(0, arr.length - 4));
}

function toLabel(mes: string) {
  const m = (mes ?? "").trim();
  return m.length > 3 ? m.slice(0, 3) : m;
}

function monthIndex(mes: string) {
  const key = (mes ?? "").trim().toLowerCase();
  const map: Record<string, number> = {
    ene: 1,
    enero: 1,
    feb: 2,
    febrero: 2,
    mar: 3,
    marzo: 3,
    abr: 4,
    abril: 4,
    may: 5,
    mayo: 5,
    jun: 6,
    junio: 6,
    jul: 7,
    julio: 7,
    ago: 8,
    agosto: 8,
    sep: 9,
    set: 9,
    septiembre: 9,
    setiembre: 9,
    oct: 10,
    octubre: 10,
    nov: 11,
    noviembre: 11,
    dic: 12,
    diciembre: 12,
  };
  return map[key] ?? 0;
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
    .select("*")
    .eq(idCol, top.id);

  if (rowsErr) throw rowsErr;

  const orderedRows = ((rows ?? []) as MesRow[]).sort((a, b) => {
    const yearA = a.año ?? 0;
    const yearB = b.año ?? 0;
    if (yearA !== yearB) return yearA - yearB;
    return monthIndex(a.mes) - monthIndex(b.mes);
  });

  const series = last4(orderedRows).map((r) => ({
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

async function fetchTopFiveByMetric(
  team: TeamType,
  metric: "goles" | "asistencias"
): Promise<RankingItem[]> {
  const table =
    team === "male" ? "barcelona_varonil_jugadores" : "barcelona_femenil_jugadores";

  const { data, error } = await supabase
    .from(table)
    .select(`id,nombre,${metric},minutos_jugados`)
    .order(metric, { ascending: false })
    .order("minutos_jugados", { ascending: false })
    .limit(5);

  if (error) throw error;
  return (data ?? []).map((row) => {
    const value =
      metric === "goles"
        ? ((row as { goles?: number | null }).goles ?? 0)
        : ((row as { asistencias?: number | null }).asistencias ?? 0);

    return {
    id: row.id,
    nombre: row.nombre,
    value,
  };
  });
}

async function fetchTopFiveKeepersBySaves(team: TeamType): Promise<RankingItem[]> {
  const table =
    team === "male" ? "barcelona_varonil_jugadores" : "barcelona_femenil_jugadores";

  const { data, error } = await supabase
    .from(table)
    .select("id,nombre,atajadas,goles_recibidos,posicion,minutos_jugados")
    .or("posicion.ilike.%porter%,posicion.ilike.%goalkeeper%");

  if (error) throw error;

  const ranked = (data ?? [])
    .map((row) => ({
      id: row.id,
      nombre: row.nombre,
      value: row.atajadas ?? 0,
      minutes: row.minutos_jugados ?? 0,
    }))
    .sort((a, b) => (b.value !== a.value ? b.value - a.value : b.minutes - a.minutes))
    .slice(0, 5)
    .map(({ id, nombre, value }) => ({ id, nombre, value }));

  return ranked;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const [
    maleScorer,
    femaleScorer,
    maleAssists,
    femaleAssists,
    maleKeeper,
    femaleKeeper,
    maleScorerTop5,
    femaleScorerTop5,
    maleAssisterTop5,
    femaleAssisterTop5,
    maleKeeperTop5,
    femaleKeeperTop5,
  ] = await Promise.all([
    fetchTopScorer("male"),
    fetchTopScorer("female"),
    fetchTopAssister("male"),
    fetchTopAssister("female"),
    fetchTopKeeper("male"),
    fetchTopKeeper("female"),
    fetchTopFiveByMetric("male", "goles"),
    fetchTopFiveByMetric("female", "goles"),
    fetchTopFiveByMetric("male", "asistencias"),
    fetchTopFiveByMetric("female", "asistencias"),
    fetchTopFiveKeepersBySaves("male"),
    fetchTopFiveKeepersBySaves("female"),
  ]);

  return {
    scorers: { male: maleScorer, female: femaleScorer },
    assisters: { male: maleAssists, female: femaleAssists },
    keepers: { male: maleKeeper, female: femaleKeeper },
    rankings: {
      scorers: { male: maleScorerTop5, female: femaleScorerTop5 },
      assisters: { male: maleAssisterTop5, female: femaleAssisterTop5 },
      keepers: { male: maleKeeperTop5, female: femaleKeeperTop5 },
    },
  };
}

