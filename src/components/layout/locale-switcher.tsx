"use client"

import { useLocale } from "next-intl"
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
      <SelectTrigger className="w-20" aria-label="Language">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {loc.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
