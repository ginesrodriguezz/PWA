import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"
import type {
  ExerciseListItem,
  ExercisePRSummary,
  StatisticsOverview,
} from "@/types/domain"
import { getUserCompletedSets } from "@/services/workout-history"

const RECENT_PR_WINDOW_DAYS = 30

export async function getStatisticsOverview(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<StatisticsOverview> {
  const rows = await getUserCompletedSets(supabase, userId)

  type Session = { date: string; maxWeight: number; volume: number; maxReps: number }
  const sessionsByExercise = new Map<
    string,
    { exercise: ExerciseListItem; sessions: Map<string, Session> }
  >()

  for (const row of rows) {
    let entry = sessionsByExercise.get(row.effectiveExerciseId)
    if (!entry) {
      entry = { exercise: row.exercise, sessions: new Map() }
      sessionsByExercise.set(row.effectiveExerciseId, entry)
    }

    const volume = row.weight * row.reps
    const existing = entry.sessions.get(row.workoutId)
    if (existing) {
      existing.maxWeight = Math.max(existing.maxWeight, row.weight)
      existing.maxReps = Math.max(existing.maxReps, row.reps)
      existing.volume += volume
    } else {
      entry.sessions.set(row.workoutId, {
        date: row.date,
        maxWeight: row.weight,
        maxReps: row.reps,
        volume,
      })
    }
  }

  const now = Date.now()
  const recentWindowMs = RECENT_PR_WINDOW_DAYS * 24 * 60 * 60 * 1000

  const exercises: ExercisePRSummary[] = [...sessionsByExercise.entries()].map(
    ([exerciseId, { exercise, sessions }]) => {
      const ordered = [...sessions.values()].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
      const last = ordered[ordered.length - 1]
      const previous = ordered[ordered.length - 2]

      const personalRecordKg = ordered.reduce(
        (max, s) => Math.max(max, s.maxWeight),
        0
      )
      const bestVolumeKg = ordered.reduce((max, s) => Math.max(max, s.volume), 0)
      const bestReps = ordered.reduce((max, s) => Math.max(max, s.maxReps), 0)

      const priorMax = ordered
        .slice(0, -1)
        .reduce((max, s) => Math.max(max, s.maxWeight), 0)
      const isRecentPR = ordered.length >= 2 && last.maxWeight >= priorMax

      return {
        exerciseId,
        exercise,
        sessionsCount: ordered.length,
        personalRecordKg,
        bestVolumeKg,
        bestReps,
        lastSessionDate: last.date,
        lastSessionMaxWeight: last.maxWeight,
        trendDeltaKg: previous ? last.maxWeight - previous.maxWeight : null,
        isRecentPR,
      }
    }
  )

  const { data: totalVolumeKg } = await supabase.rpc("get_total_volume")

  const recentPRCount = exercises.filter(
    (e) =>
      e.isRecentPR && now - new Date(e.lastSessionDate).getTime() <= recentWindowMs
  ).length

  const strongestLift = exercises.reduce<StatisticsOverview["strongestLift"]>(
    (strongest, e) => {
      if (!strongest || e.personalRecordKg > strongest.weightKg) {
        return { exerciseId: e.exerciseId, weightKg: e.personalRecordKg }
      }
      return strongest
    },
    null
  )

  return {
    exercises,
    totalExercisesTracked: exercises.length,
    recentPRCount,
    allTimeVolumeKg: Number(totalVolumeKg ?? 0),
    strongestLift,
  }
}
