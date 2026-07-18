import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

export function StatsCard({
  label,
  value,
  hint,
  icon: Icon,
  className,
}: {
  label: string
  value: string
  hint?: string
  icon?: LucideIcon
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-xl border bg-card p-4",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        {Icon && <Icon className="size-4 text-muted-foreground" />}
      </div>
      <span className="text-xl font-semibold tabular-nums">{value}</span>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  )
}
