import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getRoutine } from "@/services/routines"
import { RoutineEditor } from "@/components/routines/routine-editor"

export default async function RutinaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const routine = await getRoutine(supabase, id)

  if (!routine) notFound()

  return <RoutineEditor routine={routine} />
}
