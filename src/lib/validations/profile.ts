import { z } from "zod"

export const updateNameSchema = z.object({
  name: z.string().min(2).max(80),
})

export type UpdateNameInput = z.infer<typeof updateNameSchema>
