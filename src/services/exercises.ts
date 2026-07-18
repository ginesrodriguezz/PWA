import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"
import type { BodyPart, Exercise, ExerciseListItem } from "@/types/domain"

export async function getExercises(
  supabase: SupabaseClient<Database>,
  filters: { search?: string; bodyPart?: BodyPart | "all" } = {}
): Promise<ExerciseListItem[]> {
  let query = supabase
    .from("exercises")
    .select("id, name, name_es, body_part, equipment, target, image_path")
    .order("name")

  if (filters.search) {
    const term = filters.search.replace(/[,()]/g, "\\$&")
    query = query.or(`name.ilike.%${term}%,name_es.ilike.%${term}%`)
  }
  if (filters.bodyPart && filters.bodyPart !== "all") {
    query = query.eq("body_part", filters.bodyPart)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getExerciseById(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<Exercise | null> {
  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) throw error
  return data
}
