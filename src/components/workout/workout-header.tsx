"use client"

import * as React from "react"
import { ArrowLeftIcon, CheckIcon, TimerIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"

function formatElapsed(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (n: number) => n.toString().padStart(2, "0")
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`
}

export function WorkoutHeader({
  title,
  startedAt,
  onFinish,
  isFinishing,
}: {
  title: string
  startedAt: string
  onFinish: () => void
  isFinishing?: boolean
}) {
  const t = useTranslations("workout")
  const [elapsed, setElapsed] = React.useState(
    () => Date.now() - new Date(startedAt).getTime()
  )

  React.useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Date.now() - new Date(startedAt).getTime())
    }, 1000)
    return () => clearInterval(id)
  }, [startedAt])

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b bg-background/95 px-4 py-3 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="flex min-w-0 items-center gap-2">
        <Link href="/entrenar" aria-label="back">
          <Button size="icon-sm" variant="ghost">
            <ArrowLeftIcon className="size-4" />
          </Button>
        </Link>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{title}</p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <TimerIcon className="size-3" />
            {formatElapsed(elapsed)}
          </p>
        </div>
      </div>
      <Button
        size="sm"
        className="shrink-0 rounded-full"
        onClick={onFinish}
        loading={isFinishing}
      >
        <CheckIcon className="size-4" />
        {t("finishWorkout")}
      </Button>
    </div>
  )
}
