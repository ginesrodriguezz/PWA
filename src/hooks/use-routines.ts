import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import * as routinesService from "@/services/routines"
import type { RoutineWithDays } from "@/types/domain"

export function useRoutines(userId: string) {
  return useQuery({
    queryKey: ["routines", userId],
    queryFn: () => routinesService.getRoutines(createClient(), userId),
  })
}

export function useRoutine(id: string, initialData?: RoutineWithDays) {
  return useQuery({
    queryKey: ["routine", id],
    queryFn: () => routinesService.getRoutine(createClient(), id),
    initialData,
  })
}

async function currentUserId() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")
  return user.id
}

export function useCreateRoutine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: { name: string; description?: string }) => {
      const userId = await currentUserId()
      return routinesService.createRoutine(createClient(), userId, input)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] })
    },
  })
}

export function useUpdateRoutine(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { name: string; description?: string }) =>
      routinesService.updateRoutine(createClient(), id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] })
      queryClient.invalidateQueries({ queryKey: ["routine", id] })
    },
  })
}

export function useDeleteRoutine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => routinesService.deleteRoutine(createClient(), id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] })
    },
  })
}

export function useCreateRoutineDay(routineId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ name, order }: { name: string; order: number }) =>
      routinesService.createRoutineDay(createClient(), routineId, name, order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routine", routineId] })
      queryClient.invalidateQueries({ queryKey: ["routines"] })
    },
  })
}

export function useUpdateRoutineDay(routineId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string
      patch: { name?: string; order?: number }
    }) => routinesService.updateRoutineDay(createClient(), id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routine", routineId] })
    },
  })
}

export function useDeleteRoutineDay(routineId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      routinesService.deleteRoutineDay(createClient(), id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routine", routineId] })
      queryClient.invalidateQueries({ queryKey: ["routines"] })
    },
  })
}

export function useReorderRoutineDays(routineId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (updates: { id: string; order: number }[]) =>
      routinesService.reorderRoutineDays(createClient(), updates),
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: ["routine", routineId] })
      const previous = queryClient.getQueryData<RoutineWithDays>([
        "routine",
        routineId,
      ])
      if (previous) {
        const orderMap = new Map(updates.map((u) => [u.id, u.order]))
        queryClient.setQueryData<RoutineWithDays>(["routine", routineId], {
          ...previous,
          routine_days: [...previous.routine_days]
            .map((d) => ({ ...d, order: orderMap.get(d.id) ?? d.order }))
            .sort((a, b) => a.order - b.order),
        })
      }
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["routine", routineId], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["routine", routineId] })
    },
  })
}

export function useAddWorkoutExercise(routineId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      routineDayId,
      exerciseId,
      order,
      targetSets,
    }: {
      routineDayId: string
      exerciseId: string
      order: number
      targetSets?: number
    }) =>
      routinesService.addWorkoutExercise(
        createClient(),
        routineDayId,
        exerciseId,
        order,
        targetSets
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routine", routineId] })
    },
  })
}

export function useUpdateWorkoutExercise(routineId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string
      patch: { order?: number; target_sets?: number }
    }) => routinesService.updateWorkoutExercise(createClient(), id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routine", routineId] })
    },
  })
}

export function useRemoveWorkoutExercise(routineId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      routinesService.removeWorkoutExercise(createClient(), id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routine", routineId] })
    },
  })
}

export function useReorderWorkoutExercises(routineId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (updates: { id: string; order: number }[]) =>
      routinesService.reorderWorkoutExercises(createClient(), updates),
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: ["routine", routineId] })
      const previous = queryClient.getQueryData<RoutineWithDays>([
        "routine",
        routineId,
      ])
      if (previous) {
        const orderMap = new Map(updates.map((u) => [u.id, u.order]))
        queryClient.setQueryData<RoutineWithDays>(["routine", routineId], {
          ...previous,
          routine_days: previous.routine_days.map((d) => ({
            ...d,
            workout_exercises: [...d.workout_exercises]
              .map((we) => ({ ...we, order: orderMap.get(we.id) ?? we.order }))
              .sort((a, b) => a.order - b.order),
          })),
        })
      }
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["routine", routineId], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["routine", routineId] })
    },
  })
}
