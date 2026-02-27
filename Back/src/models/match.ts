import { z } from "zod";

// 🔹 Schema pour créer un match
const createMatchSchema = z.object({
  date: z.string(),                           
  hour: z.string(),                         
  opponent: z.string().min(1),                
  location: z.enum(["Home", "Outside"]),      
  type: z.enum(["Championship", "Friendly", "Cup"]), 
  id_team: z.number().int().positive(),       
  id_coach: z.number().int().nullable().optional(),      
  score_home: z.number().int().min(0).default(0),   
  score_outside: z.number().int().min(0).default(0),

// 🔹 Schema pour mettre à jour les scores uniquement
const updateScoreSchema = z.object({
  score_home: z.number().int().min(0),
  score_outside: z.number().int().min(0),
});

export { createMatchSchema, updateScoreSchema };
