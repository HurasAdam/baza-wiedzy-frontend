import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

import type { AxiosError } from "axios";
import {
  AppWindow,
  Coffee,
  GraduationCap,
  Layers,
  LeafyGreen,
  LibraryBig,
  Loader,
  PanelsTopLeft,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import {
  useEditWorkspaceFolderMutation,
  useFindOneWorkspaceFolderQuery,
} from "../../hooks/workspace-folders/use-workspace-folder";
import { type WorkspaceFolderFormData } from "../../validation/workspace-folder.schema";
import WorkspaceFolderForm from "./WorkspaceFolderForm";

interface CreateWorkspaceFolderModalProps {
  isEditingWorkspaceFolder: boolean;
  setIsEditingWorkspaceFolder: (isEditingWorkspaceFolder: boolean) => void;
  workspaceId: string;
  folderId: string;
}

export const WORKSPACE_ICONS = {
  Layers,
  Smartphone,
  LibraryBig,
  GraduationCap,
  AppWindow,
  PanelsTopLeft,
  Coffee,
  LeafyGreen,
};

export const EditWorkspaceFolderModal = ({
  isEditingWorkspaceFolder,
  setIsEditingWorkspaceFolder,
  workspaceId,
  folderId,
}: CreateWorkspaceFolderModalProps) => {
  console.log(folderId);
  const { data: folderData, isLoading: isFolderDataLoading } = useFindOneWorkspaceFolderQuery(workspaceId, folderId);

  const { mutate, isPending } = useEditWorkspaceFolderMutation();

  const onSubmit = (data: WorkspaceFolderFormData) => {
    mutate(
      {
        workspaceId,
        folderId,
        payload: data,
      },
      {
        onSuccess: () => {
          toast.success("Zmiany zostały zapisane", {
            position: "bottom-right",
            description: "Folder został zaktualizowany",
          });
          queryClient.invalidateQueries({ queryKey: ["workspace-folders", workspaceId] });
          setIsEditingWorkspaceFolder(false);
        },
        onError: (error) => {
          const { status } = error as AxiosError;

          if (status === 409) {
            toast.error("Konflikt nazwy folderu", {
              description: " Folder o tej nazwie już istnieje w kolekcji. Wybierz unikalną nazwę.",
              duration: 8000,
              position: "bottom-right",
            });
            return;
          }

          toast.error("Wystąpił błąd serwera");
        },
      }
    );
  };

  return (
    <Dialog open={isEditingWorkspaceFolder} onOpenChange={setIsEditingWorkspaceFolder} modal={true}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            📁 Edytuj folder
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">Tutaj możesz zmienić nazwę folderu.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Zmiana nazwy folderu nie wpływa na jego zawartość. Wszystkie przypisane artykuły i zasoby pozostaną w
            folderze.
          </p>
        </DialogHeader>

        {isFolderDataLoading ? (
          <div className="space-y-6 justify-between  py-6 px-4 h-34">
            <div className=" flex justify-center my-12">
              <Loader className="animate-spin" />
            </div>
          </div>
        ) : (
          <WorkspaceFolderForm
            folder={folderData}
            isLoading={isPending}
            onSubmit={onSubmit}
            workspaceId={workspaceId}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
