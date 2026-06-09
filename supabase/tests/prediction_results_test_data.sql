-- Prediction results test data.
-- The script uses the first existing profile as the test user.
-- Run section 1 once, then use sections 2-4 independently.

-- ============================================================
-- 1. Base fixtures, predictions and watch party
-- ============================================================
do $$
declare
  test_user_id uuid;
begin
  select id into test_user_id
  from public.profiles
  order by email nulls last
  limit 1;

  if test_user_id is null then
    raise exception 'Create at least one authenticated user before running test data';
  end if;

  insert into public.fixtures (
    fixture_id,
    api_fixture_id,
    category,
    match_date,
    home_team,
    away_team,
    competition,
    venue,
    status
  )
  values (
    'test-watchparty-window',
    990000001,
    'varonil',
    now() - interval '2 hours',
    'FC Barcelona',
    'Equipo Prueba',
    'Partido de prueba - cierre automatico',
    'Estadi de prueba',
    'live'
  )
  on conflict (fixture_id) do nothing;

  insert into public.live_match_cache (
    fixture_id,
    fixture_date,
    status_elapsed,
    venue_name,
    venue_city,
    league_name,
    league_round,
    home_team_name,
    away_team_name,
    goals_home,
    goals_away,
    source_payload,
    fetched_at
  )
  values (
    990000001,
    now() - interval '2 hours',
    90,
    'Estadi de prueba',
    'Barcelona',
    'Competicion de prueba',
    'Final',
    'FC Barcelona',
    'Equipo Prueba',
    2,
    1,
    '{}'::jsonb,
    now()
  )
  on conflict (fixture_id) do update
  set goals_home = excluded.goals_home,
      goals_away = excluded.goals_away,
      fetched_at = excluded.fetched_at;

  insert into public.watch_parties (
    code,
    name,
    fixture_id,
    home_team,
    away_team,
    match_date,
    privacy,
    created_by
  )
  values (
    'TST-3001',
    'Prueba cierre automatico',
    'test-watchparty-window',
    'FC Barcelona',
    'Equipo Prueba',
    now() - interval '2 hours',
    'publica',
    test_user_id
  )
  on conflict (code) do nothing;

  insert into public.predicciones (
    partido_id,
    ganador,
    goles_local,
    goles_visitante,
    goles_total,
    primer_goleador,
    resultado_medio_tiempo,
    user_id
  )
  values (
    'test-watchparty-window',
    'FC Barcelona',
    2,
    1,
    '2-3',
    'Jugador Prueba',
    1,
    test_user_id
  )
  on conflict (user_id, partido_id) do nothing;

  insert into public.fixtures (
    fixture_id,
    api_fixture_id,
    category,
    match_date,
    home_team,
    away_team,
    competition,
    status,
    home_goals,
    away_goals,
    total_goals,
    winner,
    first_scorer,
    halftime_result,
    finished_at,
    results_available_at,
    official_results_complete
  )
  values (
    'test-history-perfect',
    990000002,
    'femenil',
    now() - interval '3 days',
    'FC Barcelona Femeni',
    'Rival Prueba',
    'Partido de prueba - historial perfecto',
    'finished',
    3,
    0,
    3,
    'FC Barcelona Femeni',
    'Jugadora Prueba',
    1,
    now() - interval '3 days',
    now() - interval '3 days' + interval '30 minutes',
    true
  )
  on conflict (fixture_id) do nothing;

  insert into public.predicciones (
    partido_id,
    ganador,
    goles_local,
    goles_visitante,
    goles_total,
    primer_goleador,
    resultado_medio_tiempo,
    user_id
  )
  values (
    'test-history-perfect',
    'FC Barcelona Femeni',
    3,
    0,
    '2-3',
    'Jugadora Prueba',
    1,
    test_user_id
  )
  on conflict (user_id, partido_id) do nothing;

  insert into public.fixtures (
    fixture_id,
    api_fixture_id,
    category,
    match_date,
    home_team,
    away_team,
    competition,
    status,
    home_goals,
    away_goals,
    total_goals,
    winner,
    first_scorer,
    halftime_result,
    finished_at,
    results_available_at,
    official_results_complete
  )
  values (
    'test-history-no-prediction',
    990000003,
    'varonil',
    now() - interval '5 days',
    'FC Barcelona',
    'Rival sin prediccion',
    'Partido de prueba - sin prediccion',
    'finished',
    1,
    1,
    2,
    'Empate',
    'Jugador Rival',
    0,
    now() - interval '5 days',
    now() - interval '5 days' + interval '30 minutes',
    true
  )
  on conflict (fixture_id) do nothing;
end;
$$;

-- Create the historical perfect settlement. Repeating this call is safe.
select *
from public.finalize_fixture_predictions('test-history-perfect');

-- ============================================================
-- 2. Global statistics contract
-- ============================================================
select *
from public.get_fixture_prediction_stats('test-watchparty-window');

-- ============================================================
-- 3. Simulate expiration while the user is inside TST-3001
-- ============================================================
-- Open /watchParty/TST-3001 before executing this update.
update public.fixtures
set status = 'finished',
    home_goals = 2,
    away_goals = 1,
    total_goals = 3,
    winner = 'FC Barcelona',
    first_scorer = 'Jugador Prueba',
    halftime_result = 1,
    finished_at = now() - interval '31 minutes',
    results_available_at = now() - interval '1 minute',
    official_results_complete = true,
    updated_at = now()
where fixture_id = 'test-watchparty-window';

select *
from public.finalize_fixture_predictions('test-watchparty-window');

-- ============================================================
-- 4. Idempotency checks
-- ============================================================
-- Both calls must return settlements_created = 0 and xp_awarded = 0
-- after the first successful settlement.
select *
from public.finalize_fixture_predictions('test-watchparty-window');
select *
from public.finalize_fixture_predictions('test-watchparty-window');

select
  fixture_id,
  user_id,
  count(*) as settlement_count,
  sum(xp_awarded) as recorded_xp
from public.prediction_settlements
where fixture_id in ('test-watchparty-window', 'test-history-perfect')
group by fixture_id, user_id;

