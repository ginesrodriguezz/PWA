"use client"

import { PlayIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter, Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { useStartWorkout } from "@/hooks/use-workout"
import type { RoutineDay } from "@/types/domain"

type DayWithRoutine = RoutineDay & {
  routine: { id: string; name: string }
  exerciseCount: number
}

export function EntrenarView({ days }: { days: DayWithRoutine[] }) {
  const t = useTranslations("workout")
  const tRoutines = useTranslations("routines")
  const router = useRouter()
  const startWorkout = useStartWorkout()

  function handleStart(dayId: string) {
    startWorkout.mutate(dayId, {
      onSuccess: (workout) => router.push(`/entrenar/${workout.id}`),
    })
  }

  if (days.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 p-4 pt-16 text-center">
        <p className="font-medium">{t("noRoutineDays")}</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          {t("noRoutineDaysDescription")}
        </p>
        <Link href="/rutinas/nueva">
          <Button className="mt-2 rounded-full">
            {t("createRoutineFirst")}
          </Button>
        </Link>
      </div>
    )
  }

  const byRoutine = new Map<string, { name: string; days: DayWithRoutine[] }>()
  for (const day of days) {
    const entry = byRoutine.get(day.routine.id) ?? {
      name: day.routine.name,
      days: [],
    }
    entry.days.push(day)
    byRoutine.set(day.routine.id, entry)
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <h1 className="text-xl font-semibold">{t("startWorkout")}</h1>

      {[...byRoutine.entries()].map(([routineId, group]) => (
        <div key={routineId} className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-muted-foreground">
            {group.name}
          </h2>
          <div className="flex flex-col gap-2">
            {group.days.map((day) => (
              <div
                key={day.id}
                className="flex items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{day.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {tRoutines("exercisesInDay", { count: day.exerciseCount })}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="shrink-0 rounded-full"
                  disabled={startWorkout.isPending}
                  onClick={() => handleStart(day.id)}
                >
                  <PlayIcon className="size-4" />
                  {t("startWorkout")}
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
