import { Dumbbell } from "lucide-react"
import { getTranslations } from "next-intl/server"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const t = await getTranslations("common")

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 px-6 py-12">
      <div className="flex items-center gap-2 font-semibold">
        <Dumbbell className="size-5" />
        <span>{t("appName")}</span>
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}
