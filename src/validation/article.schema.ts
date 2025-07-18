import { z } from "zod";

export const articleSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Tytuł artykułu musi zawierać co najmniej 3 znaki." })
    .max(90, {
      message: "Tytuł artykułu może zawierać maksymalnie 90 znaków.",
    }),
  product: z.string().min(1, {
    message: "Produkt jest wymagany. Wybierz jedną z dostępnych opcji.",
  }),
  category: z.string().min(1, {
    message: "Kategoria jest wymagana. Wybierz jedną z dostępnych opcji.",
  }),
  tags: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .nonempty({ message: "Wybierz co najmniej jeden tag." }),
  responseVariants: z
    .array(
      z.object({
        version: z
          .number()
          .int({
            message: "Numer wersji odpowiedzi musi być liczbą całkowitą.",
          })
          .positive({
            message: "Numer wersji odpowiedzi musi być większy od zera.",
          }),
        variantName: z.string().max(100).optional(),
        variantContent: z
          .string()
          .min(6, {
            message:
              "Treść odpowiedzi dla klienta musi zawierać co najmniej 6 znaków.",
          })
          .max(9000, {
            message:
              "Treść odpowiedzi dla klienta może zawierać maksymalnie 9000 znaków.",
          }),
      })
    )
    .min(1),
  employeeDescription: z
    .string()
    .min(6, {
      message: "Notatka dla pracownika musi zawierać co najmniej 6 znaków.",
    })
    .max(9000, {
      message: "Notatka dla pracownika może zawierać maksymalnie 9000 znaków.",
    }),
  file: z.array(z.any()).optional(), // dla uproszczenia
});

export type ArticleFormData = z.infer<typeof articleSchema>;

// Typ do wysłania na API, gdzie tags to string[]
export type ArticleCreateDto = Omit<ArticleFormData, "tags"> & {
  tags: string[];
};

export type RejectArticleDto = {
  articleId: string;
  rejectionReason: string;
};
