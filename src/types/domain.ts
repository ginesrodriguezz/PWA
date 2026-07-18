import type { Database, BodyPart } from "./database.types"

export type Routine = Database["public"]["Tables"]["routines"]["Row"]
export type RoutineDay = Database["public"]["Tables"]["routine_days"]["Row"]
export type Exercise = Database["public"]["Tables"]["exercises"]["Row"]
export type ExerciseListItem = Pick<
  Exercise,
  "id" | "name" | "name_es" | "body_part" | "equipment" | "target" | "image_path"
>
export type WorkoutExercise =
  Database["public"]["Tables"]["workout_exercises"]["Row"]
export type Workout = Database["public"]["Tables"]["workouts"]["Row"]
export type WorkoutSet = Database["public"]["Tables"]["workout_sets"]["Row"]

export type WorkoutExerciseWithExercise = WorkoutExercise & {
  exercise: Exercise
}

export type RoutineDayWithExercises = RoutineDay & {
  workout_exercises: WorkoutExerciseWithExercise[]
}

export type RoutineWithDays = Routine & {
  routine_days: RoutineDayWithExercises[]
}

export type WorkoutSession = Workout & {
  routine_day: RoutineDayWithExercises
  workout_sets: WorkoutSet[]
}

export type LastExerciseSets = {
  set_number: number
  weight: number | null
  reps: number | null
  workout_started_at: string
}[]

export type DashboardStats = {
  totalWorkouts: number
  workoutsThisMonth: number
  totalVolumeKg: number
  weeklyStreak: number
  lastWorkout: {
    id: string
    startedAt: string
    finishedAt: string
    dayName: string
    routineName: string
  } | null
  nextDay: {
    id: string
    name: string
    routineName: string
  } | null
  weeklyVolume: { weekStart: string; volume: number }[]
}

export type WorkoutHistoryItem = {
  id: string
  started_at: string
  finished_at: string
  dayName: string
  routineName: string
  totalSets: number
  completedSets: number
  volume: number
}

export type ExerciseProgressPoint = {
  workoutId: string
  date: string
  maxWeight: number
  volume: number
  maxReps: number
}

export type { BodyPart }

export const BODY_PARTS: BodyPart[] = [
  "back",
  "cardio",
  "chest",
  "lower arms",
  "lower legs",
  "neck",
  "shoulders",
  "upper arms",
  "upper legs",
  "waist",
]

// Raw body_part values contain spaces, which aren't valid next-intl
// dot-path key segments — look labels up through this map instead of
// interpolating exercise.body_part directly into t().
export const BODY_PART_LABEL_KEYS: Record<BodyPart, string> = {
  back: "back",
  cardio: "cardio",
  chest: "chest",
  "lower arms": "lowerArms",
  "lower legs": "lowerLegs",
  neck: "neck",
  shoulders: "shoulders",
  "upper arms": "upperArms",
  "upper legs": "upperLegs",
  waist: "waist",
}

// Exercise names only ship in English in the dataset — name_es is an
// AI-generated translation backfilled separately, so it can be null.
export function getExerciseName(
  exercise: { name: string; name_es: string | null },
  locale: string
): string {
  return locale === "es" ? (exercise.name_es ?? exercise.name) : exercise.name
}
