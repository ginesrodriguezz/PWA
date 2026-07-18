import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"
import { createClient } from "@/lib/supabase/server"
import { getExerciseById } from "@/services/exercises"
import { getExerciseMediaUrl } from "@/lib/exercise-media"
import { Link } from "@/i18n/navigation"
import { Badge } from "@/components/ui/badge"
import { BODY_PART_LABEL_KEYS, getExerciseName } from "@/types/domain"

export default async function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ exerciseId: string }>
}) {
  const { exerciseId } = await params
  const supabase = await createClient()
  const exercise = await getExerciseById(supabase, exerciseId)

  if (!exercise) notFound()

  const locale = await getLocale()
  const t = await getTranslations("exercises")

  const steps =
    locale === "es"
      ? exercise.instruction_steps_es
      : exercise.instruction_steps_en
  const instructions =
    locale === "es" ? exercise.instructions_es : exercise.instructions_en
  const name = getExerciseName(exercise, locale)

  return (
    <div className="flex flex-col gap-4 p-4">
      <Link
        href="/biblioteca"
        className="flex w-fit items-center gap-1 text-sm text-muted-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        {t("title")}
      </Link>

      <div className="flex flex-col items-center gap-2">
        <img
          src={getExerciseMediaUrl(exercise.gif_path)}
          alt={name}
          width={240}
          height={240}
          className="size-60 rounded-xl border object-cover"
        />
        <p className="text-center text-[11px] text-muted-foreground">
          {exercise.attribution}
        </p>
      </div>

      <div>
        <h1 className="text-xl font-semibold">{name}</h1>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Badge variant="secondary">
            {t(`bodyParts.${BODY_PART_LABEL_KEYS[exercise.body_part]}`)}
          </Badge>
          <Badge variant="secondary">{exercise.equipment}</Badge>
          <Badge variant="secondary">{exercise.target}</Badge>
        </div>
      </div>

      {exercise.secondary_muscles.length > 0 && (
        <div>
          <p className="text-sm font-medium">{t("secondaryMuscles")}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {exercise.secondary_muscles.map((muscle) => (
              <Badge key={muscle} variant="outline">
                {muscle}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-sm font-medium">{t("instructions")}</p>
        {steps.length > 0 ? (
          <ol className="mt-2 flex list-inside list-decimal flex-col gap-2 text-sm text-muted-foreground">
            {steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">{instructions}</p>
        )}
      </div>
    </div>
  )
}
