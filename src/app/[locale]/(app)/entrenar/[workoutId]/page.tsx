import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import {
  ensureWorkoutSets,
  getLastExerciseSets,
  getWorkoutSession,
} from "@/services/workouts"
import { WorkoutSessionView } from "@/components/workout/workout-session-view"

export default async function EntrenarSessionPage({
  params,
}: {
  params: Promise<{ workoutId: string }>
}) {
  const { workoutId } = await params
  const supabase = await createClient()

  let session = await getWorkoutSession(supabase, workoutId)
  if (!session) notFound()

  await ensureWorkoutSets(
    supabase,
    workoutId,
    session.routine_day.workout_exercises.map((we) => ({
      id: we.id,
      target_sets: we.target_sets,
    })),
    session.workout_sets
  )

  session = await getWorkoutSession(supabase, workoutId)
  if (!session) notFound()

  const lastSetsEntries = await Promise.all(
    session.routine_day.workout_exercises.map(async (we) => [
      we.exercise_id,
      await getLastExerciseSets(supabase, we.exercise_id),
    ] as const)
  )
  const lastSetsByExercise = Object.fromEntries(lastSetsEntries)

  return (
    <WorkoutSessionView
      session={session}
      lastSetsByExercise={lastSetsByExercise}
    />
  )
}
