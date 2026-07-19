"use client"

import { NumberStepperInput } from "@/components/inputs/number-stepper-input"

export function WeightInput({
  value,
  onCommit,
  placeholder,
}: {
  value: number | null
  onCommit: (value: number | null) => void
  placeholder?: string
}) {
  return (
    <NumberStepperInput
      value={value}
      onCommit={onCommit}
      step={2.5}
      min={0}
      suffix="kg"
      placeholder={placeholder}
      aria-label="weight"
    />
  )
}
