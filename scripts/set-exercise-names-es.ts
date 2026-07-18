import "dotenv/config"
import fs from "node:fs"
import path from "node:path"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "../src/types/database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env"
  )
}

const supabase = createClient<Database>(supabaseUrl, serviceRoleKey)
const UPDATE_CONCURRENCY = 50

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

async function main() {
  const namesEs: Record<string, string> = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "data", "exercise-names-es.json"),
      "utf-8"
    )
  )
  const entries = Object.entries(namesEs)
  console.log(`Loaded ${entries.length} Spanish names`)

  const batches = chunk(entries, UPDATE_CONCURRENCY)
  let updated = 0

  for (const batch of batches) {
    await Promise.all(
      batch.map(async ([externalId, nameEs]) => {
        const { error } = await supabase
          .from("exercises")
          .update({ name_es: nameEs })
          .eq("external_id", externalId)
        if (error) throw new Error(`${externalId}: ${error.message}`)
      })
    )
    updated += batch.length
    console.log(`Updated: ${updated}/${entries.length}`)
  }

  console.log(`Done. ${entries.length} exercise names updated.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
