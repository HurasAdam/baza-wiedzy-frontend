import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

import { Loader2 } from "lucide-react";
import { useCreateJstProjectMutation } from "../../hooks/jst-projects/use-jst-projects";

import { pendingArticleRejectionSchema } from "../../validation/pending-article-rejection.schema";

interface CreateWorkspaceProps {
  onSubmit: ({ rejectionReason }) => void;
  closeOnOutsideClick?: boolean;
  isCreatingArticleRejection: boolean;
  setIsCreatingArticleRejection: (isCreatingWorkspace: boolean) => void;
}

export type JstProjectForm = z.infer<typeof pendingArticleRejectionSchema>;

export const PendingArticleRejectionModal = ({
  onSubmit,
  closeOnOutsideClick = false,
  isCreatingArticleRejection,
  setIsCreatingArticleRejection,
}: CreateWorkspaceProps) => {
  const form = useForm<JstProjectForm>({
    resolver: zodResolver(pendingArticleRejectionSchema),
    defaultValues: {
      rejectionReason: "",
    },
  });

  const { mutate, isPending } = useCreateJstProjectMutation();

  const onFormSubmit = (values) => {
    onSubmit(values);
  };

  return (
    <Dialog
      open={isCreatingArticleRejection}
      onOpenChange={setIsCreatingArticleRejection}
      modal={true}
    >
      <DialogContent
        {...(!closeOnOutsideClick
          ? { onInteractOutside: (e) => e.preventDefault() }
          : {})}
        className="max-h-[80vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Czy na pewno chcesz odrzucić ten artykuł ?</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)}>
            <div className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="rejectionReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Powód odrzucenia</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Wprowadź uwagi, powód odrzucenia artykułu oraz kwestie wymagające poprawy"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                className="cursor-pointer"
                type="submit"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="animate-spin" />
                    Wysyłanie
                  </span>
                ) : (
                  "Odrzuć"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
