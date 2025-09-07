import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { topicSchema } from "@/validation/topic.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { iconMap } from "../../constants/role-icons";
import { updateUserRoleSchema, type UpdateUserRoleFormData } from "../../validation/update-user-role.schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export type TopicFormData = z.infer<typeof topicSchema>;

interface TopicFormProps {
  roles: { _id: string; name: string; iconKey: string; labelColor: string }[];
  defaultValues: { roleId: string };
  onSubmit: (data: UpdateUserRoleFormData) => void;
  submitText?: string;
  isSubmitting?: boolean;
}

export const UpdateUserRoleForm = ({
  roles,
  defaultValues,
  onSubmit,
  submitText = "Zapisz",
  isSubmitting = false,
}: TopicFormProps) => {
  const form = useForm<UpdateUserRoleFormData>({
    resolver: zodResolver(updateUserRoleSchema),
    defaultValues,
  });

  const isDirty = form.formState.isDirty;
  const xd = form.getValues();
  console.log(xd);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="roleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rola użytkownika</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full border-ring">
                      <SelectValue placeholder="-- Wybierz rolę --" />
                    </SelectTrigger>
                    <SelectContent side="bottom">
                      {roles?.map((role) => {
                        const Icon = iconMap[role.iconKey || "User"];
                        return (
                          <SelectItem key={role._id} value={role._id}>
                            <Icon />
                            {role.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? (
              <span className="flex gap-2 items-center">
                <Loader className="animate-spin" />
                {submitText}
              </span>
            ) : (
              <span className="flex gap-2 items-center">
                <Check />
                {submitText}
              </span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
