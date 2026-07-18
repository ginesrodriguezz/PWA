"use client"

import * as React from "react"
import { PlusIcon, Trash2Icon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/feedback/confirm-dialog"
import { ExercisePicker } from "@/components/routines/exercise-picker"
import { SortableList } from "@/components/dnd/sortable-list"
import {
  useAddWorkoutExercise,
  useDeleteRoutineDay,
  useRemoveWorkoutExercise,
  useReorderWorkoutExercises,
  useUpdateRoutineDay,
  useUpdateWorkoutExercise,
} from "@/hooks/use-routines"
import { BODY_PART_LABEL_KEYS } from "@/types/domain"
import type { RoutineDayWithExercises } from "@/types/domain"

export function DayCard({
  routineId,
  day,
}: {
  routineId: string
  day: RoutineDayWithExercises
}) {
  const t = useTranslations("routines")
  const tExercises = useTranslations("exercises")
  const [name, setName] = React.useState(day.name)
  const [pickerOpen, setPickerOpen] = React.useState(false)
  const [confirmDelete, setConfirmDelete] = React.useState(false)

  const updateDay = useUpdateRoutineDay(routineId)
  const deleteDay = useDeleteRoutineDay(routineId)
  const addExercise = useAddWorkoutExercise(routineId)
  const removeExercise = useRemoveWorkoutExercise(routineId)
  const updateExercise = useUpdateWorkoutExercise(routineId)
  const reorderExercises = useReorderWorkoutExercises(routineId)

  React.useEffect(() => setName(day.name), [day.name])

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => {
            if (name.trim() && name !== day.name) {
              updateDay.mutate({ id: day.id, patch: { name: name.trim() } })
            }
          }}
          className="h-8 max-w-[60%] border-none px-0 text-base font-semibold shadow-none focus-visible:ring-0"
        />
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={() => setConfirmDelete(true)}
          aria-label="delete-day"
        >
          <Trash2Icon className="size-4 text-destructive" />
        </Button>
      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        {t("exercisesInDay", { count: day.workout_exercises.length })}
      </p>

      {day.workout_exercises.length > 0 && (
        <SortableList
          className="mt-3"
          items={day.workout_exercises}
          getId={(we) => we.id}
          onReorder={(reordered) =>
            reorderExercises.mutate(
              reordered.map((we, index) => ({ id: we.id, order: index }))
            )
          }
          renderItem={(we) => (
            <div className="flex items-center justify-between gap-2 rounded-lg border bg-background px-3 py-2">
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate text-sm font-medium">
                  {we.exercise.name}
                </span>
                <Badge variant="secondary" className="w-fit text-[10px]">
                  {tExercises(`bodyParts.${BODY_PART_LABEL_KEYS[we.exercise.body_part]}`)}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  max={20}
                  defaultValue={we.target_sets}
                  className="h-8 w-14 text-center"
                  aria-label={t("targetSets")}
                  onBlur={(e) => {
                    const value = Number(e.target.value)
                    if (value > 0 && value !== we.target_sets) {
                      updateExercise.mutate({
                        id: we.id,
                        patch: { target_sets: value },
                      })
                    }
                  }}
                />
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => removeExercise.mutate(we.id)}
                  aria-label="remove-exercise"
                >
                  <Trash2Icon className="size-4" />
                </Button>
              </div>
            </div>
          )}
        />
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-3 w-full rounded-full"
        onClick={() => setPickerOpen(true)}
      >
        <PlusIcon className="size-4" />
        {t("addExercise")}
      </Button>

      <ExercisePicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        existingExerciseIds={day.workout_exercises.map((we) => we.exercise_id)}
        onAdd={(exerciseId) =>
          addExercise.mutate({
            routineDayId: day.id,
            exerciseId,
            order: day.workout_exercises.length,
          })
        }
      />

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={t("deleteDayConfirmTitle")}
        description={t("deleteDayConfirmDescription")}
        isPending={deleteDay.isPending}
        onConfirm={() =>
          deleteDay.mutate(day.id, { onSuccess: () => setConfirmDelete(false) })
        }
      />
    </div>
  )
}
