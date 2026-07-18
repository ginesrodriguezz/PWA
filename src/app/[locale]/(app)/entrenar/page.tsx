import { createClient } from "@/lib/supabase/server"
import { getAllRoutineDays } from "@/services/routines"
import { EntrenarView } from "@/components/workout/entrenar-view"

export default async function EntrenarPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const days = user ? await getAllRoutineDays(supabase, user.id) : []

  return <EntrenarView days={days} />
}
