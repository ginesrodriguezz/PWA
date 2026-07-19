import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import * as workoutsService from "@/services/workouts"
import type { WorkoutSession } from "@/types/domain"

export function useWorkoutSession(
  workoutId: string,
  initialData?: WorkoutSession
) {
  return useQuery({
    queryKey: ["workout", workoutId],
    queryFn: () => workoutsService.getWorkoutSession(createClient(), workoutId),
    initialData,
  })
}

export function useUpdateWorkoutSet(workoutId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string
      patch: { weight?: number | null; reps?: number | null; completed?: boolean }
    }) => workoutsService.updateWorkoutSet(createClient(), id, patch),
    onMutate: async ({ id, patch }) => {
      await queryClient.cancelQueries({ queryKey: ["workout", workoutId] })
      const previous = queryClient.getQueryData<WorkoutSession>([
        "workout",
        workoutId,
      ])
      if (previous) {
        queryClient.setQueryData<WorkoutSession>(["workout", workoutId], {
          ...previous,
          workout_sets: previous.workout_sets.map((s) =>
            s.id === id ? { ...s, ...patch } : s
          ),
        })
      }
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["workout", workoutId], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["workout", workoutId] })
    },
  })
}

export function useAddWorkoutSet(workoutId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      workoutExerciseId,
      setNumber,
    }: {
      workoutExerciseId: string
      setNumber: number
    }) =>
      workoutsService.addWorkoutSet(
        createClient(),
        workoutId,
        workoutExerciseId,
        setNumber
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout", workoutId] })
    },
  })
}

export function useReplaceWorkoutExercise(workoutId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      workoutExerciseId,
      exerciseId,
    }: {
      workoutExerciseId: string
      exerciseId: string
    }) =>
      workoutsService.replaceWorkoutExercise(
        createClient(),
        workoutId,
        workoutExerciseId,
        exerciseId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout", workoutId] })
    },
  })
}

export function useFinishWorkout() {
  return useMutation({
    mutationFn: (workoutId: string) =>
      workoutsService.finishWorkout(createClient(), workoutId),
  })
}

export function useStartWorkout() {
  return useMutation({
    mutationFn: async (routineDayId: string) => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")
      return workoutsService.getOrCreateActiveWorkout(
        supabase,
        user.id,
        routineDayId
      )
    },
  })
}
