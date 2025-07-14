import z from "zod";

export const pendingArticleRejectionSchema = z.object({
  rejectionReason: z.string().min(3),
});
