import { createClient } from "@/lib/supabase/server"
import { getDashboardStats } from "@/services/dashboard"
import { DashboardView } from "@/components/dashboard/dashboard-view"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const stats = await getDashboardStats(supabase, user!.id)

  return (
    <DashboardView
      stats={stats}
      userName={user?.user_metadata?.name ?? user?.email ?? ""}
    />
  )
}
