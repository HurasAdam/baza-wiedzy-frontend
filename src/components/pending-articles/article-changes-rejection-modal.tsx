import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, MessageSquareText, SendHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { pendingArticleRejectionSchema } from "../../validation/pending-article-rejection.schema";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";

interface CreateWorkspaceProps {
  onSubmit: ({ rejectionReason }) => void;
  closeOnOutsideClick?: boolean;
  isCreatingArticleRejection: boolean;
  setIsCreatingArticleRejection: (isCreatingWorkspace: boolean) => void;
  isPending: boolean;
}

export type JstProjectForm = z.infer<typeof pendingArticleRejectionSchema>;

export const ArticleChangesRejectionModal = ({
  onSubmit,
  closeOnOutsideClick = false,
  isCreatingArticleRejection,
  setIsCreatingArticleRejection,
  isPending,
}: CreateWorkspaceProps) => {
  const form = useForm<JstProjectForm>({
    resolver: zodResolver(pendingArticleRejectionSchema),
    defaultValues: {
      rejectionReason: "",
    },
  });

  const onFormSubmit = (values) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Dialog open={isCreatingArticleRejection} onOpenChange={setIsCreatingArticleRejection} modal={true}>
      <DialogContent
        {...(!closeOnOutsideClick ? { onInteractOutside: (e) => e.preventDefault() } : {})}
        className="
          w-[95vw] min-w-5xl
          min-h-[84vh]
          max-h-[84vh]
          p-6 sm:p-8
          rounded-xl
          shadow-xl
          bg-background/95
          backdrop-blur-sm
          border border-muted/20
          
        "
      >
        <DialogHeader className="border-b border-muted/20 flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <div className="flex h-13 w-13 items-center justify-center rounded-md border bg-background text-foreground">
              <MessageSquareText className="h-8 w-8" />
            </div>

            <div className="flex flex-col justify-center">
              <DialogTitle className="text-xl font-semibold text-foreground/90 tracking-tight">
                Uwagi do artykułu
              </DialogTitle>
              <p className="text-[13px] text-muted-foreground">
                Opisz uwagi i kwestie, które należy poprawić przed ponowną weryfikacją artykułu.
              </p>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="flex flex-col gap-4">
            <div className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="rejectionReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Uwagi i kwestie wymagające poprawy</FormLabel>
                    <FormControl>
                      <Textarea
                        className="h-[470px] resize-none overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
                        {...field}
                        placeholder="Wprowadź uwagi, i opisz kwestie wymagające poprawy"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button className="cursor-pointer" type="submit" disabled={isPending}>
                {isPending ? (
                  <span className="flex items-center gap-1.5">
                    <Loader className="animate-spin" />
                    Wyślij
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <SendHorizontal />
                    Wyślij
                  </span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
