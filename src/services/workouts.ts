import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"
import type { WorkoutSession, LastExerciseSets } from "@/types/domain"

export async function getOrCreateActiveWorkout(
  supabase: SupabaseClient<Database>,
  userId: string,
  routineDayId: string
) {
  const { data: existing, error: findError } = await supabase
    .from("workouts")
    .select("*")
    .eq("user_id", userId)
    .eq("routine_day_id", routineDayId)
    .is("finished_at", null)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (findError) throw findError
  if (existing) return existing

  const { data, error } = await supabase
    .from("workouts")
    .insert({ user_id: userId, routine_day_id: routineDayId })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getWorkoutSession(
  supabase: SupabaseClient<Database>,
  workoutId: string
): Promise<WorkoutSession | null> {
  const { data, error } = await supabase
    .from("workouts")
    .select(
      `*, routine_day:routine_days(*, workout_exercises(*, exercise:exercises(*)))`
    )
    .eq("id", workoutId)
    .order("order", { referencedTable: "routine_day.workout_exercises" })
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  const { data: sets, error: setsError } = await supabase
    .from("workout_sets")
    .select("*")
    .eq("workout_id", workoutId)
    .order("set_number")

  if (setsError) throw setsError

  return { ...data, workout_sets: sets } as WorkoutSession
}

export async function ensureWorkoutSets(
  supabase: SupabaseClient<Database>,
  workoutId: string,
  workoutExercises: { id: string; target_sets: number }[],
  existingSets: { workout_exercise_id: string; set_number: number }[]
) {
  const rows: {
    workout_id: string
    workout_exercise_id: string
    set_number: number
  }[] = []

  for (const we of workoutExercises) {
    const existingNumbers = new Set(
      existingSets
        .filter((s) => s.workout_exercise_id === we.id)
        .map((s) => s.set_number)
    )
    for (let n = 1; n <= we.target_sets; n++) {
      if (!existingNumbers.has(n)) {
        rows.push({
          workout_id: workoutId,
          workout_exercise_id: we.id,
          set_number: n,
        })
      }
    }
  }

  if (rows.length === 0) return

  const { error } = await supabase.from("workout_sets").upsert(rows, {
    onConflict: "workout_exercise_id,set_number",
    ignoreDuplicates: true,
  })
  if (error) throw error
}

export async function updateWorkoutSet(
  supabase: SupabaseClient<Database>,
  id: string,
  patch: { weight?: number | null; reps?: number | null; completed?: boolean }
) {
  const { error } = await supabase
    .from("workout_sets")
    .update(patch)
    .eq("id", id)

  if (error) throw error
}

export async function addWorkoutSet(
  supabase: SupabaseClient<Database>,
  workoutId: string,
  workoutExerciseId: string,
  setNumber: number
) {
  const { data, error } = await supabase
    .from("workout_sets")
    .insert({
      workout_id: workoutId,
      workout_exercise_id: workoutExerciseId,
      set_number: setNumber,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function finishWorkout(
  supabase: SupabaseClient<Database>,
  workoutId: string
) {
  const { error } = await supabase
    .from("workouts")
    .update({ finished_at: new Date().toISOString() })
    .eq("id", workoutId)

  if (error) throw error
}

export async function getLastExerciseSets(
  supabase: SupabaseClient<Database>,
  exerciseId: string
): Promise<LastExerciseSets> {
  const { data, error } = await supabase.rpc("get_last_exercise_sets", {
    p_exercise_id: exerciseId,
  })

  if (error) throw error
  return data
}
