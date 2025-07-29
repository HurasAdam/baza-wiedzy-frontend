import z from "zod";

export const tagSchema = z.object({
  name: z.string().min(3, "Nazwa tagu musi zawierać conajmniej trzy znaki"),
});
