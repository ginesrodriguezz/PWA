"use client"

import * as React from "react"
import {
  ArrowRightIcon,
  CheckIcon,
  InfoIcon,
  ListOrderedIcon,
  PlusIcon,
  RefreshCwIcon,
} from "lucide-react"
import { useFormatter, useLocale, useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ExercisePicker } from "@/components/routines/exercise-picker"
import { WeightInput } from "@/components/inputs/weight-input"
import { RepInput } from "@/components/inputs/rep-input"
import { useAddWorkoutSet, useUpdateWorkoutSet } from "@/hooks/use-workout"
import { getExerciseMediaUrl } from "@/lib/exercise-media"
import { cn } from "@/lib/utils"
import { BODY_PART_LABEL_KEYS, getExerciseName } from "@/types/domain"
import type {
  Exercise,
  LastExerciseSets,
  WorkoutExerciseWithExercise,
  WorkoutSet,
} from "@/types/domain"

export function ActiveExerciseCard({
  workoutId,
  workoutExercise,
  exercise,
  sets,
  lastSets,
  isSwapped,
  isLast,
  onReplace,
  onSkip,
}: {
  workoutId: string
  workoutExercise: WorkoutExerciseWithExercise
  exercise: Exercise
  sets: WorkoutSet[]
  lastSets: LastExerciseSets
  isSwapped: boolean
  isLast: boolean
  onReplace: (exerciseId: string) => void
  onSkip: () => void
}) {
  const t = useTranslations("workout")
  const tExercises = useTranslations("exercises")
  const format = useFormatter()
  const locale = useLocale()

  const [instructionsOpen, setInstructionsOpen] = React.useState(false)
  const [stepsOpen, setStepsOpen] = React.useState(false)
  const [pickerOpen, setPickerOpen] = React.useState(false)

  const updateSet = useUpdateWorkoutSet(workoutId)
  const addSet = useAddWorkoutSet(workoutId)

  const sortedSets = [...sets].sort((a, b) => a.set_number - b.set_number)
  const firstLast = lastSets[0]
  const name = getExerciseName(exercise, locale)
  const instructions =
    locale === "es" ? exercise.instructions_es : exercise.instructions_en
  const steps =
    locale === "es" ? exercise.instruction_steps_es : exercise.instruction_steps_en

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <img
          src={getExerciseMediaUrl(exercise.gif_path)}
          alt={name}
          width={400}
          height={400}
          className="aspect-square w-full rounded-xl border object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-1.5">
          <Button
            type="button"
            size="icon-sm"
            variant="secondary"
            className="rounded-full shadow"
            aria-label={tExercises("instructions")}
            onClick={() => setInstructionsOpen(true)}
          >
            <InfoIcon className="size-4" />
          </Button>
          {steps.length > 0 && (
            <Button
              type="button"
              size="icon-sm"
              variant="secondary"
              className="rounded-full shadow"
              aria-label={t("steps")}
              onClick={() => setStepsOpen(true)}
            >
              <ListOrderedIcon className="size-4" />
            </Button>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <h2 className="truncate text-lg font-semibold">{name}</h2>
          {isSwapped && <Badge variant="secondary">{t("swapped")}</Badge>}
        </div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <Badge variant="secondary" className="w-fit text-[10px]">
            {tExercises(`bodyParts.${BODY_PART_LABEL_KEYS[exercise.body_part]}`)}
          </Badge>
          <div className="text-right text-xs text-muted-foreground">
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
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1 rounded-full"
          disabled={isLast}
          onClick={onSkip}
        >
          <ArrowRightIcon className="size-4" />
          {t("skipExercise")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1 rounded-full"
          onClick={() => setPickerOpen(true)}
        >
          <RefreshCwIcon className="size-4" />
          {t("replaceExercise")}
        </Button>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <div className="flex flex-col gap-2">
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
          loading={addSet.isPending}
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

      <Sheet open={instructionsOpen} onOpenChange={setInstructionsOpen}>
        <SheetContent side="bottom" className="max-h-[70dvh]">
          <SheetHeader>
            <SheetTitle>{tExercises("instructions")}</SheetTitle>
            <SheetDescription className="sr-only">{name}</SheetDescription>
          </SheetHeader>
          <p className="overflow-y-auto px-4 pb-4 text-sm text-muted-foreground">
            {instructions}
          </p>
        </SheetContent>
      </Sheet>

      <Sheet open={stepsOpen} onOpenChange={setStepsOpen}>
        <SheetContent side="bottom" className="max-h-[70dvh]">
          <SheetHeader>
            <SheetTitle>{t("steps")}</SheetTitle>
            <SheetDescription className="sr-only">{name}</SheetDescription>
          </SheetHeader>
          <ol className="flex list-inside list-decimal flex-col gap-2 overflow-y-auto px-4 pb-4 text-sm text-muted-foreground">
            {steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </SheetContent>
      </Sheet>

      <ExercisePicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        existingExerciseIds={[exercise.id]}
        title={t("chooseReplacement")}
        onAdd={(exerciseId) => {
          onReplace(exerciseId)
          setPickerOpen(false)
        }}
      />
    </div>
  )
}
