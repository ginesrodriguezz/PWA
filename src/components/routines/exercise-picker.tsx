"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { ExerciseCard } from "@/components/cards/exercise-card"
import { MuscleGroupFilter } from "@/components/exercises/muscle-group-filter"
import { useExercises } from "@/hooks/use-exercises"
import type { MuscleGroup } from "@/types/domain"
import { cn } from "@/lib/utils"

export function ExercisePicker({
  open,
  onOpenChange,
  existingExerciseIds,
  onAdd,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingExerciseIds: string[]
  onAdd: (exerciseId: string) => void
}) {
  const t = useTranslations("exercises")
  const [search, setSearch] = React.useState("")
  const [muscleGroup, setMuscleGroup] = React.useState<MuscleGroup | "all">(
    "all"
  )

  const { data: exercises, isLoading } = useExercises({ search, muscleGroup })
  const existing = new Set(existingExerciseIds)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85dvh]">
        <SheetHeader>
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription className="sr-only">{t("title")}</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-3 px-4">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="pl-8"
            />
          </div>

          <MuscleGroupFilter value={muscleGroup} onChange={setMuscleGroup} />
        </div>

        <div
          className={cn(
            "flex flex-col gap-2 overflow-y-auto px-4 pb-4",
            isLoading && "opacity-50"
          )}
        >
          {exercises?.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {t("noResults")}
            </p>
          )}
          {exercises?.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              added={existing.has(exercise.id)}
              onAdd={() => onAdd(exercise.id)}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
