import z from "zod";

export const editUserInfoSchema = z.object({
  name: z.string().min(2, "Imię musi zawierać conajmniej 2 znaki"),
  surname: z.string().min(2, "Nazwisko musi zawierać conajmniej 2 znaki"),
  bio: z.string().optional(),
});
export type EditUserInfoFormData = z.infer<typeof editUserInfoSchema>;
