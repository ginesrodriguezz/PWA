import { createClient } from "@/lib/supabase/server"
import { getRoutines } from "@/services/routines"
import { RoutinesView } from "@/components/routines/routines-view"

export default async function RutinasPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const routines = user ? await getRoutines(supabase, user.id) : []

  return <RoutinesView userId={user!.id} initialRoutines={routines} />
}
