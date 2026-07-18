import { ArrowLeftIcon, CheckIcon } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { BODY_PART_LABEL_KEYS, getExerciseName } from "@/types/domain"
import type { WorkoutSession } from "@/types/domain"

function formatDuration(startedAt: string, finishedAt: string) {
  const ms = new Date(finishedAt).getTime() - new Date(startedAt).getTime()
  const minutes = Math.round(ms / 60000)
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ${minutes % 60}min`
}

export async function WorkoutDetailView({
  session,
}: {
  session: WorkoutSession
}) {
  const t = await getTranslations("history")
  const tExercises = await getTranslations("exercises")
  const tWorkout = await getTranslations("workout")
  const locale = await getLocale()
  const format = new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="flex flex-col gap-4 p-4">
      <Link
        href="/historial"
        className="flex w-fit items-center gap-1 text-sm text-muted-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        {t("title")}
      </Link>

      <div>
        <h1 className="text-xl font-semibold">{session.routine_day.name}</h1>
        <p className="text-sm text-muted-foreground">
          {format.format(new Date(session.started_at))} ·{" "}
          {session.finished_at &&
            formatDuration(session.started_at, session.finished_at)}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {session.routine_day.workout_exercises.map((we) => {
          const sets = session.workout_sets
            .filter((s) => s.workout_exercise_id === we.id)
            .sort((a, b) => a.set_number - b.set_number)

          return (
            <div key={we.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">
                  {getExerciseName(we.exercise, locale)}
                </p>
                <Badge variant="secondary" className="text-[10px]">
                  {tExercises(`bodyParts.${BODY_PART_LABEL_KEYS[we.exercise.body_part]}`)}
                </Badge>
              </div>
              <div className="mt-2 flex flex-col gap-1.5">
                {sets.map((set) => (
                  <div
                    key={set.id}
                    className={cn(
                      "flex items-center justify-between rounded-lg border px-3 py-1.5 text-sm",
                      set.completed
                        ? "border-primary/40 bg-primary/5"
                        : "text-muted-foreground"
                    )}
                  >
                    <span>{tWorkout("set", { number: set.set_number })}</span>
                    <span className="flex items-center gap-2">
                      {set.weight ?? "–"} kg × {set.reps ?? "–"}
                      {set.completed && (
                        <CheckIcon className="size-3.5 text-primary" />
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
