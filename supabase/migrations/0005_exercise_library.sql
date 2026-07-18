-- Replace the hand-seeded exercise library with the full exercises-dataset
-- library (1,324 exercises with images/gifs, imported separately via
-- scripts/import-exercises.ts). This wipes existing routines/workouts too,
-- since they reference the old exercise rows via workout_exercises.exercise_id
-- (on delete restrict).

truncate table
  public.workout_sets,
  public.workouts,
  public.workout_exercises,
  public.routine_days,
  public.routines,
  public.exercises
restart identity cascade;

drop table public.exercises cascade;
drop type if exists public.muscle_group cascade;

create type public.body_part as enum (
  'back',
  'cardio',
  'chest',
  'lower arms',
  'lower legs',
  'neck',
  'shoulders',
  'upper arms',
  'upper legs',
  'waist'
);

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  external_id text not null unique,
  name text not null,
  body_part public.body_part not null,
  equipment text not null,
  target text not null,
  primary_muscle text not null,
  secondary_muscles text[] not null default '{}',
  instructions_en text not null,
  instructions_es text not null,
  instruction_steps_en text[] not null default '{}',
  instruction_steps_es text[] not null default '{}',
  image_path text not null,
  gif_path text not null,
  attribution text not null default '© Gym visual — https://gymvisual.com/',
  created_at timestamptz not null default now()
);

create index exercises_body_part_idx on public.exercises (body_part);

alter table public.exercises enable row level security;

create policy "exercises_select_authenticated"
  on public.exercises for select
  to authenticated
  using (true);

-- Storage bucket for thumbnails + gifs (© Gym visual, see NOTICE.md in the
-- exercises-dataset repo — 180x180 media redistributed with attribution).
insert into storage.buckets (id, name, public, file_size_limit)
values ('exercise-media', 'exercise-media', true, 2097152)
on conflict (id) do nothing;

create policy "exercise_media_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'exercise-media');
