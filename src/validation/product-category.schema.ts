import z from "zod";

export const productCategorySchema = z.object({
  name: z.string().min(2, "Nazwa kategorii musi zawierać conajmniej dwa znaki"),
});
export type ProductCategoryFormData = z.infer<typeof productCategorySchema>;
