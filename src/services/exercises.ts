import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"
import type { Exercise, MuscleGroup } from "@/types/domain"

export async function getExercises(
  supabase: SupabaseClient<Database>,
  filters: { search?: string; muscleGroup?: MuscleGroup | "all" } = {}
): Promise<Exercise[]> {
  let query = supabase.from("exercises").select("*").order("name")

  if (filters.search) {
    query = query.ilike("name", `%${filters.search}%`)
  }
  if (filters.muscleGroup && filters.muscleGroup !== "all") {
    query = query.eq("muscle_group", filters.muscleGroup)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}
