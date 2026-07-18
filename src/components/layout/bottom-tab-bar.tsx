"use client"

import { HistoryIcon, HomeIcon, ListChecksIcon, PlayCircleIcon, UserIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

const TABS = [
  { href: "/dashboard", icon: HomeIcon, key: "home" as const },
  { href: "/rutinas", icon: ListChecksIcon, key: "routines" as const },
  { href: "/entrenar", icon: PlayCircleIcon, key: "train" as const },
  { href: "/historial", icon: HistoryIcon, key: "history" as const },
  { href: "/perfil", icon: UserIcon, key: "profile" as const },
]

export function BottomTabBar() {
  const t = useTranslations("nav")
  const pathname = usePathname()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {TABS.map(({ href, icon: Icon, key }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="size-5" />
              {t(key)}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
