"use client"

import type { ReactNode } from "react"
import { CheckIcon, PlusIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { getExerciseMediaUrl } from "@/lib/exercise-media"
import {
  BODY_PART_LABEL_KEYS,
  getExerciseName,
  type ExerciseListItem,
} from "@/types/domain"

export function ExerciseCard({
  exercise,
  onAdd,
  added,
  href,
  trailing,
}: {
  exercise: ExerciseListItem
  onAdd?: () => void
  added?: boolean
  href?: string
  trailing?: ReactNode
}) {
  const t = useTranslations("exercises")
  const locale = useLocale()
  const name = getExerciseName(exercise, locale)

  const content = (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3",
        href && "transition-colors hover:bg-muted/40"
      )}
    >
      <img
        src={getExerciseMediaUrl(exercise.image_path)}
        alt={name}
        width={56}
        height={56}
        loading="lazy"
        className="size-14 shrink-0 rounded-lg object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate font-medium">{name}</span>
        <Badge variant="secondary" className="w-fit">
          {t(`bodyParts.${BODY_PART_LABEL_KEYS[exercise.body_part]}`)}
        </Badge>
      </div>
      {trailing}
      {!trailing && onAdd && (
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
