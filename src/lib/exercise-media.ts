const BUCKET = "exercise-media"

export function getExerciseMediaUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`
}
