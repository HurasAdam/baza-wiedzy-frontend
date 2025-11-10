// validation/workspace-article.schema.ts
import { z } from "zod";

export const workspaceArticleSchema = z.object({
  title: z.string().min(1, "Nazwa artykułu jest wymagana"),
  folderId: z.string().min(1),
  responseVariants: z.array(
    z.object({
      version: z.number().optional(),
      variantName: z.string().min(1, "Nazwa wersji jest wymagana"),
      variantContent: z.string().min(1, "Treść wersji jest wymagana"),
    })
  ),
});

export type WorkspaceArticleFormData = z.infer<typeof workspaceArticleSchema>;
