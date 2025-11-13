import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

import type { AxiosError } from "axios";
import {
  AppWindow,
  Coffee,
  GraduationCap,
  Layers,
  LeafyGreen,
  LibraryBig,
  PanelsTopLeft,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import { useCreateWorkspaceFolderMutation } from "../../hooks/workspace-folders/use-workspace-folder";
import { type WorkspaceFolderFormData } from "../../validation/workspace-folder.schema";
import WorkspaceFolderForm from "./WorkspaceFolderForm";

interface CreateWorkspaceFolderModalProps {
  isCreatingWorkspaceFolder: boolean;
  setIsCreatingWorkspaceFolder: (isCreatingWorkspaceFolder: boolean) => void;
  workspaceId: string;
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

export const CreateWorkspaceFolderModal = ({
  isCreatingWorkspaceFolder,
  setIsCreatingWorkspaceFolder,
  workspaceId,
}: CreateWorkspaceFolderModalProps) => {
  const { mutate, isPending } = useCreateWorkspaceFolderMutation();

  const onSubmit = (data: WorkspaceFolderFormData) => {
    mutate(
      {
        workspaceId,
        payload: data,
      },
      {
        onSuccess: () => {
          toast.success("Zmiany zostały zapisane", {
            position: "bottom-right",
            description: "Dodano nowy folder",
          });
          queryClient.invalidateQueries({ queryKey: ["workspace-folders", workspaceId] });
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
    <Dialog open={isCreatingWorkspaceFolder} onOpenChange={setIsCreatingWorkspaceFolder} modal={true}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            📁 Utwórz nowy folder w kolekcji
          </DialogTitle>
          <p className="text-sm text-muted-foreground  mt-1">
            Foldery pomagają organizować artykuły i zasoby w ramach kolekcji.
          </p>
        </DialogHeader>

        <WorkspaceFolderForm workspaceId={workspaceId} isLoading={isPending} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};
