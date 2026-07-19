"use client"

import { CheckIcon } from "lucide-react"
import { useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import { getExerciseMediaUrl } from "@/lib/exercise-media"
import { getExerciseName, type ExerciseListItem } from "@/types/domain"

export function ExerciseStrip({
  items,
  activeIndex,
  onSelect,
}: {
  items: { id: string; exercise: ExerciseListItem; completed: boolean }[]
  activeIndex: number
  onSelect: (index: number) => void
}) {
  const locale = useLocale()

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(index)}
          className={cn(
            "relative size-14 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
            index === activeIndex
              ? "border-primary"
              : "border-transparent opacity-70"
          )}
        >
          <img
            src={getExerciseMediaUrl(item.exercise.image_path)}
            alt={getExerciseName(item.exercise, locale)}
            width={56}
            height={56}
            loading="lazy"
            className="size-full object-cover"
          />
          {item.completed && (
            <span className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <CheckIcon className="size-2.5" />
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
