import z from "zod";

export const workspaceFolderSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
});

export type WorkspaceFolderFormData = z.infer<typeof workspaceFolderSchema>;
