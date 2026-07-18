import { useTranslations, useFormatter } from "next-intl"
import { Link } from "@/i18n/navigation"
import type { WorkoutHistoryItem } from "@/types/domain"

export function WorkoutCard({ workout }: { workout: WorkoutHistoryItem }) {
  const t = useTranslations("history")
  const format = useFormatter()

  return (
    <Link
      href={`/historial/${workout.id}`}
      className="flex flex-col gap-1 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold">{workout.dayName}</span>
        <span className="text-xs text-muted-foreground">
          {format.dateTime(new Date(workout.started_at), {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
      <span className="text-xs text-muted-foreground">
        {workout.routineName}
      </span>
      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
        <span>
          {t("sets", { count: workout.completedSets })}/{workout.totalSets}
        </span>
        <span>
          {t("volume")}: {Math.round(workout.volume).toLocaleString()} kg
        </span>
      </div>
    </Link>
  )
}
