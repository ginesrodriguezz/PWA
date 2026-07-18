"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
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
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations/auth"
import { resetPassword } from "../actions"

export default function ResetPasswordPage() {
  const t = useTranslations("auth")
  const tCommon = useTranslations("common")
  const [isPending, startTransition] = React.useTransition()
  const [done, setDone] = React.useState(false)

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  function onSubmit(data: ResetPasswordInput) {
    startTransition(async () => {
      const result = await resetPassword(data)
      if (result.error) {
        toast.error(
          result.error === "passwordMismatch"
            ? t("passwordMismatch")
            : result.error
        )
      } else {
        setDone(true)
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("resetPassword")}
        </h1>
      </div>

      {done ? (
        <div className="flex flex-col gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            {t("passwordUpdated")}
          </p>
          <Link href="/login">
            <Button className="w-full h-10 rounded-full">
              {t("backToLogin")}
            </Button>
          </Link>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("newPassword")}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("confirmPassword")}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
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
              {tCommon("save")}
            </Button>
          </form>
        </Form>
      )}
    </div>
  )
}
