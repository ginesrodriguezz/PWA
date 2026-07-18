"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { MUSCLE_GROUPS, type MuscleGroup } from "@/types/domain"

export function MuscleGroupFilter({
  value,
  onChange,
}: {
  value: MuscleGroup | "all"
  onChange: (value: MuscleGroup | "all") => void
}) {
  const t = useTranslations("exercises")

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1">
      <Button
        type="button"
        size="sm"
        variant={value === "all" ? "default" : "outline"}
        className="shrink-0 rounded-full"
        onClick={() => onChange("all")}
      >
        {t("allMuscleGroups")}
      </Button>
      {MUSCLE_GROUPS.map((mg) => (
        <Button
          key={mg}
          type="button"
          size="sm"
          variant={value === mg ? "default" : "outline"}
          className="shrink-0 rounded-full"
          onClick={() => onChange(mg)}
        >
          {t(`muscleGroups.${mg}`)}
        </Button>
      ))}
    </div>
  )
}
