"use client"

import * as React from "react"
import { SearchIcon, XIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function HistoryFilters({
  search: initialSearch,
  dateFrom: initialDateFrom,
  dateTo: initialDateTo,
}: {
  search: string
  dateFrom: string
  dateTo: string
}) {
  const t = useTranslations("history")
  const router = useRouter()
  const [search, setSearch] = React.useState(initialSearch)

  React.useEffect(() => setSearch(initialSearch), [initialSearch])

  function pushQuery(overrides: {
    search?: string
    dateFrom?: string
    dateTo?: string
  }) {
    const nextSearch = overrides.search ?? search
    const nextFrom = overrides.dateFrom ?? initialDateFrom
    const nextTo = overrides.dateTo ?? initialDateTo
    const query: Record<string, string> = {}
    if (nextSearch) query.search = nextSearch
    if (nextFrom) query.from = nextFrom
    if (nextTo) query.to = nextTo
    router.push({ pathname: "/historial", query })
  }

  React.useEffect(() => {
    if (search === initialSearch) return
    const id = setTimeout(() => pushQuery({ search }), 300)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const hasFilters = Boolean(initialSearch || initialDateFrom || initialDateTo)

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="pl-8"
        />
      </div>
      <div className="flex items-end gap-2">
        <div className="flex flex-1 flex-col gap-1">
          <label className="text-[11px] text-muted-foreground">
            {t("dateFrom")}
          </label>
          <Input
            type="date"
            value={initialDateFrom}
            max={initialDateTo || undefined}
            onChange={(e) => pushQuery({ dateFrom: e.target.value })}
          />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <label className="text-[11px] text-muted-foreground">
            {t("dateTo")}
          </label>
          <Input
            type="date"
            value={initialDateTo}
            min={initialDateFrom || undefined}
            onChange={(e) => pushQuery({ dateTo: e.target.value })}
          />
        </div>
        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={t("clearFilters")}
            onClick={() => {
              setSearch("")
              router.push({ pathname: "/historial", query: {} })
            }}
          >
            <XIcon className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
