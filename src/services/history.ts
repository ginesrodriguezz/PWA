import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"
import type { WorkoutHistoryItem } from "@/types/domain"

const PAGE_SIZE = 15

export async function getWorkoutHistory(
  supabase: SupabaseClient<Database>,
  userId: string,
  page: number
): Promise<{ items: WorkoutHistoryItem[]; totalCount: number; pageSize: number }> {
  const from = page * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data: workouts, count } = await supabase
    .from("workouts")
    .select(
      `id, started_at, finished_at, routine_day:routine_days(name, routine:routines(name))`,
      { count: "exact" }
    )
    .eq("user_id", userId)
    .not("finished_at", "is", null)
    .order("started_at", { ascending: false })
    .range(from, to)

  const rows = (workouts ?? []) as unknown as {
    id: string
    started_at: string
    finished_at: string
    routine_day: { name: string; routine: { name: string } } | null
  }[]

  if (rows.length === 0) {
    return { items: [], totalCount: count ?? 0, pageSize: PAGE_SIZE }
  }

  const workoutIds = rows.map((w) => w.id)
  const { data: sets } = await supabase
    .from("workout_sets")
    .select("workout_id, weight, reps, completed")
    .in("workout_id", workoutIds)

  const items: WorkoutHistoryItem[] = rows.map((w) => {
    const workoutSets = (sets ?? []).filter((s) => s.workout_id === w.id)
    const completedSets = workoutSets.filter((s) => s.completed)
    const volume = completedSets.reduce(
      (sum, s) => sum + (s.weight ?? 0) * (s.reps ?? 0),
      0
    )
    return {
      id: w.id,
      started_at: w.started_at,
      finished_at: w.finished_at,
      dayName: w.routine_day?.name ?? "",
      routineName: w.routine_day?.routine?.name ?? "",
      totalSets: workoutSets.length,
      completedSets: completedSets.length,
      volume,
    }
  })

  return { items, totalCount: count ?? 0, pageSize: PAGE_SIZE }
}
