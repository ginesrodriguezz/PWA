"use client"

import { useLocale, useTranslations } from "next-intl"
import { routing } from "@/i18n/routing"
import { usePathname, useRouter } from "@/i18n/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function LocaleSwitcher() {
  const locale = useLocale()
  const t = useTranslations("languages")
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Select
      value={locale}
      onValueChange={(next) => {
        if (typeof next === "string") {
          router.replace(pathname ?? "/", { locale: next })
        }
      }}
    >
      <SelectTrigger className="w-fit min-w-28" aria-label="Language">
        <SelectValue>
          {(value: (typeof routing.locales)[number]) => t(value)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {t(loc)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
