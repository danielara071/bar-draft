-- Predictions remain open before and during the match.
-- Existing predictions remain readable and the unique constraint still
-- guarantees one prediction per user and fixture. Finished matches are closed.

drop policy if exists "Usuario inserta sus predicciones"
  on public.predicciones;

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
