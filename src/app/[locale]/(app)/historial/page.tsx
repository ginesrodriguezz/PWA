import { getTranslations } from "next-intl/server"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getWorkoutHistory } from "@/services/history"
import { WorkoutCard } from "@/components/cards/workout-card"
import { HistoryFilters } from "@/components/history/history-filters"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"

export default async function HistorialPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; from?: string; to?: string }>
}) {
  const {
    page: pageParam,
    search = "",
    from = "",
    to = "",
  } = await searchParams
  const page = Math.max(0, Number(pageParam) || 0)
  const hasFilters = Boolean(search || from || to)

  const supabase = await createClient()
  const t = await getTranslations("history")

  const { items, totalCount, pageSize } = await getWorkoutHistory(
    supabase,
    page,
    { search, dateFrom: from, dateTo: to }
  )

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const query: Record<string, string> = {}
  if (search) query.search = search
  if (from) query.from = from
  if (to) query.to = to

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-semibold">{t("title")}</h1>

      <HistoryFilters search={search} dateFrom={from} dateTo={to} />

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <p className="font-medium">
            {hasFilters ? t("noResults") : t("noWorkouts")}
          </p>
          {!hasFilters && (
            <p className="max-w-xs text-sm text-muted-foreground">
              {t("noWorkoutsDescription")}
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {items.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              {page > 0 ? (
                <Link
                  href={{
                    pathname: "/historial",
                    query: { ...query, page: page - 1 },
                  }}
                >
                  <Button variant="outline" size="sm">
                    <ChevronLeftIcon className="size-4" />
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeftIcon className="size-4" />
                </Button>
              )}
              <span className="text-xs text-muted-foreground">
                {t("page", { page: page + 1 })} / {totalPages}
              </span>
              {page < totalPages - 1 ? (
                <Link
                  href={{
                    pathname: "/historial",
                    query: { ...query, page: page + 1 },
                  }}
                >
                  <Button variant="outline" size="sm">
                    <ChevronRightIcon className="size-4" />
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <ChevronRightIcon className="size-4" />
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
