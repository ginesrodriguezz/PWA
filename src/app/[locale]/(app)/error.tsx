"use client"

import { ErrorState } from "@/components/feedback/error-state"

export default function AppError({ reset }: { reset: () => void }) {
  return <ErrorState reset={reset} />
}
