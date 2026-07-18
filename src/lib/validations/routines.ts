import { z } from "zod"

export const routineSchema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().max(300).optional().or(z.literal("")),
})

export type RoutineInput = z.infer<typeof routineSchema>

export const routineDaySchema = z.object({
  name: z.string().min(1).max(60),
})

export type RoutineDayInput = z.infer<typeof routineDaySchema>
