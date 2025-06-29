import z from "zod";

export const reportTopicSchema = z.object({
  topic: z.string().min(1, "Id zgłaszanego tematu jest wymagane"),
  description: z.string().optional(),
});
