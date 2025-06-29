import z from "zod";

export const topicSchema = z.object({
  title: z.string().min(3, "Nazwa tematu musi zawierać conajmniej trzy znaki"),
  product: z.string().min(1, "Produkt jest wymagany"),
});
