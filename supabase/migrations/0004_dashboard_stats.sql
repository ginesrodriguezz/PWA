-- Aggregate: total weight lifted (all-time, completed sets only) for the
-- current user. Done in SQL to avoid pulling every set row to the client.
create function public.get_total_volume()
returns numeric
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce(sum(ws.weight * ws.reps), 0)
  from public.workout_sets ws
  join public.workouts w on w.id = ws.workout_id
  where w.user_id = auth.uid()
    and w.finished_at is not null
    and ws.completed = true
    and ws.weight is not null
    and ws.reps is not null;
$$;

grant execute on function public.get_total_volume() to authenticated;
