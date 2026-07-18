"use client"

import { NumberStepperInput } from "@/components/inputs/number-stepper-input"

export function RepInput({
  value,
  onCommit,
}: {
  value: number | null
  onCommit: (value: number | null) => void
}) {
  return (
    <NumberStepperInput
      value={value}
      onCommit={onCommit}
      step={1}
      min={0}
      aria-label="reps"
    />
  )
}
