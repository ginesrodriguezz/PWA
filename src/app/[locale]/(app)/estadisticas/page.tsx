import { createClient } from "@/lib/supabase/server"
import { getStatisticsOverview } from "@/services/statistics"
import { StatisticsOverviewView } from "@/components/statistics/statistics-overview"

export default async function EstadisticasPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const overview = await getStatisticsOverview(supabase, user!.id)

  return <StatisticsOverviewView overview={overview} />
}
