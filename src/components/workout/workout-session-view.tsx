"use client"

import * as React from "react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { WorkoutHeader } from "@/components/workout/workout-header"
import { ExerciseSessionCard } from "@/components/workout/exercise-session-card"
import { ConfirmDialog } from "@/components/feedback/confirm-dialog"
import { useFinishWorkout, useWorkoutSession } from "@/hooks/use-workout"
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
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  function handleFinish() {
    finishWorkout.mutate(session.id, {
      onSuccess: () => {
        toast.success(t("workoutFinished"))
        router.push("/entrenar")
      },
    })
  }

  return (
    <div className="flex flex-col pb-6">
      <WorkoutHeader
        title={session.routine_day.name}
        startedAt={session.started_at}
        onFinish={() => setConfirmOpen(true)}
        isFinishing={finishWorkout.isPending}
      />

      <div className="flex flex-col gap-3 p-4">
        {session.routine_day.workout_exercises.map((we) => (
          <ExerciseSessionCard
            key={we.id}
            workoutId={session.id}
            workoutExercise={we}
            sets={session.workout_sets.filter(
              (s) => s.workout_exercise_id === we.id
            )}
            lastSets={lastSetsByExercise[we.exercise_id] ?? []}
          />
        ))}
      </div>

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
    </div>
  )
}
