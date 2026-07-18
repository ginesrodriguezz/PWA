-- Extensions
create extension if not exists "pgcrypto";

-- Enums
create type public.muscle_group as enum (
  'chest',
  'back',
  'legs',
  'shoulders',
  'biceps',
  'triceps',
  'core',
  'glutes',
  'calves'
);

-- routines
create table public.routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create index routines_user_id_idx on public.routines (user_id);

-- routine_days
create table public.routine_days (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references public.routines (id) on delete cascade,
  name text not null,
  "order" integer not null default 0
);

create index routine_days_routine_id_idx on public.routine_days (routine_id);

-- exercises (public library, not user-owned)
create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  muscle_group public.muscle_group not null,
  image_url text,
  created_at timestamptz not null default now()
);

create index exercises_muscle_group_idx on public.exercises (muscle_group);

-- workout_exercises (links exercises to a routine day)
create table public.workout_exercises (
  id uuid primary key default gen_random_uuid(),
  routine_day_id uuid not null references public.routine_days (id) on delete cascade,
  exercise_id uuid not null references public.exercises (id) on delete restrict,
  "order" integer not null default 0,
  target_sets integer not null default 3
);

create index workout_exercises_routine_day_id_idx on public.workout_exercises (routine_day_id);
create index workout_exercises_exercise_id_idx on public.workout_exercises (exercise_id);

-- workouts (a training session)
create table public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  routine_day_id uuid references public.routine_days (id) on delete set null,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create index workouts_user_id_idx on public.workouts (user_id);
create index workouts_routine_day_id_idx on public.workouts (routine_day_id);

-- workout_sets
create table public.workout_sets (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references public.workouts (id) on delete cascade,
  workout_exercise_id uuid not null references public.workout_exercises (id) on delete cascade,
  set_number integer not null,
  weight numeric(6, 2),
  reps integer,
  completed boolean not null default false
);

create index workout_sets_workout_id_idx on public.workout_sets (workout_id);
create index workout_sets_workout_exercise_id_idx on public.workout_sets (workout_exercise_id);
