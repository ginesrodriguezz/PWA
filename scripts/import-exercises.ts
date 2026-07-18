import "dotenv/config"
import fs from "node:fs"
import path from "node:path"
import { createClient } from "@supabase/supabase-js"
import type { BodyPart, Database } from "../src/types/database.types"

type DatasetExercise = {
  id: string
  name: string
  body_part: string
  equipment: string
  instructions: Record<string, string>
  instruction_steps: Record<string, string[]>
  muscle_group: string
  secondary_muscles: string[]
  target: string
  media_id: string
  image: string
  gif_url: string
  attribution: string
}

const datasetPath = path.resolve(
  process.env.EXERCISES_DATASET_PATH ??
    path.join(__dirname, "..", "..", "exercises-dataset")
)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env"
  )
}

const supabase = createClient<Database>(supabaseUrl, serviceRoleKey)

const BUCKET = "exercise-media"
const UPLOAD_CONCURRENCY = 20
const UPSERT_BATCH_SIZE = 300

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

async function uploadMedia(exercise: DatasetExercise) {
  const imageBytes = fs.readFileSync(path.join(datasetPath, exercise.image))
  const gifBytes = fs.readFileSync(path.join(datasetPath, exercise.gif_url))

  const { error: imageError } = await supabase.storage
    .from(BUCKET)
    .upload(exercise.image, imageBytes, {
      upsert: true,
      contentType: "image/jpeg",
      cacheControl: "31536000",
    })
  if (imageError) throw new Error(`${exercise.id} image: ${imageError.message}`)

  const { error: gifError } = await supabase.storage
    .from(BUCKET)
    .upload(exercise.gif_url, gifBytes, {
      upsert: true,
      contentType: "image/gif",
      cacheControl: "31536000",
    })
  if (gifError) throw new Error(`${exercise.id} gif: ${gifError.message}`)
}

function toRow(
  exercise: DatasetExercise,
  namesEs: Record<string, string>
): Database["public"]["Tables"]["exercises"]["Insert"] {
  return {
    external_id: exercise.id,
    name: exercise.name,
    name_es: namesEs[exercise.id] ?? null,
    body_part: exercise.body_part as BodyPart,
    equipment: exercise.equipment,
    target: exercise.target,
    primary_muscle: exercise.muscle_group,
    secondary_muscles: exercise.secondary_muscles,
    instructions_en: exercise.instructions.en,
    instructions_es: exercise.instructions.es,
    instruction_steps_en: exercise.instruction_steps.en,
    instruction_steps_es: exercise.instruction_steps.es,
    image_path: exercise.image,
    gif_path: exercise.gif_url,
    attribution: exercise.attribution,
  }
}

async function main() {
  const jsonPath = path.join(datasetPath, "data", "exercises.json")
  const exercises: DatasetExercise[] = JSON.parse(
    fs.readFileSync(jsonPath, "utf-8")
  )
  const namesEs: Record<string, string> = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "data", "exercise-names-es.json"),
      "utf-8"
    )
  )

  console.log(`Loaded ${exercises.length} exercises from ${jsonPath}`)

  const batches = chunk(exercises, UPLOAD_CONCURRENCY)
  let uploaded = 0

  for (const batch of batches) {
    await Promise.all(batch.map(uploadMedia))
    uploaded += batch.length
    console.log(`Uploaded media: ${uploaded}/${exercises.length}`)
  }

  const rowBatches = chunk(
    exercises.map((exercise) => toRow(exercise, namesEs)),
    UPSERT_BATCH_SIZE
  )
  let inserted = 0

  for (const rows of rowBatches) {
    const { error } = await supabase
      .from("exercises")
      .upsert(rows, { onConflict: "external_id" })
    if (error) throw new Error(`upsert batch failed: ${error.message}`)
    inserted += rows.length
    console.log(`Upserted rows: ${inserted}/${exercises.length}`)
  }

  console.log(`Done. ${exercises.length} exercises imported.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
