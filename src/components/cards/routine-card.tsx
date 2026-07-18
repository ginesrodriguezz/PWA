"use client"

import { MoreVerticalIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Routine } from "@/types/domain"

export function RoutineCard({
  routine,
  dayCount,
  onDelete,
}: {
  routine: Routine
  dayCount: number
  onDelete?: () => void
}) {
  const t = useTranslations("routines")
  const tCommon = useTranslations("common")

  return (
    <div className="relative rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40">
      <Link href={`/rutinas/${routine.id}`} className="block pr-8">
        <h3 className="font-semibold">{routine.name}</h3>
        {routine.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {routine.description}
          </p>
        )}
        <p className="mt-2 text-xs text-muted-foreground">
          {t("dayCount", { count: dayCount })}
        </p>
      </Link>

      {onDelete && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                size="icon-sm"
                variant="ghost"
                className="absolute top-3 right-3"
              />
            }
          >
            <MoreVerticalIcon className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              {tCommon("delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
