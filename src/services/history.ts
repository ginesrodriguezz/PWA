import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"
import type { WorkoutHistoryItem } from "@/types/domain"

const PAGE_SIZE = 15

export async function getWorkoutHistory(
  supabase: SupabaseClient<Database>,
  page: number,
  filters: { search?: string; dateFrom?: string; dateTo?: string } = {}
): Promise<{ items: WorkoutHistoryItem[]; totalCount: number; pageSize: number }> {
  const { data, error } = await supabase.rpc("search_workout_history", {
    p_search: filters.search || null,
    p_date_from: filters.dateFrom || null,
    p_date_to: filters.dateTo || null,
    p_limit: PAGE_SIZE,
    p_offset: page * PAGE_SIZE,
  })

  if (error) throw error

  const rows = data ?? []

  const items: WorkoutHistoryItem[] = rows.map((w) => ({
    id: w.id,
    started_at: w.started_at,
    finished_at: w.finished_at,
    dayName: w.day_name,
    routineName: w.routine_name,
    totalSets: w.total_sets,
    completedSets: w.completed_sets,
    volume: w.volume,
  }))

  return {
    items,
    totalCount: rows[0]?.total_count ?? 0,
    pageSize: PAGE_SIZE,
  }
}
