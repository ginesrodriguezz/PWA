"use client"

import * as React from "react"
import { LibraryIcon, PlusIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { RoutineCard } from "@/components/cards/routine-card"
import { ConfirmDialog } from "@/components/feedback/confirm-dialog"
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list"
import { useDeleteRoutine, useRoutines } from "@/hooks/use-routines"
import type { Routine } from "@/types/domain"

type RoutineWithDayCount = Routine & { dayCount: number }

export function RoutinesView({
  userId,
  initialRoutines,
}: {
  userId: string
  initialRoutines: RoutineWithDayCount[]
}) {
  const t = useTranslations("routines")
  const { data: routines } = useRoutines(userId)
  const deleteRoutine = useDeleteRoutine()
  const [pendingDelete, setPendingDelete] = React.useState<string | null>(
    null
  )

  const list = routines ?? initialRoutines

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">{t("title")}</h1>
        <div className="flex items-center gap-2">
          <Link href="/biblioteca">
            <Button size="sm" variant="outline" className="rounded-full">
              <LibraryIcon className="size-4" />
            </Button>
          </Link>
          <Link href="/rutinas/nueva">
            <Button size="sm" className="rounded-full">
              <PlusIcon className="size-4" />
              {t("newRoutine")}
            </Button>
          </Link>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
          <p className="font-medium">{t("noRoutines")}</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            {t("noRoutinesDescription")}
          </p>
          <Link href="/rutinas/nueva">
            <Button className="mt-2 rounded-full">{t("createFirst")}</Button>
          </Link>
        </div>
      ) : (
        <StaggerList className="flex flex-col gap-3">
          {list.map((routine) => (
            <StaggerItem key={routine.id}>
              <RoutineCard
                routine={routine}
                dayCount={routine.dayCount}
                onDelete={() => setPendingDelete(routine.id)}
              />
            </StaggerItem>
          ))}
        </StaggerList>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title={t("deleteRoutineConfirmTitle")}
        description={t("deleteRoutineConfirmDescription")}
        isPending={deleteRoutine.isPending}
        onConfirm={() => {
          if (pendingDelete) {
            deleteRoutine.mutate(pendingDelete, {
              onSuccess: () => setPendingDelete(null),
            })
          }
        }}
      />
    </div>
  )
}
