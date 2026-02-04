import z from "zod";

export const createUserAccountSchema = z.object({
  name: z.string().min(2, "Imię musi zawierać conajmniej 2 znaki"),
  surname: z.string().min(2, "Nazwisko musi zawierać conajmniej 2 znaki"),
  email: z.string().email("Błędny adres email"),
  password: z.string().min(6, "hasło musi zawierac conajmniej 6 znaków"),
  phone: z.string().optional(),
  role: z.string(),
});
