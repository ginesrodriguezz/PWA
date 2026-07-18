"use client"

import { CheckIcon, PlusIcon } from "lucide-react"
import { useFormatter, useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { WeightInput } from "@/components/inputs/weight-input"
import { RepInput } from "@/components/inputs/rep-input"
import { useAddWorkoutSet, useUpdateWorkoutSet } from "@/hooks/use-workout"
import { cn } from "@/lib/utils"
import type {
  LastExerciseSets,
  WorkoutExerciseWithExercise,
  WorkoutSet,
} from "@/types/domain"

export function ExerciseSessionCard({
  workoutId,
  workoutExercise,
  sets,
  lastSets,
}: {
  workoutId: string
  workoutExercise: WorkoutExerciseWithExercise
  sets: WorkoutSet[]
  lastSets: LastExerciseSets
}) {
  const t = useTranslations("workout")
  const tExercises = useTranslations("exercises")
  const format = useFormatter()

  const updateSet = useUpdateWorkoutSet(workoutId)
  const addSet = useAddWorkoutSet(workoutId)

  const sortedSets = [...sets].sort((a, b) => a.set_number - b.set_number)
  const firstLast = lastSets[0]

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold">
            {workoutExercise.exercise.name}
          </p>
          <Badge variant="secondary" className="mt-1 w-fit text-[10px]">
            {tExercises(`muscleGroups.${workoutExercise.exercise.muscle_group}`)}
          </Badge>
        </div>
        <div className="shrink-0 text-right text-xs text-muted-foreground">
          <p className="font-medium text-foreground/80">{t("lastTime")}</p>
          {firstLast ? (
            <p>
              {firstLast.weight ?? "–"} kg × {firstLast.reps ?? "–"} ·{" "}
              {format.relativeTime(new Date(firstLast.workout_started_at))}
            </p>
          ) : (
            <p>{t("noPreviousData")}</p>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {sortedSets.map((set) => {
          const last = lastSets.find((l) => l.set_number === set.set_number)
          return (
            <div
              key={set.id}
              className={cn(
                "flex items-center gap-2 rounded-lg border bg-background px-2.5 py-2",
                set.completed && "border-primary/40 bg-primary/5"
              )}
            >
              <span className="w-14 shrink-0 text-xs text-muted-foreground">
                {t("set", { number: set.set_number })}
              </span>
              <WeightInput
                value={set.weight}
                onCommit={(weight) =>
                  updateSet.mutate({ id: set.id, patch: { weight } })
                }
              />
              <RepInput
                value={set.reps}
                onCommit={(reps) =>
                  updateSet.mutate({ id: set.id, patch: { reps } })
                }
              />
              {!set.weight && !set.reps && last && (
                <span className="hidden text-[10px] text-muted-foreground sm:inline">
                  {last.weight ?? "–"}×{last.reps ?? "–"}
                </span>
              )}
              <Button
                type="button"
                size="icon-sm"
                variant={set.completed ? "default" : "outline"}
                className="ml-auto shrink-0"
                aria-label={t("completed")}
                onClick={() =>
                  updateSet.mutate({
                    id: set.id,
                    patch: { completed: !set.completed },
                  })
                }
              >
                <CheckIcon className="size-4" />
              </Button>
            </div>
          )
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-3 w-full rounded-full"
        disabled={addSet.isPending}
        onClick={() =>
          addSet.mutate({
            workoutExerciseId: workoutExercise.id,
            setNumber: sortedSets.length + 1,
          })
        }
      >
        <PlusIcon className="size-4" />
        {t("addSet")}
      </Button>
    </div>
  )
}
