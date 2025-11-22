import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader, Pencil } from "lucide-react";
import type { NavigateFunction } from "react-router-dom";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import { useUpdateWorkspaceArticleMutation } from "../../hooks/workspace-articles/use-workspace-articles";
import type { WorkspaceArticle, WorkspaceArticleUpdateResponse } from "../../types/workspace-article";

import type { Folder } from "../../pages/workspace-manage-folders/components/ManageFoldersFilters";
import type { EditWorkspaceArticleFormData } from "../../validation/edit-workspace-article.schema";
import { EditWorkspaceArticleForm } from "./EditWorkspaceArticleForm";

interface EditWorkspaceArticleModalProps {
  isOpen: boolean;
  folders: Folder[];
  currentFolderId: string;
  article: WorkspaceArticle;
  onClose: () => void;
  navigate: NavigateFunction;
}

export function EditWorkspaceArticleModal({
  isOpen,
  folders,
  article,
  onClose,
  currentFolderId,
  navigate,
}: EditWorkspaceArticleModalProps) {
  const { mutate: updateWorkspaceArticleMutate, isPending } = useUpdateWorkspaceArticleMutation();

  const handleSubmit = (data: EditWorkspaceArticleFormData) => {
    console.log(data);
    updateWorkspaceArticleMutate(
      { articleId: article._id, payload: data },
      {
        onSuccess: (data: WorkspaceArticleUpdateResponse) => {
          onClose();
          toast.success("Zmiany zostały zapisane", {
            position: "bottom-right",
            description: "Artykuł został zaktualizowany",
          });
          const newFolderId = data.folderId;
          const currentWorkspace = data.workspaceId;
          const currentArticle = data._id;

          if (newFolderId !== currentFolderId) {
            navigate(`/workspace/${currentWorkspace}/folders/${newFolderId}/articles/${currentArticle}`, {
              replace: true,
            });
          }
          queryClient.invalidateQueries({
            queryKey: ["workspace-folders", currentWorkspace],
          });
          queryClient.invalidateQueries({
            queryKey: ["workspace-article", currentArticle],
          });
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl p-6 sm:p-8 rounded-xl shadow-xl bg-background/95 backdrop-blur-sm border ">
        <DialogHeader className="flex flex-col gap-2 border-b border-muted/20 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pencil className="w-5 h-5 text-primary" />
              <DialogTitle className="text-xl font-semibold text-foreground/90">Edytuj tytuł artykułu</DialogTitle>
            </div>
            {isPending && <Loader className="animate-spin w-5 h-5 text-primary" />}
          </div>
        </DialogHeader>

        <EditWorkspaceArticleForm
          defaultValues={{
            title: article.title,
            folderId: article.folder?._id ?? "",
          }}
          folders={folders}
          onSubmit={handleSubmit}
          isSaving={isPending}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
