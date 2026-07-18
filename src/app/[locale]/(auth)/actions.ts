"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { mapAuthError } from "@/lib/auth-errors"
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  type ForgotPasswordInput,
  type LoginInput,
  type RegisterInput,
  type ResetPasswordInput,
} from "@/lib/validations/auth"

type ActionResult = { error: string } | { error: null }

export async function login(
  locale: string,
  input: LoginInput
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input)
  if (!parsed.success) return { error: "invalidInput" }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) return { error: mapAuthError(error.message) }

  redirect(`/${locale}/dashboard`)
}

export async function register(
  locale: string,
  input: RegisterInput
): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input)
  if (!parsed.success) return { error: "invalidInput" }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { name: parsed.data.name } },
  })
  if (error) return { error: mapAuthError(error.message) }

  redirect(`/${locale}/dashboard`)
}

export async function forgotPassword(
  locale: string,
  input: ForgotPasswordInput
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input)
  if (!parsed.success) return { error: "invalidInput" }

  const supabase = await createClient()
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    { redirectTo: `${origin}/${locale}/reset-password` }
  )
  // Note: `redirectTo` becomes the `next` param inside the Supabase "Reset
  // Password" email template — see README for the required template.
  if (error) return { error: mapAuthError(error.message) }

  return { error: null }
}

export async function resetPassword(
  input: ResetPasswordInput
): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input)
  if (!parsed.success) return { error: "invalidInput" }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  })
  if (error) return { error: mapAuthError(error.message) }

  return { error: null }
}

export async function logout(locale: string) {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect(`/${locale}/login`)
}
