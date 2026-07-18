import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getWorkoutSession } from "@/services/workouts"
import { WorkoutDetailView } from "@/components/history/workout-detail-view"

export default async function HistorialDetailPage({
  params,
}: {
  params: Promise<{ workoutId: string }>
}) {
  const { workoutId } = await params
  const supabase = await createClient()
  const session = await getWorkoutSession(supabase, workoutId)

  if (!session || !session.finished_at) notFound()

  return <WorkoutDetailView session={session} />
}
