import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { getExercises } from "@/services/exercises"
import type { BodyPart } from "@/types/domain"

export function useExercises(filters: {
  search?: string
  bodyPart?: BodyPart | "all"
}) {
  return useQuery({
    queryKey: ["exercises", filters],
    queryFn: () => getExercises(createClient(), filters),
  })
}
