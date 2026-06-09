-- Prediction results, statistics and idempotent XP settlement.

alter table public.fixtures
  add column if not exists api_fixture_id bigint,
  add column if not exists finished_at timestamptz,
  add column if not exists results_available_at timestamptz,
  add column if not exists results_finalized_at timestamptz,
  add column if not exists official_results_complete boolean not null default false;

create unique index if not exists fixtures_api_fixture_id_key
  on public.fixtures(api_fixture_id)
  where api_fixture_id is not null;

create table if not exists public.prediction_settlements (
  id uuid primary key default gen_random_uuid(),
  prediction_id uuid not null unique
    references public.predicciones(id) on delete restrict,
  fixture_id text not null
    references public.fixtures(fixture_id) on delete restrict,
  user_id uuid not null
    references public.profiles(id) on delete cascade,
  prediction_snapshot jsonb not null,
  official_result jsonb not null,
  winner_correct boolean not null,
  score_correct boolean not null,
  goals_range_correct boolean not null,
  first_scorer_correct boolean not null,
  halftime_correct boolean not null,
  all_correct boolean not null,
  xp_awarded smallint not null default 0
    check (xp_awarded in (0, 200)),
  evaluated_at timestamptz not null default now(),
  check (
    all_correct = (
      winner_correct
      and score_correct
      and goals_range_correct
      and first_scorer_correct
      and halftime_correct
    )
  ),
  check (
    (all_correct and xp_awarded = 200)
    or (not all_correct and xp_awarded = 0)
  )
);

create index if not exists prediction_settlements_user_history_idx
  on public.prediction_settlements(user_id, evaluated_at desc);

create index if not exists prediction_settlements_fixture_idx
  on public.prediction_settlements(fixture_id);

alter table public.prediction_settlements enable row level security;

drop policy if exists "Users read own prediction settlements"
  on public.prediction_settlements;

create policy "Users read own prediction settlements"
  on public.prediction_settlements
  for select
  to authenticated
  using (auth.uid() = user_id);

grant select on public.prediction_settlements to authenticated;

-- Predictions become immutable once the match starts.
drop policy if exists "Usuario inserta sus predicciones" on public.predicciones;
drop policy if exists "Usuario actualiza sus predicciones" on public.predicciones;
drop policy if exists "Usuario borra sus predicciones" on public.predicciones;

create policy "Usuario inserta sus predicciones"
  on public.predicciones
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.fixtures f
      where f.fixture_id = partido_id
        and f.status in ('scheduled', 'live')
        and f.results_finalized_at is null
    )
  );

create policy "Usuario actualiza sus predicciones"
  on public.predicciones
  for update
  to authenticated
  using (
    auth.uid() = user_id
    and exists (
      select 1
      from public.fixtures f
      where f.fixture_id = partido_id
        and f.status = 'scheduled'
        and now() < f.match_date
    )
  )
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.fixtures f
      where f.fixture_id = partido_id
        and f.status = 'scheduled'
        and now() < f.match_date
    )
  );

create policy "Usuario borra sus predicciones"
  on public.predicciones
  for delete
  to authenticated
  using (
    auth.uid() = user_id
    and exists (
      select 1
      from public.fixtures f
      where f.fixture_id = partido_id
        and f.status = 'scheduled'
        and now() < f.match_date
    )
  );

create or replace function public.get_fixture_prediction_stats(
  p_fixture_id text
)
returns table (
  fixture_id text,
  total_predictions bigint,
  winner_distribution jsonb,
  average_home_goals numeric,
  average_away_goals numeric,
  most_common_score text,
  goals_range_distribution jsonb,
  most_common_first_scorer text,
  halftime_distribution jsonb
)
language sql
stable
security invoker
set search_path = public
as $$
  with fixture as (
    select f.fixture_id, f.home_team, f.away_team
    from public.fixtures f
    where f.fixture_id = p_fixture_id
  ),
  prediction_rows as (
    select
      p.*,
      lower(trim(coalesce(p.ganador, ''))) as normalized_winner
    from public.predicciones p
    where p.partido_id = p_fixture_id
  ),
  totals as (
    select
      count(*)::bigint as total_predictions,
      avg(goles_local)::numeric(10, 2) as average_home_goals,
      avg(goles_visitante)::numeric(10, 2) as average_away_goals
    from prediction_rows
  ),
  winner_counts as (
    select jsonb_build_object(
      'home', count(*) filter (
        where pr.normalized_winner = lower(trim(f.home_team))
      ),
      'draw', count(*) filter (
        where pr.normalized_winner in ('empate', 'draw')
      ),
      'away', count(*) filter (
        where pr.normalized_winner = lower(trim(f.away_team))
      )
    ) as value
    from fixture f
    left join prediction_rows pr on true
    group by f.home_team, f.away_team
  ),
  score_mode as (
    select concat(goles_local, ' - ', goles_visitante) as value
    from prediction_rows
    where goles_local is not null and goles_visitante is not null
    group by goles_local, goles_visitante
    order by count(*) desc, goles_local, goles_visitante
    limit 1
  ),
  range_counts as (
    select coalesce(
      jsonb_object_agg(goles_total, amount),
      '{}'::jsonb
    ) as value
    from (
      select goles_total, count(*) as amount
      from prediction_rows
      where goles_total is not null
      group by goles_total
    ) grouped_ranges
  ),
  scorer_mode as (
    select primer_goleador as value
    from prediction_rows
    where nullif(trim(primer_goleador), '') is not null
    group by primer_goleador
    order by count(*) desc, primer_goleador
    limit 1
  ),
  halftime_counts as (
    select jsonb_build_object(
      'home', count(*) filter (where resultado_medio_tiempo = 1),
      'draw', count(*) filter (where resultado_medio_tiempo = 0),
      'away', count(*) filter (where resultado_medio_tiempo = -1)
    ) as value
    from prediction_rows
  )
  select
    p_fixture_id,
    t.total_predictions,
    coalesce(w.value, '{"home":0,"draw":0,"away":0}'::jsonb),
    t.average_home_goals,
    t.average_away_goals,
    s.value,
    r.value,
    g.value,
    h.value
  from totals t
  left join winner_counts w on true
  left join score_mode s on true
  left join range_counts r on true
  left join scorer_mode g on true
  left join halftime_counts h on true;
