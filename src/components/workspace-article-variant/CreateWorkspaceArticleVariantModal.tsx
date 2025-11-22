import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import { useCreateWorkspaceArticleVariantMutation } from "../../hooks/workspace-articles/use-workspace-articles";
import type { WorkspaceArticleResponseVariantFormData } from "../../validation/workspace-article-response-variant.schema";
import { WorkspaceArticleVariantForm } from "./workspaceArticleVariantForm";

interface CreateVariantModalProps {
  isOpen: boolean;
  articleId: string;

  onClose: (open?: boolean) => void;
}

export function CreateWorkspaceArticleVariantModal({ articleId, isOpen, onClose }: CreateVariantModalProps) {
  const { mutate, isPending } = useCreateWorkspaceArticleVariantMutation();

  const handleSubmit = (data: WorkspaceArticleResponseVariantFormData) => {
    mutate(
      { articleId, payload: data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["workspace-article", articleId] });
          toast.success("Zmiany zostały zapisane", {
            position: "bottom-right",
            description: "Wersja odpowiedzi została zaktualizowana",
          });
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
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
        <DialogHeader className="border-b border-muted/20 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-primary" />
            <DialogTitle className="text-xl font-semibold text-foreground/90 tracking-tight">Dodaj wariant</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">Utwórz nowy wariant odpowiedzi dla tego artykułu.</p>
        </DialogHeader>

        <WorkspaceArticleVariantForm
          defaultValues={{ variantName: "", variantContent: "" }}
          onSubmit={handleSubmit}
          isSaving={isPending}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
