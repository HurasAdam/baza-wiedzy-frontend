import { z } from "zod";

export const funnyMessageSchema = z.object({
  title: z.string().min(1, "Podaj tytuł"),
  type: z.enum(["single", "dialog"]),
  entries: z
    .array(
      z.object({
        author: z.enum(["KLIENT", "PRACOWNIK"]),
        content: z.string().min(1, "Treść jest wymagana"),
      })
    )
    .min(1, "Musisz dodać przynajmniej jedną wypowiedź"),
});
