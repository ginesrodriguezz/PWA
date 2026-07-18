import { getTranslations } from "next-intl/server"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { Link } from "@/i18n/navigation"
import { getDashboardStats } from "@/services/dashboard"
import { DashboardView } from "@/components/dashboard/dashboard-view"
import { logout } from "../../(auth)/actions"

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const t = await getTranslations("auth")
  const tNav = await getTranslations("nav")
  const logoutWithLocale = logout.bind(null, locale)

  const stats = await getDashboardStats(supabase, user!.id)

  return (
    <div className="flex flex-col">
      <DashboardView
        stats={stats}
        userName={user?.user_metadata?.name ?? user?.email ?? ""}
      />

      <div className="flex flex-wrap gap-2 border-t p-4">
        <Link href="/rutinas">
          <Button variant="outline" size="sm">
            {tNav("routines")}
          </Button>
        </Link>
        <Link href="/historial">
          <Button variant="outline" size="sm">
            {tNav("history")}
          </Button>
        </Link>
        <Link href="/progresion">
          <Button variant="outline" size="sm">
            {tNav("progress")}
          </Button>
        </Link>
        <Link href="/biblioteca">
          <Button variant="outline" size="sm">
            {tNav("library")}
          </Button>
        </Link>
        <form action={logoutWithLocale}>
          <Button type="submit" variant="ghost" size="sm">
            {t("logout")}
          </Button>
        </form>
      </div>
    </div>
  )
}
