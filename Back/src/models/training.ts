import {z} from "zod";

const createTrainingSchema = z.object({
  date: z.string().min(1),
  hour: z.string().min(1),
  location: z.string().min(1),
  type: z.string().min(1),
  id_team: z.number().int().positive(),
  id_coach: z.number().int().optional(),
});

export { createTrainingSchema };
