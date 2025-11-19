import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import { useUpdateWorkspaceArticleVariantMutation } from "../../hooks/workspace-articles/use-workspace-articles";
import type { WorkspaceArticleResponseVariantFormData } from "../../validation/workspace-article-response-variant.schema";
import { WorkspaceArticleVariantForm } from "./workspaceArticleVariantForm";

interface EditVariantModalProps {
  isOpen: boolean;
  articleId: string;
  variant: { _id: string; variantName: string; variantContent: string } | null;
  onClose: () => void;
}

export function EditWorkspaceArticleVariantModal({ articleId, isOpen, variant, onClose }: EditVariantModalProps) {
  const { mutate, isPending } = useUpdateWorkspaceArticleVariantMutation();

  console.log("VARIANTTT", variant);

  const handleSubmit = (data: WorkspaceArticleResponseVariantFormData) => {
    if (!variant) return;
    mutate(
      { articleId, responseVariantId: variant._id, payload: data },
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
            <Pencil className="w-5 h-5 text-primary" />
            <DialogTitle className="text-xl font-semibold text-foreground/90 tracking-tight">
              Edytuj wariant
            </DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">Wprowadź zmiany w nazwie i treści tego wariantu odpowiedzi.</p>
        </DialogHeader>

        <WorkspaceArticleVariantForm
          defaultValues={variant ?? { variantName: "", variantContent: "" }}
          onSubmit={handleSubmit}
          isSaving={isPending}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
