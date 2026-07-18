import { createClient } from "@/lib/supabase/server"
import { getExercises } from "@/services/exercises"
import { ExerciseLibraryView } from "@/components/exercises/exercise-library-view"

export default async function BibliotecaPage() {
  const supabase = await createClient()
  const exercises = await getExercises(supabase)

  return <ExerciseLibraryView initialExercises={exercises} />
}
