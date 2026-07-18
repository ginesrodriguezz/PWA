export type BodyPart =
  | "back"
  | "cardio"
  | "chest"
  | "lower arms"
  | "lower legs"
  | "neck"
  | "shoulders"
  | "upper arms"
  | "upper legs"
  | "waist"

export type Database = {
  public: {
    Tables: {
      routines: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
        Relationships: []
      }
      routine_days: {
        Row: {
          id: string
          routine_id: string
          name: string
          order: number
        }
        Insert: {
          id?: string
          routine_id: string
          name: string
          order?: number
        }
        Update: {
          id?: string
          routine_id?: string
          name?: string
          order?: number
        }
        Relationships: [
          {
            foreignKeyName: "routine_days_routine_id_fkey"
            columns: ["routine_id"]
            referencedRelation: "routines"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          id: string
          external_id: string
          name: string
          name_es: string | null
          body_part: BodyPart
          equipment: string
          target: string
          primary_muscle: string
          secondary_muscles: string[]
          instructions_en: string
          instructions_es: string
          instruction_steps_en: string[]
          instruction_steps_es: string[]
          image_path: string
          gif_path: string
          attribution: string
          created_at: string
        }
        Insert: {
          id?: string
          external_id: string
          name: string
          name_es?: string | null
          body_part: BodyPart
          equipment: string
          target: string
          primary_muscle: string
          secondary_muscles?: string[]
          instructions_en: string
          instructions_es: string
          instruction_steps_en?: string[]
          instruction_steps_es?: string[]
          image_path: string
          gif_path: string
          attribution?: string
          created_at?: string
        }
        Update: {
          id?: string
          external_id?: string
          name?: string
          name_es?: string | null
          body_part?: BodyPart
          equipment?: string
          target?: string
          primary_muscle?: string
          secondary_muscles?: string[]
          instructions_en?: string
          instructions_es?: string
          instruction_steps_en?: string[]
          instruction_steps_es?: string[]
          image_path?: string
          gif_path?: string
          attribution?: string
          created_at?: string
        }
        Relationships: []
      }
      workout_exercises: {
        Row: {
          id: string
          routine_day_id: string
          exercise_id: string
          order: number
          target_sets: number
        }
        Insert: {
          id?: string
          routine_day_id: string
          exercise_id: string
          order?: number
          target_sets?: number
        }
        Update: {
          id?: string
          routine_day_id?: string
          exercise_id?: string
          order?: number
          target_sets?: number
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercises_routine_day_id_fkey"
            columns: ["routine_day_id"]
            referencedRelation: "routine_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      workouts: {
        Row: {
          id: string
          user_id: string
          routine_day_id: string | null
          started_at: string
          finished_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          routine_day_id?: string | null
          started_at?: string
          finished_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          routine_day_id?: string | null
          started_at?: string
          finished_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workouts_routine_day_id_fkey"
            columns: ["routine_day_id"]
            referencedRelation: "routine_days"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_sets: {
        Row: {
          id: string
          workout_id: string
          workout_exercise_id: string
          set_number: number
          weight: number | null
          reps: number | null
          completed: boolean
        }
        Insert: {
          id?: string
          workout_id: string
          workout_exercise_id: string
          set_number: number
          weight?: number | null
          reps?: number | null
          completed?: boolean
        }
        Update: {
          id?: string
          workout_id?: string
          workout_exercise_id?: string
          set_number?: number
          weight?: number | null
          reps?: number | null
          completed?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "workout_sets_workout_id_fkey"
            columns: ["workout_id"]
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_sets_workout_exercise_id_fkey"
            columns: ["workout_exercise_id"]
            referencedRelation: "workout_exercises"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: {
      get_last_exercise_sets: {
        Args: { p_exercise_id: string }
        Returns: {
          set_number: number
          weight: number | null
          reps: number | null
          workout_started_at: string
        }[]
      }
      get_total_volume: {
        Args: Record<string, never>
        Returns: number
      }
    }
  }
}
