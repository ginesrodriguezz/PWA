"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Link, useRouter } from "@/i18n/navigation"
import { routineSchema, type RoutineInput } from "@/lib/validations/routines"
import { useCreateRoutine } from "@/hooks/use-routines"

export default function NuevaRutinaPage() {
  const t = useTranslations("routines")
  const router = useRouter()
  const createRoutine = useCreateRoutine()

  const form = useForm<RoutineInput>({
    resolver: zodResolver(routineSchema),
    defaultValues: { name: "", description: "" },
  })

  function onSubmit(data: RoutineInput) {
    createRoutine.mutate(data, {
      onSuccess: (routine) => router.push(`/rutinas/${routine.id}`),
      onError: () => toast.error(t("saved")),
    })
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <Link
        href="/rutinas"
        className="flex w-fit items-center gap-1 text-sm text-muted-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        {t("backToRoutines")}
      </Link>

      <h1 className="text-xl font-semibold">{t("newRoutine")}</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("routineName")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("routineNamePlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("description")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("descriptionPlaceholder")}
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
            loading={createRoutine.isPending}
          >
            {t("create")}
          </Button>
        </form>
      </Form>
    </div>
  )
}
