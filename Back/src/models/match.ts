import { z } from "zod";

// 🔹 Schema pour créer un match
const createMatchSchema = z.object({
  date: z.string(),                           // YYYY-MM-DD
  hour: z.string(),                           // HH:MM
  opponent: z.string().min(1),                // nom du club adverse
  location: z.enum(["Home", "Outside"]),      // type de lieu
  type: z.enum(["Championship", "Friendly", "Cup"]), // type de match
  id_team: z.number().int().positive(),       // équipe (id)
  id_coach: z.number().int().nullable().optional(),      // facultatif
  score_home: z.number().int().min(0).default(0),   // score domicile par défaut 0
  score_outside: z.number().int().min(0).default(0),// score extérieur par défaut 0          // note facultative
});

// 🔹 Schema pour mettre à jour les scores uniquement
const updateScoreSchema = z.object({
  score_home: z.number().int().min(0),
  score_outside: z.number().int().min(0),
});

export { createMatchSchema, updateScoreSchema };
