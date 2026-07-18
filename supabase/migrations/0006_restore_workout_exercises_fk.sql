-- 0005_exercise_library.sql dropped public.exercises with `cascade`, which
-- also dropped workout_exercises_exercise_id_fkey (the FK depended on the
-- table being dropped). Recreating exercises never restored that FK, so
-- PostgREST can't resolve the workout_exercises -> exercises embed
-- (PGRST200: "Could not find a relationship ... in the schema cache").

alter table public.workout_exercises
  add constraint workout_exercises_exercise_id_fkey
  foreign key (exercise_id) references public.exercises (id) on delete restrict;
