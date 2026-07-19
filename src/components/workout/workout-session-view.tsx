"use client"

import * as React from "react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { WorkoutHeader } from "@/components/workout/workout-header"
import { ExerciseStrip } from "@/components/workout/exercise-strip"
import { ActiveExerciseCard } from "@/components/workout/active-exercise-card"
import { ConfirmDialog } from "@/components/feedback/confirm-dialog"
import {
  useDiscardWorkout,
  useFinishWorkout,
  useReplaceWorkoutExercise,
  useWorkoutSession,
} from "@/hooks/use-workout"
import type { LastExerciseSets, WorkoutSession } from "@/types/domain"

export function WorkoutSessionView({
  session: initialSession,
  lastSetsByExercise,
}: {
  session: WorkoutSession
  lastSetsByExercise: Record<string, LastExerciseSets>
}) {
  const t = useTranslations("workout")
  const router = useRouter()
  const { data } = useWorkoutSession(initialSession.id, initialSession)
  const session = data ?? initialSession
  const finishWorkout = useFinishWorkout()
  const discardWorkout = useDiscardWorkout()
  const replaceExercise = useReplaceWorkoutExercise(session.id)
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [exitConfirmOpen, setExitConfirmOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(0)

  const sessionExercises = session.routine_day.workout_exercises.map((we) => {
    const exercise = session.exerciseSwaps[we.id] ?? we.exercise
    const sets = session.workout_sets.filter(
      (s) => s.workout_exercise_id === we.id
    )
    const completed = sets.length > 0 && sets.every((s) => s.completed)
    return {
      workoutExercise: we,
      exercise,
      sets,
      completed,
      isSwapped: Boolean(session.exerciseSwaps[we.id]),
    }
  })

  const clampedIndex = Math.min(activeIndex, sessionExercises.length - 1)
  const active = sessionExercises[clampedIndex]

  function handleFinish() {
    finishWorkout.mutate(session.id, {
      onSuccess: () => {
        toast.success(t("workoutFinished"))
        router.push("/entrenar")
      },
    })
  }

  function handleExit() {
    discardWorkout.mutate(session.id, {
      onSuccess: () => router.push("/entrenar"),
    })
  }

  return (
    <div className="flex flex-col pb-6">
      <WorkoutHeader
        title={session.routine_day.name}
        startedAt={session.started_at}
        onBack={() => setExitConfirmOpen(true)}
        onFinish={() => setConfirmOpen(true)}
        isFinishing={finishWorkout.isPending}
      />

      {active && (
        <div className="flex flex-col gap-4 p-4">
          <ExerciseStrip
            items={sessionExercises.map((se) => ({
              id: se.workoutExercise.id,
              exercise: se.exercise,
              completed: se.completed,
            }))}
            activeIndex={clampedIndex}
            onSelect={setActiveIndex}
          />

          <ActiveExerciseCard
            workoutId={session.id}
            workoutExercise={active.workoutExercise}
            exercise={active.exercise}
            sets={active.sets}
            lastSets={lastSetsByExercise[active.exercise.id] ?? []}
            isSwapped={active.isSwapped}
            isLast={clampedIndex >= sessionExercises.length - 1}
            onSkip={() =>
              setActiveIndex((i) =>
                Math.min(i + 1, sessionExercises.length - 1)
              )
            }
            onReplace={(exerciseId) =>
              replaceExercise.mutate({
                workoutExerciseId: active.workoutExercise.id,
                exerciseId,
              })
            }
          />
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("finishConfirmTitle")}
        description={t("finishConfirmDescription")}
        isPending={finishWorkout.isPending}
        onConfirm={handleFinish}
        confirmLabel={t("finishWorkout")}
        variant="default"
      />

      <ConfirmDialog
        open={exitConfirmOpen}
        onOpenChange={setExitConfirmOpen}
        title={t("exitConfirmTitle")}
        description={t("exitConfirmDescription")}
        isPending={discardWorkout.isPending}
        onConfirm={handleExit}
        confirmLabel={t("exitConfirm")}
        variant="destructive"
      />
    </div>
  )
}
