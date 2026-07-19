-- Search finished workouts by routine/day name and date range, with an
-- accurate total count for pagination, in a single round trip.
create function public.search_workout_history(
  p_search text default null,
  p_date_from date default null,
  p_date_to date default null,
  p_limit int default 15,
  p_offset int default 0
)
returns table (
  id uuid,
  started_at timestamptz,
  finished_at timestamptz,
  day_name text,
  routine_name text,
  total_sets bigint,
  completed_sets bigint,
  volume numeric,
  total_count bigint
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    w.id,
    w.started_at,
    w.finished_at,
    rd.name as day_name,
    r.name as routine_name,
    count(ws.id) as total_sets,
    count(ws.id) filter (where ws.completed) as completed_sets,
    coalesce(sum(ws.weight * ws.reps) filter (where ws.completed), 0) as volume,
    count(*) over() as total_count
  from public.workouts w
  join public.routine_days rd on rd.id = w.routine_day_id
  join public.routines r on r.id = rd.routine_id
  left join public.workout_sets ws on ws.workout_id = w.id
  where w.user_id = auth.uid()
    and w.finished_at is not null
    and (p_search is null or p_search = '' or rd.name ilike '%'||p_search||'%' or r.name ilike '%'||p_search||'%')
    and (p_date_from is null or w.started_at::date >= p_date_from)
    and (p_date_to is null or w.started_at::date <= p_date_to)
  group by w.id, rd.name, r.name
  order by w.started_at desc
  limit p_limit offset p_offset;
$$;

grant execute on function public.search_workout_history(text, date, date, int, int) to authenticated;
