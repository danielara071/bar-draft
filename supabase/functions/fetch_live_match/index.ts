import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESULTS_WINDOW_MINUTES = 30;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type ApiFixture = {
  fixture: {
    id: number;
    date: string;
    status: { short: string; elapsed: number | null };
    venue: { name: string | null; city: string | null };
  };
  league: { name: string; round: string };
  teams: {
    home: { name: string };
    away: { name: string };
  };
  goals: { home: number | null; away: number | null };
  score: {
    halftime: { home: number | null; away: number | null };
  };
};

type ApiEvent = {
  time?: { elapsed?: number | null; extra?: number | null };
  player?: { name?: string | null };
  type?: string;
};

const finishedStatuses = new Set(["FT", "AET", "PEN"]);
const liveStatuses = new Set(["1H", "HT", "2H", "ET", "BT", "P", "SUSP", "INT"]);

function toFixtureStatus(statusShort: string) {
  if (finishedStatuses.has(statusShort)) return "finished";
  if (liveStatuses.has(statusShort)) return "live";
  return "scheduled";
}

function deriveWinner(fixture: ApiFixture): string | null {
  const home = fixture.goals.home;
  const away = fixture.goals.away;
  if (home == null || away == null) return null;
  if (home === away) return "Empate";
  return home > away ? fixture.teams.home.name : fixture.teams.away.name;
}

function deriveHalftimeResult(fixture: ApiFixture): number | null {
  const home = fixture.score.halftime.home;
  const away = fixture.score.halftime.away;
  if (home == null || away == null) return null;
  if (home === away) return 0;
  return home > away ? 1 : -1;
}

