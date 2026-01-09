import {z} from "zod";

const createTrainingSchema = z.object({
  date: z.string().min(1),
  hour: z.string().min(1),
  location: z.string().min(1),
  type: z.string().min(1),
  team: z.string().min(1),
});

export { createTrainingSchema };
