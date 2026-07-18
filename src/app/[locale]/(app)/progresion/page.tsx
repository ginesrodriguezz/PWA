import { createClient } from "@/lib/supabase/server"
import { getExercises } from "@/services/exercises"
import { ProgressExerciseList } from "@/components/progress/progress-exercise-list"

export default async function ProgresionPage() {
  const supabase = await createClient()
  const exercises = await getExercises(supabase)

  return <ProgressExerciseList initialExercises={exercises} />
}
