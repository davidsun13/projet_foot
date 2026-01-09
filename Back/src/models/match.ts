import {z} from "zod";

const createMatchSchema = z.object({
  date: z.string(),
  hour: z.string(),
  opponent: z.string().min(1),
  location: z.string(),
  type: z.string(),
  team: z.string(),
  score_home: z.number().optional().default(0),
  score_outside: z.number().optional().default(0),
});

const updateScoreSchema = z.object({
  score_home: z.number().min(0),
  score_outside: z.number().min(0),
});
export { createMatchSchema, updateScoreSchema };
