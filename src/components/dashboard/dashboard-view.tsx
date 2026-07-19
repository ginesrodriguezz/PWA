import {
  BarChart3Icon,
  CalendarIcon,
  DumbbellIcon,
  FlameIcon,
  TrendingUpIcon,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { StatsCard } from "@/components/cards/stats-card"
import { WeeklyVolumeChart } from "@/components/dashboard/weekly-volume-chart"
import type { DashboardStats } from "@/types/domain"

export async function DashboardView({
  stats,
  userName,
}: {
  stats: DashboardStats
  userName: string
}) {
  const t = await getTranslations("dashboard")
  const tWorkout = await getTranslations("workout")

  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">
          {t("title")} · {userName}
        </h1>
        <Link href="/estadisticas">
          <Button
            size="sm"
            variant="outline"
            className="rounded-full"
            aria-label={t("viewStats")}
          >
            <BarChart3Icon className="size-4" />
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <p className="text-xs font-medium text-muted-foreground">
          {t("nextWorkout")}
        </p>
        {stats.nextDay ? (
          <div className="mt-2 flex items-center justify-between gap-2">
            <div>
              <p className="font-semibold">{stats.nextDay.name}</p>
              <p className="text-xs text-muted-foreground">
                {stats.nextDay.routineName}
              </p>
            </div>
            <Link href="/entrenar">
              <Button size="sm" className="rounded-full">
                {tWorkout("startWorkout")}
              </Button>
            </Link>
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            {t("noNextWorkout")}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatsCard
          label={t("totalWorkouts")}
          value={stats.totalWorkouts.toString()}
          icon={DumbbellIcon}
        />
        <StatsCard
          label={t("weeklyStreak")}
          value={stats.weeklyStreak.toString()}
          icon={FlameIcon}
        />
        <StatsCard
          label={t("totalVolume")}
          value={`${Math.round(stats.totalVolumeKg).toLocaleString()} kg`}
          icon={TrendingUpIcon}
        />
        <StatsCard
          label={t("workoutsThisMonth")}
          value={stats.workoutsThisMonth.toString()}
          icon={CalendarIcon}
        />
      </div>

      <div className="rounded-xl border bg-card p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          {t("weeklyVolumeChart")}
        </p>
        <WeeklyVolumeChart data={stats.weeklyVolume} />
      </div>

      {stats.lastWorkout && (
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">
            {t("lastWorkout")}
          </p>
          <p className="mt-1 font-semibold">{stats.lastWorkout.dayName}</p>
          <p className="text-xs text-muted-foreground">
            {stats.lastWorkout.routineName}
          </p>
        </div>
      )}
    </div>
  )
}
