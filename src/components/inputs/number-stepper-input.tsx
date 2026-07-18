"use client"

import * as React from "react"
import { MinusIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function NumberStepperInput({
  value,
  onCommit,
  step = 1,
  min = 0,
  suffix,
  placeholder,
  className,
  "aria-label": ariaLabel,
}: {
  value: number | null
  onCommit: (value: number | null) => void
  step?: number
  min?: number
  suffix?: string
  placeholder?: string
  className?: string
  "aria-label"?: string
}) {
  const [local, setLocal] = React.useState(value?.toString() ?? "")

  React.useEffect(() => {
    setLocal(value?.toString() ?? "")
  }, [value])

  function commitStep(delta: number) {
    const current = Number(local) || 0
    const next = Math.max(min, current + delta)
    const rounded = Math.round(next * 100) / 100
    setLocal(rounded.toString())
    onCommit(rounded)
  }

  function commitBlur() {
    const parsed = local === "" ? null : Number(local)
    onCommit(Number.isFinite(parsed) ? parsed : null)
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button
        type="button"
        size="icon-sm"
        variant="outline"
        className="shrink-0"
        onClick={() => commitStep(-step)}
        aria-label="decrease"
      >
        <MinusIcon className="size-3.5" />
      </Button>
      <div className="relative">
        <Input
          type="number"
          inputMode="decimal"
          value={local}
          placeholder={placeholder}
          aria-label={ariaLabel}
          onChange={(e) => setLocal(e.target.value)}
          onBlur={commitBlur}
          className={cn(
            "h-8 w-16 text-center",
            suffix && "pr-6"
          )}
        />
        {suffix && (
          <span className="pointer-events-none absolute top-1/2 right-1.5 -translate-y-1/2 text-[10px] text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
      <Button
        type="button"
        size="icon-sm"
        variant="outline"
        className="shrink-0"
        onClick={() => commitStep(step)}
        aria-label="increase"
      >
        <PlusIcon className="size-3.5" />
      </Button>
    </div>
  )
}
