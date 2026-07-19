"use client"

import { NumberStepperInput } from "@/components/inputs/number-stepper-input"

export function RepInput({
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
      step={1}
      min={0}
      placeholder={placeholder}
      aria-label="reps"
    />
  )
}