$$;

create or replace function public.finalize_fixture_predictions(
  p_fixture_id text
)
returns table (
  fixture_id text,
  settlements_created integer,
  xp_awarded integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  target_fixture public.fixtures%rowtype;
begin
  -- Serializes repeated or concurrent executions for the same fixture.
  perform pg_advisory_xact_lock(hashtextextended(p_fixture_id, 0));

  select *
  into target_fixture
  from public.fixtures f
  where f.fixture_id = p_fixture_id
  for update;

  if not found then
    raise exception 'Fixture % does not exist', p_fixture_id;
  end if;

  if target_fixture.status <> 'finished' then
    raise exception 'Fixture % is not finished', p_fixture_id;
  end if;

  if target_fixture.results_available_at is null
     or target_fixture.results_available_at > now() then
    raise exception 'Results for fixture % are not available yet', p_fixture_id;
  end if;

  if not target_fixture.official_results_complete then
    raise exception 'Official results for fixture % are incomplete', p_fixture_id;
  end if;

  return query
  with inserted as (
    insert into public.prediction_settlements as settlement (
      prediction_id,
      fixture_id,
      user_id,
      prediction_snapshot,
      official_result,
      winner_correct,
      score_correct,
      goals_range_correct,
      first_scorer_correct,
      halftime_correct,
      all_correct,
      xp_awarded
    )
    select
      p.id,
      target_fixture.fixture_id,
      p.user_id,
      jsonb_build_object(
        'winner', p.ganador,
        'home_goals', p.goles_local,
        'away_goals', p.goles_visitante,
        'goals_range', p.goles_total,
        'first_scorer', p.primer_goleador,
        'halftime_result', p.resultado_medio_tiempo
      ),
      jsonb_build_object(
        'winner', target_fixture.winner,
        'home_goals', target_fixture.home_goals,
        'away_goals', target_fixture.away_goals,
        'goals_range',
          case
            when target_fixture.total_goals <= 1 then '0-1'
            when target_fixture.total_goals <= 3 then '2-3'
            when target_fixture.total_goals <= 5 then '4-5'
            else '6+'
          end,
        'first_scorer', target_fixture.first_scorer,
        'halftime_result', target_fixture.halftime_result
      ),
      checks.winner_correct,
      checks.score_correct,
      checks.goals_range_correct,
      checks.first_scorer_correct,
      checks.halftime_correct,
      (
        checks.winner_correct
        and checks.score_correct
        and checks.goals_range_correct
        and checks.first_scorer_correct
        and checks.halftime_correct
      ),
      case
        when checks.winner_correct
          and checks.score_correct
          and checks.goals_range_correct
          and checks.first_scorer_correct
          and checks.halftime_correct
        then 200
        else 0
      end
    from public.predicciones p
    cross join lateral (
      select
        coalesce(
          lower(trim(p.ganador)) = lower(trim(target_fixture.winner)),
          false
        ) as winner_correct,
        coalesce(
          p.goles_local = target_fixture.home_goals
          and p.goles_visitante = target_fixture.away_goals,
          false
        ) as score_correct,
        coalesce(
          p.goles_total = case
            when target_fixture.total_goals <= 1 then '0-1'
            when target_fixture.total_goals <= 3 then '2-3'
            when target_fixture.total_goals <= 5 then '4-5'
            else '6+'
          end,
          false
        ) as goals_range_correct,
        coalesce(
          case
            when target_fixture.first_scorer is null
              then nullif(trim(p.primer_goleador), '') is null
            else lower(trim(p.primer_goleador))
              = lower(trim(target_fixture.first_scorer))
          end,
          false
        ) as first_scorer_correct,
        coalesce(
          p.resultado_medio_tiempo = target_fixture.halftime_result,
          false
        ) as halftime_correct
    ) checks
    where p.partido_id = target_fixture.fixture_id
    on conflict (prediction_id) do nothing
    returning settlement.user_id, settlement.xp_awarded
  ),
  awarded as (
    update public.profiles profile
    set puntos = profile.puntos + rewards.amount
    from (
      select
        inserted.user_id,
        sum(inserted.xp_awarded)::bigint as amount
      from inserted
      group by inserted.user_id
    ) rewards
    where profile.id = rewards.user_id
      and rewards.amount > 0
    returning rewards.amount
  ),
  finalized as (
    update public.fixtures f
    set results_finalized_at = coalesce(results_finalized_at, now()),
        updated_at = now()
    where f.fixture_id = target_fixture.fixture_id
    returning f.fixture_id
  )
  select
    target_fixture.fixture_id,
    (select count(*)::integer from inserted),
    coalesce((select sum(amount)::integer from awarded), 0)
  from finalized;
end;
$$;

revoke all on function public.finalize_fixture_predictions(text) from public;
revoke all on function public.finalize_fixture_predictions(text) from anon;
revoke all on function public.finalize_fixture_predictions(text) from authenticated;
grant execute on function public.finalize_fixture_predictions(text) to service_role;

grant execute on function public.get_fixture_prediction_stats(text)
  to authenticated;
