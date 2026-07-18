"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Input } from "@/components/ui/input"
import { ExerciseCard } from "@/components/cards/exercise-card"
import { MuscleGroupFilter } from "@/components/exercises/muscle-group-filter"
import { useExercises } from "@/hooks/use-exercises"
import type { Exercise, MuscleGroup } from "@/types/domain"

export function ExerciseLibraryView({
  initialExercises,
}: {
  initialExercises: Exercise[]
}) {
  const t = useTranslations("exercises")
  const [search, setSearch] = React.useState("")
  const [muscleGroup, setMuscleGroup] = React.useState<MuscleGroup | "all">(
    "all"
  )

  const { data: exercises } = useExercises({ search, muscleGroup })
  const list =
    search === "" && muscleGroup === "all"
      ? (exercises ?? initialExercises)
      : (exercises ?? [])

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-semibold">{t("title")}</h1>

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

      <div className="flex flex-col gap-2">
        {list.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {t("noResults")}
          </p>
        )}
        {list.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </div>
  )
}
