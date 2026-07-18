"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { updateNameSchema, type UpdateNameInput } from "@/lib/validations/profile"
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations/auth"

type ActionResult = { error: string } | { error: null }

export async function updateProfileName(
  input: UpdateNameInput
): Promise<ActionResult> {
  const parsed = updateNameSchema.safeParse(input)
  if (!parsed.success) return { error: "invalidInput" }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    data: { name: parsed.data.name },
  })
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { error: null }
}

export async function changePassword(
  input: ResetPasswordInput
): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input)
  if (!parsed.success) return { error: "invalidInput" }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  })
  if (error) return { error: error.message }

  return { error: null }
}
