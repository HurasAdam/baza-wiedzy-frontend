import z from "zod";

export const jstSchoolSchema = z.object({
  jstProjectId: z.string().min(1, "Wybierz projekt"),
  name: z.string().min(3, "Nazwa musi zawierać conajmniej trzy znaki"),
  email: z.string().email("Błędny adres email"),
  adres: z.string().min(3, "adres musi zawierać conajmniej 3 znaki"),
  szId: z.string().min(2, "szId musi zawierac conajmniej 2 znaki"),
  libId: z.string().min(2, "LibnetId musi zawierac conajmniej 2 znaki"),
  phone: z.string().min(2, "telefon kontaktowy musi zawierac conajmniej 9 znaków"),
});
