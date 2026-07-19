-- 0008 scoped the uniqueness of workout_sets to (workout_exercise_id,
-- set_number) only. workout_exercise_id identifies a fixed routine-day
-- exercise slot that is reused across every session of that day, so that
-- constraint made "set 1 of bench press" a global singleton across all
-- workout history instead of one-per-session: repeating a routine day
-- silently got zero sets created (ensureWorkoutSets' upsert saw the slot's
-- set numbers as already taken by a previous, unrelated workout), and
-- manually adding a set hit a 409 unique violation against that old row.
--
-- Uniqueness must include workout_id: sets are only unique within a given
-- workout session, not across all sessions that share an exercise slot.

alter table public.workout_sets
  drop constraint workout_sets_exercise_set_number_unique;

alter table public.workout_sets
  add constraint workout_sets_workout_exercise_set_number_unique
  unique (workout_id, workout_exercise_id, set_number);
