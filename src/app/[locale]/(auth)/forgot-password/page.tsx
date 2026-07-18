"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLocale, useTranslations } from "next-intl"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Link } from "@/i18n/navigation"
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validations/auth"
import { forgotPassword } from "../actions"

export default function ForgotPasswordPage() {
  const t = useTranslations("auth")
  const locale = useLocale()
  const [isPending, startTransition] = React.useTransition()
  const [sent, setSent] = React.useState(false)

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  function onSubmit(data: ForgotPasswordInput) {
    startTransition(async () => {
      const result = await forgotPassword(locale, data)
      if (result.error) {
        toast.error(result.error)
      } else {
        setSent(true)
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("resetPassword")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("forgotPasswordSubtitle")}
        </p>
      </div>

      {sent ? (
        <p className="text-center text-sm text-muted-foreground">
          {t("resetLinkSent")}
        </p>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="mt-2 h-10 rounded-full"
              disabled={isPending}
            >
              {t("sendResetLink")}
            </Button>
          </form>
        </Form>
      )}

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="font-medium text-foreground">
          {t("backToLogin")}
        </Link>
      </p>
    </div>
  )
}
