import { z } from "zod";

export const faqItemSchema = z.object({
  question: z
    .string()
    .min(3, "Pytanie musi zawierać conajmniej 3 znaki")
    .max(200, "Pytanie może zawierać maksymalnie 200 znaków"),
  answer: z
    .string()
    .min(3, "Pytanie musi zawierać conajmniej 3 znaki")
    .max(2000, "Odpowiedź nie może zawierać maksymalnie 2000 znaków"),
  faqId: z.string().min(1, "wybór FAQ jest wymagany"),
});
