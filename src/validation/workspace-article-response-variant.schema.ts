// validation/workspace-article.schema.ts
import { z } from "zod";

export const workspaceArticleResponseVariantSchema = z.object({
  variantName: z.string().min(1, "Nazwa wariantu odpowiedzi jest wymagana"),
  variantContent: z.string().min(1),
});

export type WorkspaceArticleResponseVariantFormData = z.infer<typeof workspaceArticleResponseVariantSchema>;
