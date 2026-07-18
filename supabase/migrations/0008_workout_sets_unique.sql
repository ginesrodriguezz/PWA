-- ensureWorkoutSets() runs on every render of /entrenar/[workoutId] (a server
-- component, re-executed on prefetch/navigation races) and had no DB-level
-- guard, so two concurrent calls could both decide a set_number was missing
-- and insert it twice. Dedupe existing duplicates (keeping the row with data
-- if any, else the earliest), then enforce uniqueness going forward.

delete from public.workout_sets ws
where ws.id in (
  select id from (
    select
      id,
      row_number() over (
        partition by workout_exercise_id, set_number
        order by
          completed desc,
          (weight is not null or reps is not null) desc,
          id asc
      ) as rn
    from public.workout_sets
  ) ranked
  where rn > 1
);

alter table public.workout_sets
  add constraint workout_sets_exercise_set_number_unique
  unique (workout_exercise_id, set_number);
