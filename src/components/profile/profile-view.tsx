"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLocale, useTranslations } from "next-intl"
import { toast } from "sonner"
import { LogOutIcon } from "lucide-react"
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
import { ConfirmDialog } from "@/components/feedback/confirm-dialog"
import {
  updateNameSchema,
  type UpdateNameInput,
} from "@/lib/validations/profile"
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations/auth"
import { changePassword, updateProfileName } from "@/app/[locale]/(app)/perfil/actions"
import { logout } from "@/app/[locale]/(auth)/actions"

export function ProfileView({
  name,
  email,
}: {
  name: string
  email: string
}) {
  const t = useTranslations("profile")
  const tAuth = useTranslations("auth")
  const tCommon = useTranslations("common")
  const locale = useLocale()
  const [logoutOpen, setLogoutOpen] = React.useState(false)
  const [isLoggingOut, startLogout] = React.useTransition()

  const nameForm = useForm<UpdateNameInput>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: { name },
  })

  const passwordForm = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  function onSaveName(data: UpdateNameInput) {
    updateProfileName(data).then((result) => {
      if (result.error) toast.error(tAuth(result.error))
      else toast.success(t("nameUpdated"))
    })
  }

  function onChangePassword(data: ResetPasswordInput) {
    changePassword(data).then((result) => {
      if (result.error) {
        toast.error(tAuth(result.error))
      } else {
        toast.success(t("passwordChanged"))
        passwordForm.reset()
      }
    })
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <h1 className="text-xl font-semibold">{t("title")}</h1>

      <div className="rounded-xl border bg-card p-4">
        <p className="text-xs text-muted-foreground">{t("email")}</p>
        <p className="font-medium">{email}</p>
      </div>

      <Form {...nameForm}>
        <form
          onSubmit={nameForm.handleSubmit(onSaveName)}
          className="flex flex-col gap-3 rounded-xl border bg-card p-4"
        >
          <FormField
            control={nameForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tAuth("name")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="sm"
            className="w-fit rounded-full"
            loading={nameForm.formState.isSubmitting}
          >
            {tCommon("save")}
          </Button>
        </form>
      </Form>

      <Form {...passwordForm}>
        <form
          onSubmit={passwordForm.handleSubmit(onChangePassword)}
          className="flex flex-col gap-3 rounded-xl border bg-card p-4"
        >
          <p className="text-sm font-medium">{t("changePassword")}</p>
          <FormField
            control={passwordForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tAuth("newPassword")}</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={passwordForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tAuth("confirmPassword")}</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="sm"
            className="w-fit rounded-full"
            loading={passwordForm.formState.isSubmitting}
          >
            {tCommon("save")}
          </Button>
        </form>
      </Form>

      <Button
        variant="outline"
        className="w-fit rounded-full"
        onClick={() => setLogoutOpen(true)}
      >
        <LogOutIcon className="size-4" />
        {tAuth("logout")}
      </Button>

      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title={t("logoutConfirmTitle")}
        description={t("logoutConfirmDescription")}
        confirmLabel={tAuth("logout")}
        isPending={isLoggingOut}
        onConfirm={() => startLogout(() => logout(locale))}
      />
    </div>
  )
}
