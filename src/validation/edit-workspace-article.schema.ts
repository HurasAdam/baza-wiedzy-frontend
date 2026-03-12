import { z } from "zod";

export const editWorkspaceArticleSchema = z.object({
  title: z.string().min(2, "Tytuł artykułu wymaga minimum 2 znaków"),
  folderId: z.string().min(1),
  marker: z.string().optional(),
});

export type EditWorkspaceArticleFormData = z.infer<typeof editWorkspaceArticleSchema>;
