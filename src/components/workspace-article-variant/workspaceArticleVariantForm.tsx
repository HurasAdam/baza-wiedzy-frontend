import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Save } from "lucide-react";
import { useForm } from "react-hook-form";

export interface WorkspaceArticleVariant {
  variantName: string;
  variantContent: string;
}

interface WorkspaceArticleVariantFormProps {
  defaultValues: WorkspaceArticleVariant;
  onSubmit: (data: WorkspaceArticleVariant) => void;
  isSaving?: boolean;
  onClose?: () => void;
}

export const WorkspaceArticleVariantForm = ({
  defaultValues,
  onSubmit,
  isSaving = false,
  onClose,
}: WorkspaceArticleVariantFormProps) => {
  const form = useForm<WorkspaceArticleVariant>({
    defaultValues,
    mode: "onChange",
  });

  const isDirty = form.formState.isDirty;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Nazwa wariantu */}
        <FormField
          control={form.control}
          name="variantName"
          rules={{ required: "Nazwa wariantu jest wymagana" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa wariantu</FormLabel>
              <FormControl>
                <Input placeholder="Wpisz nazwę wariantu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Treść wariantu */}
        <FormField
          control={form.control}
          name="variantContent"
          rules={{ required: "Treść wariantu jest wymagana" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Treść wariantu</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="h-[470px] resize-none overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
                  placeholder="Wpisz treść wariantu"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Footer */}
        <DialogFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} type="button" disabled={isSaving}>
            Anuluj
          </Button>
          <Button disabled={isSaving || !isDirty} className="cursor-pointer flex items-center gap-2" type="submit">
            {isSaving ? <Loader className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
            Zapisz
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
