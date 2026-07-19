-- Session-scoped exercise substitutions: lets a user swap an exercise for
-- just one active workout, without touching the routine template. Sets
-- logged during the swap still reference the original workout_exercise_id
-- (slot), but progress/statistics queries resolve the "effective" exercise
-- through this table so PRs are credited to the replacement exercise.
create table public.workout_exercise_swaps (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references public.workouts(id) on delete cascade,
  workout_exercise_id uuid not null references public.workout_exercises(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id),
  created_at timestamptz not null default now(),
  unique (workout_id, workout_exercise_id)
);

alter table public.workout_exercise_swaps enable row level security;

create policy "workout_exercise_swaps_select_own"
  on public.workout_exercise_swaps for select
  to authenticated
  using (
    exists (
      select 1 from public.workouts w
      where w.id = workout_exercise_swaps.workout_id and w.user_id = auth.uid()
    )
  );

create policy "workout_exercise_swaps_insert_own"
  on public.workout_exercise_swaps for insert
  to authenticated
  with check (
    exists (
      select 1 from public.workouts w
      where w.id = workout_exercise_swaps.workout_id and w.user_id = auth.uid()
    )
  );

create policy "workout_exercise_swaps_update_own"
  on public.workout_exercise_swaps for update
  to authenticated
  using (
    exists (
      select 1 from public.workouts w
      where w.id = workout_exercise_swaps.workout_id and w.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.workouts w
      where w.id = workout_exercise_swaps.workout_id and w.user_id = auth.uid()
    )
  );

create policy "workout_exercise_swaps_delete_own"
  on public.workout_exercise_swaps for delete
  to authenticated
  using (
    exists (
      select 1 from public.workouts w
      where w.id = workout_exercise_swaps.workout_id and w.user_id = auth.uid()
    )
  );
