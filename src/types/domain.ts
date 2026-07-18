import type { Database, MuscleGroup } from "./database.types"

export type Routine = Database["public"]["Tables"]["routines"]["Row"]
export type RoutineDay = Database["public"]["Tables"]["routine_days"]["Row"]
export type Exercise = Database["public"]["Tables"]["exercises"]["Row"]
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

export type { MuscleGroup }

export const MUSCLE_GROUPS: MuscleGroup[] = [
  "chest",
  "back",
  "legs",
  "shoulders",
  "biceps",
  "triceps",
  "core",
  "glutes",
  "calves",
]
