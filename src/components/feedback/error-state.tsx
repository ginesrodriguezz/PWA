"use client"

import { AlertTriangleIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

export function ErrorState({ reset }: { reset: () => void }) {
  const t = useTranslations("common")

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8 pt-24 text-center">
      <AlertTriangleIcon className="size-8 text-destructive" />
      <p className="font-medium">{t("errorTitle")}</p>
      <p className="max-w-xs text-sm text-muted-foreground">
        {t("errorDescription")}
      </p>
      <Button variant="outline" className="mt-2 rounded-full" onClick={reset}>
        {t("retry")}
      </Button>
    </div>
  )
}
