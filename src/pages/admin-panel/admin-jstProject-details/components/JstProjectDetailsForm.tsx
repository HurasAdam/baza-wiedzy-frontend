import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { jstProjectSchema, type JstProjectFormData } from "../../../../validation/jst-project.schema";

interface Props {
  project: { _id: string; name: string; description: string };
  onCancel: () => void;
  onSave: (payload: { jstProjectId: string; data: JstProjectFormData }) => void;
  isLoading: boolean;
}

export function JstProjectDetailsForm({ project, onCancel, onSave, isLoading }: Props) {
  console.log("p", project);
  const form = useForm<JstProjectFormData>({
    resolver: zodResolver(jstProjectSchema),
    defaultValues: {
      name: project.name,
      description: project.description,
    },
  });

  const {
    formState: { isDirty, isSubmitting },
  } = form;

  const handleSubmit = (data: JstProjectFormData) => onSave({ jstProjectId: project._id, data });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Nazwa projektu */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa projektu</FormLabel>
              <FormControl>
                <Input placeholder="Np. Budowa drogi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Opis */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opis</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Akcje */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Anuluj
          </Button>
          <Button type="submit" disabled={!isDirty || isSubmitting || isLoading}>
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Zapisz
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Zapisz
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
