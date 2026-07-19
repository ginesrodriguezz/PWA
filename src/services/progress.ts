import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"
import type { ExerciseProgressPoint } from "@/types/domain"
import { getUserCompletedSets } from "@/services/workout-history"

export async function getExerciseProgress(
  supabase: SupabaseClient<Database>,
  userId: string,
  exerciseId: string
): Promise<ExerciseProgressPoint[]> {
  const rows = await getUserCompletedSets(supabase, userId)

  const byWorkout = new Map<
    string,
    { date: string; maxWeight: number; volume: number; maxReps: number }
  >()

  for (const row of rows) {
    if (row.effectiveExerciseId !== exerciseId) continue
    const existing = byWorkout.get(row.workoutId)
    const volume = row.weight * row.reps
    if (existing) {
      existing.maxWeight = Math.max(existing.maxWeight, row.weight)
      existing.maxReps = Math.max(existing.maxReps, row.reps)
      existing.volume += volume
    } else {
      byWorkout.set(row.workoutId, {
        date: row.date,
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
