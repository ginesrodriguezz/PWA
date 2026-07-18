import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BottomTabBar } from "@/components/layout/bottom-tab-bar"

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/login`)
  }

  return (
    <div className="min-h-dvh pb-20">
      {children}
      <BottomTabBar />
    </div>
  )
}
