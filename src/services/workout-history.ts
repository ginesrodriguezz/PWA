import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"
import type { ExerciseListItem } from "@/types/domain"

export type CompletedSetRow = {
  workoutId: string
  date: string
  weight: number
  reps: number
  effectiveExerciseId: string
  exercise: ExerciseListItem
}

// Every completed set from the user's finished workouts, with the
// "effective" exercise resolved: if the slot was swapped for that specific
// workout (session-only substitution), the replacement exercise is used
// instead of the routine slot's own exercise. This is what makes swaps only
// affect the session they happened in — PR/progress/statistics queries
// group by effectiveExerciseId, not the raw workout_exercise.exercise_id.
export async function getUserCompletedSets(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<CompletedSetRow[]> {
  const { data, error } = await supabase
    .from("workout_sets")
    .select(
      `weight, reps, completed, workout_id, workout_exercise_id,
       workout_exercise:workout_exercises!inner(
         exercise_id,
         exercise:exercises(id, name, name_es, body_part, equipment, target, image_path)
       ),
       workout:workouts!inner(started_at, finished_at, user_id)`
    )
    .eq("workout.user_id", userId)
    .not("workout.finished_at", "is", null)
    .eq("completed", true)
    .order("started_at", { referencedTable: "workout" })

  if (error) throw error

  const rows = data ?? []
  const workoutIds = [...new Set(rows.map((r) => r.workout_id))]

  const swapMap = new Map<string, ExerciseListItem>()
  if (workoutIds.length > 0) {
    const { data: swaps, error: swapsError } = await supabase
      .from("workout_exercise_swaps")
      .select(
        "workout_id, workout_exercise_id, exercise:exercises(id, name, name_es, body_part, equipment, target, image_path)"
      )
      .in("workout_id", workoutIds)

    if (swapsError) throw swapsError

    for (const swap of swaps ?? []) {
      swapMap.set(
        `${swap.workout_id}:${swap.workout_exercise_id}`,
        swap.exercise as unknown as ExerciseListItem
      )
    }
  }

  const result: CompletedSetRow[] = []
  for (const row of rows) {
    if (row.weight == null || row.reps == null) continue
    const workoutExercise = row.workout_exercise as unknown as {
      exercise_id: string
      exercise: ExerciseListItem
    }
    const workout = row.workout as unknown as { started_at: string }
    const swap = swapMap.get(`${row.workout_id}:${row.workout_exercise_id}`)
    const exercise = swap ?? workoutExercise.exercise

    result.push({
      workoutId: row.workout_id,
      date: workout.started_at,
      weight: row.weight,
      reps: row.reps,
      effectiveExerciseId: exercise.id,
      exercise,
    })
  }

  return result
}
