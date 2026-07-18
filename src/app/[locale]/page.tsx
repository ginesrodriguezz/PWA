import { Dumbbell } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { LocaleSwitcher } from "@/components/layout/locale-switcher"

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("landing")
  const common = await getTranslations("common")

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <div className="flex items-center gap-2 font-semibold">
          <Dumbbell className="size-5" />
          <span>{common("appName")}</span>
        </div>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="max-w-md text-balance text-4xl font-bold tracking-tight whitespace-pre-line sm:text-5xl">
          {t("title")}
        </h1>
        <p className="max-w-sm text-balance text-muted-foreground">
          {t("subtitle")}
        </p>
        <Button size="lg" className="h-11 rounded-full px-8 text-base">
          {t("cta")}
        </Button>
      </main>
    </div>
  )
}
