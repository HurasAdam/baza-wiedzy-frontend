import z from "zod";

export const jstProjectSchema = z.object({
  name: z.string().min(3, "Nazwa musi zawierać conajmniej 3 znaki"),
  description: z
    .string()
    .min(3, "Opis musi zawierać conajmniej 3 znaki")
    .max(9000, "Opis projektu nie może przekroczyć 9000 znaków"),
});

export type JstProjectFormData = z.infer<typeof jstProjectSchema>;
