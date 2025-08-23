import z from "zod";

export const updateUserRoleSchema = z.object({
  roleId: z.string(),
});

export type UpdateUserRoleFormData = z.infer<typeof updateUserRoleSchema>;
