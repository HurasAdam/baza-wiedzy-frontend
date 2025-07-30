import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jstProjectSchema } from "@/validation/jst-project.schema";
import { Textarea } from "../ui/textarea";
import type z from "zod";

export type JstProjectFormData = z.infer<typeof jstProjectSchema>;

interface JstProjectFormProps {
  defaultValues: JstProjectFormData;
  onSubmit: (data: JstProjectFormData) => void;
  submitText?: string;
  isSubmitting?: boolean;
}

const JstProjectForm = ({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitText,
}: JstProjectFormProps) => {
  const form = useForm<JstProjectFormData>({
    resolver: zodResolver(jstProjectSchema),
    defaultValues,
  });

  const isDirty = form.formState.isDirty;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwa</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nazwa projektu" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opis</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Opis projektu" rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end ">
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? "Zapisywanie..." : submitText}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default JstProjectForm;