async function fetchFirstScorer(
  fixtureId: number,
  apiKey: string,
): Promise<{ complete: boolean; name: string | null }> {
  const response = await fetch(
    `https://v3.football.api-sports.io/fixtures/events?fixture=${fixtureId}`,
    { headers: { "x-apisports-key": apiKey } },
  );

  if (!response.ok) {
    console.error(`No se pudieron consultar eventos de ${fixtureId}: ${response.status}`);
    return { complete: false, name: null };
  }

  const payload = await response.json();
  const goals = ((payload.response ?? []) as ApiEvent[])
    .filter((event) => event.type === "Goal")
    .sort((a, b) => {
      const aMinute = (a.time?.elapsed ?? 0) * 100 + (a.time?.extra ?? 0);
      const bMinute = (b.time?.elapsed ?? 0) * 100 + (b.time?.extra ?? 0);
      return aMinute - bMinute;
    });

  return { complete: true, name: goals[0]?.player?.name?.trim() || null };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const apiKey = Deno.env.get("API_FOOTBALL_KEY") ?? "";

    if (!supabaseUrl || !serviceRoleKey || !apiKey) {
      throw new Error("Faltan variables requeridas para sincronizar partidos");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const now = new Date();
    const windowStart = new Date(now.getTime() - 240 * 60 * 1000).toISOString();
    const windowEnd = new Date(now.getTime() + 10 * 60 * 1000).toISOString();

    const { data: activeMatches, error: scheduleError } = await supabase
      .from("matches_schedule")
      .select("fixture_id, match_date, status_short")
      .gte("match_date", windowStart)
      .lte("match_date", windowEnd);

    if (scheduleError) throw scheduleError;

    const processed: number[] = [];

    for (const scheduledMatch of activeMatches ?? []) {
      const apiResponse = await fetch(
        `https://v3.football.api-sports.io/fixtures?id=${scheduledMatch.fixture_id}`,
        { headers: { "x-apisports-key": apiKey } },
      );

      if (!apiResponse.ok) {
        console.error(
          `API-Football fallo para ${scheduledMatch.fixture_id}: ${apiResponse.status}`,
        );
        continue;
      }

      const payload = await apiResponse.json();
      const fixture = payload.response?.[0] as ApiFixture | undefined;
      if (!fixture) continue;

      const fixtureStatus = toFixtureStatus(fixture.fixture.status.short);
      const isFinished = fixtureStatus === "finished";
      const firstScorer = isFinished
        ? await fetchFirstScorer(fixture.fixture.id, apiKey)
        : { complete: false, name: null };
      const halftimeResult = deriveHalftimeResult(fixture);
      const winner = deriveWinner(fixture);
      const scoresComplete =
        fixture.goals.home != null &&
        fixture.goals.away != null &&
        halftimeResult != null &&
        winner != null;

      const { error: cacheError } = await supabase
        .from("live_match_cache")
        .upsert(
          {
            fixture_id: fixture.fixture.id,
            fixture_date: fixture.fixture.date,
            status_elapsed: fixture.fixture.status.elapsed,
            venue_name: fixture.fixture.venue.name,
            venue_city: fixture.fixture.venue.city,
            league_name: fixture.league.name,
            league_round: fixture.league.round,
            home_team_name: fixture.teams.home.name,
            away_team_name: fixture.teams.away.name,
            goals_home: fixture.goals.home,
            goals_away: fixture.goals.away,
            source_payload: fixture,
            fetched_at: now.toISOString(),
          },
          { onConflict: "fixture_id" },
        );

      if (cacheError) {
        console.error(`No se pudo actualizar cache de ${fixture.fixture.id}`, cacheError);
        continue;
      }

      const { data: mappedFixtures, error: fixtureLookupError } = await supabase
        .from("fixtures")
        .select("fixture_id, finished_at, results_available_at")
        .or(
          `api_fixture_id.eq.${fixture.fixture.id},fixture_id.eq.${fixture.fixture.id}`,
        )
        .limit(1);

      if (fixtureLookupError) {
        console.error(
          `No se pudo buscar mapping para API fixture ${fixture.fixture.id}`,
          fixtureLookupError,
        );
        continue;
      }

      let dbFixture = mappedFixtures?.[0];

      if (!dbFixture) {
        const fixtureDate = Date.parse(fixture.fixture.date);
        const dateStart = new Date(fixtureDate - 12 * 60 * 60 * 1000).toISOString();
        const dateEnd = new Date(fixtureDate + 12 * 60 * 60 * 1000).toISOString();
        const { data: dateMatchedFixtures, error: dateMatchError } =
          await supabase
            .from("fixtures")
            .select("fixture_id, finished_at, results_available_at")
            .eq("home_team", fixture.teams.home.name)
            .eq("away_team", fixture.teams.away.name)
            .gte("match_date", dateStart)
            .lte("match_date", dateEnd)
            .order("match_date", { ascending: true })
            .limit(1);

        if (dateMatchError) {
          console.error(
            `No se pudo vincular API fixture ${fixture.fixture.id} por fecha y equipos`,
            dateMatchError,
          );
          continue;
        }

        dbFixture = dateMatchedFixtures?.[0];
      }

      if (!dbFixture) {
        console.error(
          `No existe fixture local para API fixture ${fixture.fixture.id}`,
        );
        continue;
      }

      const finishedAt = isFinished
        ? dbFixture.finished_at ?? now.toISOString()
        : null;
      const resultsAvailableAt = isFinished
        ? dbFixture.results_available_at ??
          new Date(
            new Date(finishedAt as string).getTime() +
              RESULTS_WINDOW_MINUTES * 60 * 1000,
          ).toISOString()
        : null;

      const { error: fixtureUpdateError } = await supabase
        .from("fixtures")
        .update({
          api_fixture_id: fixture.fixture.id,
          status: fixtureStatus,
          home_goals: fixture.goals.home,
          away_goals: fixture.goals.away,
          total_goals:
            fixture.goals.home != null && fixture.goals.away != null
              ? fixture.goals.home + fixture.goals.away
              : null,
          winner,
          first_scorer: isFinished ? firstScorer.name : null,
          halftime_result: halftimeResult,
          finished_at: finishedAt,
          results_available_at: resultsAvailableAt,
          official_results_complete:
            isFinished && scoresComplete && firstScorer.complete,
          updated_at: now.toISOString(),
        })
        .eq("fixture_id", dbFixture.fixture_id);

      if (fixtureUpdateError) {
        console.error(`No se pudo actualizar fixture ${dbFixture.fixture_id}`, fixtureUpdateError);
        continue;
      }

      await supabase
        .from("matches_schedule")
        .update({
          status_short: fixture.fixture.status.short,
          updated_at: now.toISOString(),
        })
        .eq("fixture_id", fixture.fixture.id);

      if (
        isFinished &&
        resultsAvailableAt &&
        Date.parse(resultsAvailableAt) <= now.getTime() &&
        scoresComplete &&
        firstScorer.complete
      ) {
        const { error: settlementError } = await supabase.rpc(
          "finalize_fixture_predictions",
          { p_fixture_id: dbFixture.fixture_id },
        );

        if (settlementError) {
          console.error(
            `No se pudo liquidar ${dbFixture.fixture_id}`,
            settlementError,
          );
        }
      }

      processed.push(fixture.fixture.id);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        fixtures_actualizados: processed,
        results_window_minutes: RESULTS_WINDOW_MINUTES,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("Error fatal en fetch_live_match", error);
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
