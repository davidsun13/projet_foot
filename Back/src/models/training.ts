import {z} from "zod";

const createTrainingSchema = z.object({
  date: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "Date invalide (YYYY-MM-DD)" }),
  heure: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Heure invalide (HH:MM ou HH:MM:SS)"),
  type: z.string().min(1),
  lieu: z.string().min(1),
  equipe: z.string().min(1),
  id_coach: z.number().int().positive().optional(),
});
export { createTrainingSchema };
