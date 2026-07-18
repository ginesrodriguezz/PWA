"use client"

import * as React from "react"
import { ArrowLeftIcon, PlusIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SortableList } from "@/components/dnd/sortable-list"
import { DayCard } from "@/components/routines/day-card"
import {
  useCreateRoutineDay,
  useReorderRoutineDays,
  useRoutine,
  useUpdateRoutine,
} from "@/hooks/use-routines"
import type { RoutineWithDays } from "@/types/domain"

export function RoutineEditor({ routine }: { routine: RoutineWithDays }) {
  const t = useTranslations("routines")
  const tCommon = useTranslations("common")
  const { data } = useRoutine(routine.id, routine)
  const current = data ?? routine

  const reorderDays = useReorderRoutineDays(routine.id)
  const createDay = useCreateRoutineDay(routine.id)
  const updateRoutine = useUpdateRoutine(routine.id)

  const [newDayName, setNewDayName] = React.useState("")
  const [editOpen, setEditOpen] = React.useState(false)
  const [editName, setEditName] = React.useState(current.name)
  const [editDescription, setEditDescription] = React.useState(
    current.description ?? ""
  )

  function handleAddDay(e: React.FormEvent) {
    e.preventDefault()
    if (!newDayName.trim()) return
    createDay.mutate(
      { name: newDayName.trim(), order: current.routine_days.length },
      { onSuccess: () => setNewDayName("") }
    )
  }

  function handleSaveRoutine() {
    if (!editName.trim()) return
    updateRoutine.mutate(
      { name: editName.trim(), description: editDescription.trim() },
      {
        onSuccess: () => {
          toast.success(t("saved"))
          setEditOpen(false)
        },
      }
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <Link
        href="/rutinas"
        className="flex w-fit items-center gap-1 text-sm text-muted-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        {t("backToRoutines")}
      </Link>

      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">{current.name}</h1>
          {current.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {current.description}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setEditName(current.name)
            setEditDescription(current.description ?? "")
            setEditOpen(true)
          }}
        >
          {tCommon("edit")}
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          {t("days")}
        </h2>

        {current.routine_days.length === 0 && (
          <p className="text-sm text-muted-foreground">{t("noDays")}</p>
        )}

        <SortableList
          items={current.routine_days}
          getId={(day) => day.id}
          onReorder={(reordered) =>
            reorderDays.mutate(
              reordered.map((day, index) => ({ id: day.id, order: index }))
            )
          }
          renderItem={(day) => (
            <DayCard routineId={routine.id} day={day} />
          )}
        />

        <form onSubmit={handleAddDay} className="flex gap-2">
          <Input
            value={newDayName}
            onChange={(e) => setNewDayName(e.target.value)}
            placeholder={t("dayNamePlaceholder")}
          />
          <Button type="submit" disabled={createDay.isPending}>
            <PlusIcon className="size-4" />
            {t("addDay")}
          </Button>
        </form>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editRoutine")}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder={t("routineNamePlaceholder")}
            />
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder={t("descriptionPlaceholder")}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              {tCommon("cancel")}
            </Button>
            <Button
              onClick={handleSaveRoutine}
              disabled={updateRoutine.isPending}
            >
              {tCommon("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
