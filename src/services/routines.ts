import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"
import type { Routine, RoutineDay, RoutineWithDays } from "@/types/domain"

type RoutineWithDayCount = Routine & { routine_days: { count: number }[] }

export async function getRoutines(
  supabase: SupabaseClient<Database>,
  userId: string
) {
  const { data, error } = await supabase
    .from("routines")
    .select("*, routine_days(count)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data as RoutineWithDayCount[]).map((r) => ({
    ...r,
    dayCount: r.routine_days[0]?.count ?? 0,
  }))
}

export async function getAllRoutineDays(
  supabase: SupabaseClient<Database>,
  userId: string
) {
  const { data, error } = await supabase
    .from("routine_days")
    .select(
      `*, routine:routines!inner(id, name, user_id), workout_exercises(count)`
    )
    .eq("routine.user_id", userId)
    .order("routine_id")
    .order("order")

  if (error) throw error
  return (
    data as (RoutineDay & {
      routine: { id: string; name: string; user_id: string }
      workout_exercises: { count: number }[]
    })[]
  ).map((d) => ({
    ...d,
    exerciseCount: d.workout_exercises[0]?.count ?? 0,
  }))
}

export async function getRoutine(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<RoutineWithDays | null> {
  const { data, error } = await supabase
    .from("routines")
    .select(
      `*, routine_days (*, workout_exercises (*, exercise:exercises(*)))`
    )
    .eq("id", id)
    .order("order", { referencedTable: "routine_days" })
    .order("order", { referencedTable: "routine_days.workout_exercises" })
    .maybeSingle()

  if (error) throw error
  return data as RoutineWithDays | null
}

export async function createRoutine(
  supabase: SupabaseClient<Database>,
  userId: string,
  input: { name: string; description?: string }
) {
  const { data, error } = await supabase
    .from("routines")
    .insert({
      user_id: userId,
      name: input.name,
      description: input.description || null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateRoutine(
  supabase: SupabaseClient<Database>,
  id: string,
  input: { name: string; description?: string }
) {
  const { error } = await supabase
    .from("routines")
    .update({ name: input.name, description: input.description || null })
    .eq("id", id)

  if (error) throw error
}

export async function deleteRoutine(
  supabase: SupabaseClient<Database>,
  id: string
) {
  const { error } = await supabase.from("routines").delete().eq("id", id)
  if (error) throw error
}

export async function createRoutineDay(
  supabase: SupabaseClient<Database>,
  routineId: string,
  name: string,
  order: number
) {
  const { data, error } = await supabase
    .from("routine_days")
    .insert({ routine_id: routineId, name, order })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateRoutineDay(
  supabase: SupabaseClient<Database>,
  id: string,
  patch: { name?: string; order?: number }
) {
  const { error } = await supabase
    .from("routine_days")
    .update(patch)
    .eq("id", id)

  if (error) throw error
}

export async function deleteRoutineDay(
  supabase: SupabaseClient<Database>,
  id: string
) {
  const { error } = await supabase.from("routine_days").delete().eq("id", id)
  if (error) throw error
}

export async function reorderRoutineDays(
  supabase: SupabaseClient<Database>,
  updates: { id: string; order: number }[]
) {
  await Promise.all(
    updates.map((u) =>
      supabase.from("routine_days").update({ order: u.order }).eq("id", u.id)
    )
  )
}

export async function addWorkoutExercise(
  supabase: SupabaseClient<Database>,
  routineDayId: string,
  exerciseId: string,
  order: number,
  targetSets = 3
) {
  const { data, error } = await supabase
    .from("workout_exercises")
    .insert({
      routine_day_id: routineDayId,
      exercise_id: exerciseId,
      order,
      target_sets: targetSets,
    })
    .select("*, exercise:exercises(*)")
    .single()

  if (error) throw error
  return data
}

export async function updateWorkoutExercise(
  supabase: SupabaseClient<Database>,
  id: string,
  patch: { order?: number; target_sets?: number }
) {
  const { error } = await supabase
    .from("workout_exercises")
    .update(patch)
    .eq("id", id)

  if (error) throw error
}

export async function removeWorkoutExercise(
  supabase: SupabaseClient<Database>,
  id: string
) {
  const { error } = await supabase
    .from("workout_exercises")
    .delete()
    .eq("id", id)

  if (error) throw error
}

export async function reorderWorkoutExercises(
  supabase: SupabaseClient<Database>,
  updates: { id: string; order: number }[]
) {
  await Promise.all(
    updates.map((u) =>
      supabase
        .from("workout_exercises")
        .update({ order: u.order })
        .eq("id", u.id)
    )
  )
}
