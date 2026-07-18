-- Exercise names in the dataset are English-only (only instructions come in
-- multiple languages). name_es holds an AI-generated Spanish translation,
-- backfilled by scripts/import-exercises.ts from scripts/data/exercise-names-es.json.
alter table public.exercises
  add column name_es text;
