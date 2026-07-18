import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { getExercises } from "@/services/exercises"
import type { MuscleGroup } from "@/types/domain"

export function useExercises(filters: {
  search?: string
  muscleGroup?: MuscleGroup | "all"
}) {
  return useQuery({
    queryKey: ["exercises", filters],
    queryFn: () => getExercises(createClient(), filters),
  })
}
