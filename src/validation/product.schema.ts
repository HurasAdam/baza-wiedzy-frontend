import z from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Nazwa produktu musi zawierać conajmniej trzy znaki"),
  labelColor: z.string().min(1, "Kolor etykiety jest wymagany"),
  banner: z.string().min(3, "Color must be at least 3 characters"),
});
