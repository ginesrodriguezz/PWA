"use client"

import { NumberStepperInput } from "@/components/inputs/number-stepper-input"

export function WeightInput({
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
      step={2.5}
      min={0}
      suffix="kg"
      aria-label="weight"
    />
  )
}
