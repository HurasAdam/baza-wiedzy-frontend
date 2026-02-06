import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(3, { message: "Tytuł artykułu musi zawierać co najmniej 3 znaki." }).max(200, {
    message: "Tytuł artykułu może zawierać maksymalnie 200 znaków.",
  }),
  product: z
    .object({
      value: z.string(),
      label: z.string(),
      color: z.string().optional(),
    })
    .refine((val) => !!val.value, { message: "Produkt jest wymagany. Wybierz jedną z dostępnych opcji." }),
  category: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .refine((val) => !!val.value, { message: "Kategoria jest wymagana. Wybierz jedną z dostępnych opcji." }),
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
          .min(1, {
            message: "Treść odpowiedzi dla klienta musi zawierać co najmniej 1 znak.",
          })
          .max(9000, {
            message: "Treść odpowiedzi dla klienta może zawierać maksymalnie 9000 znaków.",
          }),
      }),
    )
    .min(1),
  employeeDescription: z
    .string()
    .min(1, {
      message: "Notatka dla pracownika musi zawierać co najmniej 1 znak.",
    })
    .max(9000, {
      message: "Notatka dla pracownika może zawierać maksymalnie 9000 znaków.",
    }),
  file: z.array(z.any()).optional(),
});

export type ArticleFormData = z.infer<typeof articleSchema>;

export type ArticleCreateDto = Omit<ArticleFormData, "tags" | "product" | "category"> & {
  tags: string[];
  product: string;
  category: string;
};
export type RejectArticleDto = {
  articleId: string;
  rejectionReason: string;
};
