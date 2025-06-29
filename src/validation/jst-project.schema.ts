import z from "zod";

export const jstProjectSchema = z.object({
  name: z.string().min(3, "Nazwa musi zawierać conajmniej trzy znaki"),
  description: z.string().optional(),
});
