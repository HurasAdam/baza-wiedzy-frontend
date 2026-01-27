import { z } from "zod";

export const faqSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Tytuł FAQ musi zawierać co najmniej 3 znaki." })
    .max(200, { message: "Tytuł FAQ może zawierać maksymalnie 200 znaków." }),
  description: z
    .string()
    .min(3, { message: "Opis FAQ musi zawierać co najmniej 3 znaki." })
    .max(2000, { message: "Opis FAQ może zawierać maksymalnie 2000 znaków." })
    .optional(),
  iconKey: z.string().min(1, { message: "Wybierz ikonę dla FAQ." }),
  labelColor: z.string().min(1, { message: "Wybierz kolor etykiety." }),
  questions: z
    .array(
      z.object({
        question: z
          .string()
          .min(3, { message: "Pytanie musi zawierać co najmniej 3 znaki." })
          .max(200, { message: "Pytanie może zawierać maksymalnie 200 znaków." }),
        answer: z
          .string()
          .min(3, { message: "Odpowiedź musi zawierać co najmniej 3 znaki." })
          .max(2000, { message: "Odpowiedź może zawierać maksymalnie 2000 znaków." }),
      }),
    )
    .min(1, { message: "Dodaj przynajmniej jedno pytanie i odpowiedź." }),
});

export type FaqFormValues = z.infer<typeof faqSchema>;
