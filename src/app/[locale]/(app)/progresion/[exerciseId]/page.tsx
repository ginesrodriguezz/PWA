import { notFound } from "next/navigation"
import { ArrowLeftIcon, TrophyIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { createClient } from "@/lib/supabase/server"
import { getExerciseProgress } from "@/services/progress"
import { Link } from "@/i18n/navigation"
import { Badge } from "@/components/ui/badge"
import { StatsCard } from "@/components/cards/stats-card"
import { ExerciseProgressCharts } from "@/components/progress/exercise-progress-charts"
import { BODY_PART_LABEL_KEYS } from "@/types/domain"

export default async function ExerciseProgressPage({
  params,
}: {
  params: Promise<{ exerciseId: string }>
}) {
  const { exerciseId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: exercise } = await supabase
    .from("exercises")
    .select("*")
    .eq("id", exerciseId)
    .maybeSingle()

  if (!exercise) notFound()

  const progress = await getExerciseProgress(supabase, user!.id, exerciseId)
  const t = await getTranslations("progress")
  const tExercises = await getTranslations("exercises")

  const personalRecord = progress.reduce(
    (max, p) => Math.max(max, p.maxWeight),
    0
  )
  const bestVolume = progress.reduce((max, p) => Math.max(max, p.volume), 0)
  const bestReps = progress.reduce((max, p) => Math.max(max, p.maxReps), 0)

  return (
    <div className="flex flex-col gap-4 p-4">
      <Link
        href="/progresion"
        className="flex w-fit items-center gap-1 text-sm text-muted-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        {t("title")}
      </Link>

      <div>
        <h1 className="text-xl font-semibold">{exercise.name}</h1>
        <Badge variant="secondary" className="mt-1 w-fit">
          {tExercises(`bodyParts.${BODY_PART_LABEL_KEYS[exercise.body_part]}`)}
        </Badge>
      </div>

      {progress.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          {t("noData")}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            <StatsCard
              label={t("personalRecord")}
              value={`${personalRecord} kg`}
              icon={TrophyIcon}
            />
            <StatsCard
              label={t("bestVolume")}
              value={`${Math.round(bestVolume).toLocaleString()} kg`}
            />
            <StatsCard label={t("bestReps")} value={bestReps.toString()} />
          </div>

          <ExerciseProgressCharts data={progress} />
        </>
      )}
    </div>
  )
}
