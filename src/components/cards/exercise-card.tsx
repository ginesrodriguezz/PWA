"use client"

import { CheckIcon, PlusIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import type { Exercise } from "@/types/domain"

export function ExerciseCard({
  exercise,
  onAdd,
  added,
  href,
}: {
  exercise: Exercise
  onAdd?: () => void
  added?: boolean
  href?: string
}) {
  const t = useTranslations("exercises")

  const content = (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3",
        href && "transition-colors hover:bg-muted/40"
      )}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <span className="truncate font-medium">{exercise.name}</span>
        <Badge variant="secondary" className="w-fit">
          {t(`muscleGroups.${exercise.muscle_group}`)}
        </Badge>
      </div>
      {onAdd && (
        <Button
          type="button"
          size="icon-sm"
          variant={added ? "secondary" : "outline"}
          onClick={onAdd}
          disabled={added}
          aria-label="add"
        >
          {added ? (
            <CheckIcon className="size-4" />
          ) : (
            <PlusIcon className="size-4" />
          )}
        </Button>
      )}
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
