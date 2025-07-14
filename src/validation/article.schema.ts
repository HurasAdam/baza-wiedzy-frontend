import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(3).max(90),
  product: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.object({ value: z.string(), label: z.string() })).nonempty(),
  clientDescription: z.string().min(6).max(9000),
  employeeDescription: z.string().min(6).max(9000),
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
