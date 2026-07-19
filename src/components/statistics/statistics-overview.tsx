"use client"

import * as React from "react"
import {
  DumbbellIcon,
  FlameIcon,
  MinusIcon,
  SearchIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  TrophyIcon,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Input } from "@/components/ui/input"
import { StatsCard } from "@/components/cards/stats-card"
import { ExerciseCard } from "@/components/cards/exercise-card"
import { BodyPartFilter } from "@/components/exercises/body-part-filter"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getExerciseName } from "@/types/domain"
import type { BodyPart, ExercisePRSummary, StatisticsOverview } from "@/types/domain"

type SortOption = "recent" | "alphabetical" | "highestPR"

function TrendIndicator({ deltaKg }: { deltaKg: number | null }) {
  if (deltaKg === null) return null
  if (deltaKg > 0) {
    return (
      <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-500">
        <TrendingUpIcon className="size-3.5" />+{deltaKg}
      </span>
    )
  }
  if (deltaKg < 0) {
    return (
      <span className="flex items-center gap-0.5 text-xs font-medium text-red-600 dark:text-red-500">
        <TrendingDownIcon className="size-3.5" />
        {deltaKg}
      </span>
    )
  }
  return (
    <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
      <MinusIcon className="size-3.5" />
    </span>
  )
}

export function StatisticsOverviewView({
  overview,
}: {
  overview: StatisticsOverview
}) {
  const t = useTranslations("statistics")
  const tExercises = useTranslations("exercises")
  const locale = useLocale()

  const [search, setSearch] = React.useState("")
  const [bodyPart, setBodyPart] = React.useState<BodyPart | "all">("all")
  const [sort, setSort] = React.useState<SortOption>("recent")

  const strongestLift = overview.exercises.find(
    (e) => e.exerciseId === overview.strongestLift?.exerciseId
  )

  const filtered = overview.exercises.filter((e) => {
    if (bodyPart !== "all" && e.exercise.body_part !== bodyPart) return false
    if (search) {
      const name = getExerciseName(e.exercise, locale).toLowerCase()
      if (!name.includes(search.toLowerCase())) return false
    }
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "alphabetical") {
      return getExerciseName(a.exercise, locale).localeCompare(
        getExerciseName(b.exercise, locale)
      )
    }
    if (sort === "highestPR") {
      return b.personalRecordKg - a.personalRecordKg
    }
    return (
      new Date(b.lastSessionDate).getTime() -
      new Date(a.lastSessionDate).getTime()
    )
  })

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="text-xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {overview.totalExercisesTracked === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          {t("noWorkoutsYet")}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <StatsCard
              label={t("exercisesTracked")}
              value={overview.totalExercisesTracked.toString()}
              icon={DumbbellIcon}
            />
            <StatsCard
              label={t("recentPRs")}
              value={overview.recentPRCount.toString()}
              icon={FlameIcon}
            />
            <StatsCard
              label={t("allTimeVolume")}
              value={`${Math.round(overview.allTimeVolumeKg).toLocaleString()} kg`}
              icon={TrendingUpIcon}
            />
            <StatsCard
              label={t("strongestLift")}
              value={
                strongestLift
                  ? `${getExerciseName(strongestLift.exercise, locale)} · ${strongestLift.personalRecordKg} kg`
                  : "—"
              }
              icon={TrophyIcon}
            />
          </div>

          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tExercises("searchPlaceholder")}
              className="pl-8"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 overflow-x-auto">
              <BodyPartFilter value={bodyPart} onChange={setBodyPart} />
            </div>
            <Select
              value={sort}
              onValueChange={(next) => {
                if (typeof next === "string") setSort(next as SortOption)
              }}
            >
              <SelectTrigger size="sm" className="shrink-0" aria-label={t("sortBy")}>
                <SelectValue>
                  {(value: SortOption) => t(`sort.${value}`)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">{t("sort.recent")}</SelectItem>
                <SelectItem value="alphabetical">
                  {t("sort.alphabetical")}
                </SelectItem>
                <SelectItem value="highestPR">{t("sort.highestPR")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            {sorted.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                {tExercises("noResults")}
              </p>
            )}
            {sorted.map((item) => (
              <ExercisePRRow key={item.exerciseId} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function ExercisePRRow({ item }: { item: ExercisePRSummary }) {
  const t = useTranslations("statistics")

  return (
    <ExerciseCard
      exercise={item.exercise}
      href={`/estadisticas/${item.exerciseId}`}
      trailing={
        <div className="flex shrink-0 flex-col items-end gap-1">
          <div className="flex items-center gap-1">
            {item.isRecentPR && (
              <FlameIcon
                className="size-4 text-orange-500"
                aria-label={t("newPr")}
              />
            )}
            <span className="text-sm font-semibold tabular-nums">
              {item.personalRecordKg} kg
            </span>
          </div>
          <TrendIndicator deltaKg={item.trendDeltaKg} />
        </div>
      }
    />
  )
}
