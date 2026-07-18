-- Enable RLS
alter table public.routines enable row level security;
alter table public.routine_days enable row level security;
alter table public.exercises enable row level security;
alter table public.workout_exercises enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_sets enable row level security;

-- exercises: public read-only library, no client writes
create policy "exercises_select_authenticated"
  on public.exercises for select
  to authenticated
  using (true);

-- routines: owned directly by user_id
create policy "routines_select_own"
  on public.routines for select
  to authenticated
  using (user_id = auth.uid());

create policy "routines_insert_own"
  on public.routines for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "routines_update_own"
  on public.routines for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "routines_delete_own"
  on public.routines for delete
  to authenticated
  using (user_id = auth.uid());

-- routine_days: ownership via parent routine
create policy "routine_days_select_own"
  on public.routine_days for select
  to authenticated
  using (
    exists (
      select 1 from public.routines r
      where r.id = routine_days.routine_id and r.user_id = auth.uid()
    )
  );

create policy "routine_days_insert_own"
  on public.routine_days for insert
  to authenticated
  with check (
    exists (
      select 1 from public.routines r
      where r.id = routine_days.routine_id and r.user_id = auth.uid()
    )
  );

create policy "routine_days_update_own"
  on public.routine_days for update
  to authenticated
  using (
    exists (
      select 1 from public.routines r
      where r.id = routine_days.routine_id and r.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.routines r
      where r.id = routine_days.routine_id and r.user_id = auth.uid()
    )
  );

create policy "routine_days_delete_own"
  on public.routine_days for delete
  to authenticated
  using (
    exists (
      select 1 from public.routines r
      where r.id = routine_days.routine_id and r.user_id = auth.uid()
    )
  );

-- workout_exercises: ownership via routine_day -> routine
create policy "workout_exercises_select_own"
  on public.workout_exercises for select
  to authenticated
  using (
    exists (
      select 1 from public.routine_days rd
      join public.routines r on r.id = rd.routine_id
      where rd.id = workout_exercises.routine_day_id and r.user_id = auth.uid()
    )
  );

create policy "workout_exercises_insert_own"
  on public.workout_exercises for insert
  to authenticated
  with check (
    exists (
      select 1 from public.routine_days rd
      join public.routines r on r.id = rd.routine_id
      where rd.id = workout_exercises.routine_day_id and r.user_id = auth.uid()
    )
  );

create policy "workout_exercises_update_own"
  on public.workout_exercises for update
  to authenticated
  using (
    exists (
      select 1 from public.routine_days rd
      join public.routines r on r.id = rd.routine_id
      where rd.id = workout_exercises.routine_day_id and r.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.routine_days rd
      join public.routines r on r.id = rd.routine_id
      where rd.id = workout_exercises.routine_day_id and r.user_id = auth.uid()
    )
  );

create policy "workout_exercises_delete_own"
  on public.workout_exercises for delete
  to authenticated
  using (
    exists (
      select 1 from public.routine_days rd
      join public.routines r on r.id = rd.routine_id
      where rd.id = workout_exercises.routine_day_id and r.user_id = auth.uid()
    )
  );

-- workouts: owned directly by user_id
create policy "workouts_select_own"
  on public.workouts for select
  to authenticated
  using (user_id = auth.uid());

create policy "workouts_insert_own"
  on public.workouts for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "workouts_update_own"
  on public.workouts for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "workouts_delete_own"
  on public.workouts for delete
  to authenticated
  using (user_id = auth.uid());

-- workout_sets: ownership via parent workout
create policy "workout_sets_select_own"
  on public.workout_sets for select
  to authenticated
  using (
    exists (
      select 1 from public.workouts w
      where w.id = workout_sets.workout_id and w.user_id = auth.uid()
    )
  );

create policy "workout_sets_insert_own"
  on public.workout_sets for insert
  to authenticated
  with check (
    exists (
      select 1 from public.workouts w
      where w.id = workout_sets.workout_id and w.user_id = auth.uid()
    )
  );

create policy "workout_sets_update_own"
  on public.workout_sets for update
  to authenticated
  using (
    exists (
      select 1 from public.workouts w
      where w.id = workout_sets.workout_id and w.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.workouts w
      where w.id = workout_sets.workout_id and w.user_id = auth.uid()
    )
  );

create policy "workout_sets_delete_own"
  on public.workout_sets for delete
  to authenticated
  using (
    exists (
      select 1 from public.workouts w
      where w.id = workout_sets.workout_id and w.user_id = auth.uid()
    )
  );

-- RPC: last recorded sets for a given exercise, from the most recent
-- finished workout of the current user that included it.
create function public.get_last_exercise_sets(p_exercise_id uuid)
returns table (
  set_number integer,
  weight numeric,
  reps integer,
  workout_started_at timestamptz
)
language sql
stable
security invoker
set search_path = public
as $$
  select ws.set_number, ws.weight, ws.reps, w.started_at as workout_started_at
  from public.workout_sets ws
  join public.workout_exercises we on we.id = ws.workout_exercise_id
  join public.workouts w on w.id = ws.workout_id
  where we.exercise_id = p_exercise_id
    and w.user_id = auth.uid()
    and w.finished_at is not null
    and ws.completed = true
    and w.id = (
      select w2.id
      from public.workouts w2
      join public.workout_sets ws2 on ws2.workout_id = w2.id
      join public.workout_exercises we2 on we2.id = ws2.workout_exercise_id
      where we2.exercise_id = p_exercise_id
        and w2.user_id = auth.uid()
        and w2.finished_at is not null
        and ws2.completed = true
      order by w2.finished_at desc
      limit 1
    )
  order by ws.set_number asc;
$$;

grant execute on function public.get_last_exercise_sets(uuid) to authenticated;
