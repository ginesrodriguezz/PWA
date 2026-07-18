import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"
import type { DashboardStats } from "@/types/domain"

function startOfWeek(date: Date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = (day + 6) % 7 // days since Monday
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - diff)
  return d
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

export async function getDashboardStats(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<DashboardStats> {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const eightWeeksAgo = new Date(now)
  eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 7 * 8)

  const [
    { count: totalWorkouts },
    { count: workoutsThisMonth },
    { data: totalVolumeKg },
    { data: recentWorkouts },
    { data: recentSets },
  ] = await Promise.all([
    supabase
      .from("workouts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .not("finished_at", "is", null),
    supabase
      .from("workouts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .not("finished_at", "is", null)
      .gte("started_at", startOfMonth.toISOString()),
    supabase.rpc("get_total_volume"),
    supabase
      .from("workouts")
      .select(
        `id, started_at, finished_at, routine_day:routine_days(id, name, routine_id, routine:routines(id, name))`
      )
      .eq("user_id", userId)
      .not("finished_at", "is", null)
      .order("started_at", { ascending: false })
      .limit(60),
    supabase
      .from("workout_sets")
      .select(
        `weight, reps, completed, workout:workouts!inner(started_at, user_id, finished_at)`
      )
      .eq("workout.user_id", userId)
      .not("workout.finished_at", "is", null)
      .eq("completed", true)
      .gte("workout.started_at", eightWeeksAgo.toISOString()),
  ])

  const workouts = recentWorkouts ?? []

  const lastWorkoutRow = workouts[0] as
    | (typeof workouts)[number] & {
        routine_day: {
          id: string
          name: string
          routine_id: string
          routine: { id: string; name: string }
        } | null
      }
    | undefined

  const lastWorkout =
    lastWorkoutRow && lastWorkoutRow.routine_day
      ? {
          id: lastWorkoutRow.id,
          startedAt: lastWorkoutRow.started_at,
          finishedAt: lastWorkoutRow.finished_at as string,
          dayName: lastWorkoutRow.routine_day.name,
          routineName: lastWorkoutRow.routine_day.routine.name,
        }
      : null

  let nextDay: DashboardStats["nextDay"] = null
  if (lastWorkout && lastWorkoutRow?.routine_day) {
    const routineId = lastWorkoutRow.routine_day.routine_id
    const { data: days } = await supabase
      .from("routine_days")
      .select("id, name, order")
      .eq("routine_id", routineId)
      .order("order")

    if (days && days.length > 0) {
      const currentIndex = days.findIndex(
        (d) => d.id === lastWorkoutRow.routine_day!.id
      )
      const next = days[(currentIndex + 1) % days.length]
      nextDay = {
        id: next.id,
        name: next.name,
        routineName: lastWorkoutRow.routine_day.routine.name,
      }
    }
  } else {
    const { data: firstRoutine } = await supabase
      .from("routines")
      .select("id, name")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (firstRoutine) {
      const { data: firstDay } = await supabase
        .from("routine_days")
        .select("id, name")
        .eq("routine_id", firstRoutine.id)
        .order("order")
        .limit(1)
        .maybeSingle()

      if (firstDay) {
        nextDay = {
          id: firstDay.id,
          name: firstDay.name,
          routineName: firstRoutine.name,
        }
      }
    }
  }

  const weekSet = new Set(
    workouts.map((w) => toDateKey(startOfWeek(new Date(w.started_at))))
  )
  let weeklyStreak = 0
  const cursor = startOfWeek(now)
  while (weekSet.has(toDateKey(cursor))) {
    weeklyStreak++
    cursor.setDate(cursor.getDate() - 7)
  }

  const volumeByWeek = new Map<string, number>()
  for (const set of recentSets ?? []) {
    const workout = set.workout as unknown as { started_at: string } | null
    if (!workout || set.weight == null || set.reps == null) continue
    const key = toDateKey(startOfWeek(new Date(workout.started_at)))
    volumeByWeek.set(key, (volumeByWeek.get(key) ?? 0) + set.weight * set.reps)
  }

  const weeklyVolume: DashboardStats["weeklyVolume"] = []
  const weekCursor = startOfWeek(eightWeeksAgo)
  const thisWeek = startOfWeek(now)
  while (weekCursor <= thisWeek) {
    const key = toDateKey(weekCursor)
    weeklyVolume.push({ weekStart: key, volume: volumeByWeek.get(key) ?? 0 })
    weekCursor.setDate(weekCursor.getDate() + 7)
  }

  return {
    totalWorkouts: totalWorkouts ?? 0,
    workoutsThisMonth: workoutsThisMonth ?? 0,
    totalVolumeKg: Number(totalVolumeKg ?? 0),
    weeklyStreak,
    lastWorkout,
    nextDay,
    weeklyVolume,
  }
}
