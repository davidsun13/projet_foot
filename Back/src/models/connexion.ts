import { z } from "zod";

const registerSchema = z.object({
  surname: z.string().min(1, "Le nom est requis"),
  name: z.string().min(1, "Le prénom est requis"),
  mail: z.string().email("Email invalide"),
  phone: z.string().min(6).max(20).optional().nullable(),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  team: z.string().min(1, "L'équipe est requise"),
});

const loginSchema = z.object({
  mail: z.string().email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export { registerSchema, loginSchema };
