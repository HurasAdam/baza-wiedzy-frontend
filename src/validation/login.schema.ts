import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Nieprawidłowy login lub hasło"),
  password: z.string().min(6, "Hasło jest wymagane"),
});
