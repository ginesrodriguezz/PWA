import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"
import type { ExerciseProgressPoint } from "@/types/domain"

export async function getExerciseProgress(
  supabase: SupabaseClient<Database>,
  userId: string,
  exerciseId: string
): Promise<ExerciseProgressPoint[]> {
  const { data, error } = await supabase
    .from("workout_sets")
    .select(
      `weight, reps, completed, workout_id,
       workout_exercise:workout_exercises!inner(exercise_id),
       workout:workouts!inner(started_at, finished_at, user_id)`
    )
    .eq("workout_exercise.exercise_id", exerciseId)
    .eq("workout.user_id", userId)
    .not("workout.finished_at", "is", null)
    .eq("completed", true)
    .order("started_at", { referencedTable: "workout" })

  if (error) throw error

  const byWorkout = new Map<
    string,
    { date: string; maxWeight: number; volume: number; maxReps: number }
  >()

  for (const row of data ?? []) {
    if (row.weight == null || row.reps == null) continue
    const workout = row.workout as unknown as { started_at: string }
    const existing = byWorkout.get(row.workout_id)
    const volume = row.weight * row.reps
    if (existing) {
      existing.maxWeight = Math.max(existing.maxWeight, row.weight)
      existing.maxReps = Math.max(existing.maxReps, row.reps)
      existing.volume += volume
    } else {
      byWorkout.set(row.workout_id, {
        date: workout.started_at,
        maxWeight: row.weight,
        maxReps: row.reps,
        volume,
      })
    }
  }

  return [...byWorkout.entries()]
    .map(([workoutId, v]) => ({ workoutId, ...v }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}
