import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

import { type WorkspaceDataForm } from "@/validation/workspace.schema";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import { useCreateWorkspaceMutation } from "../../hooks/workspace/use-workspace";
import WorkspaceForm from "./workspace-form";

interface CreateWorkspaceProps {
  isCreatingWorkspace: boolean;
  setIsCreatingWorkspace: (isCreatingWorkspace: boolean) => void;
  onClose: () => void;
}

export const CreateWorkspaceModal = ({
  isCreatingWorkspace,
  setIsCreatingWorkspace,
  onClose,
}: CreateWorkspaceProps) => {
  const { mutate, isPending } = useCreateWorkspaceMutation();

  const onSubmit = (data: WorkspaceDataForm) => {
    mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["my-workspaces"] });
        toast.success("Zmiany zostały zapisane", {
          position: "bottom-right",
          description: "Dodano nową kolekcję",
        });
        onClose();
      },
    });
  };

  return (
    <Dialog open={isCreatingWorkspace} onOpenChange={setIsCreatingWorkspace} modal={true}>
      <DialogContent className="max-h-[80vh] overflow-y-auto min-w-2xl">
        <DialogHeader>
          <DialogTitle>Utwórz nową kolekcję</DialogTitle>
        </DialogHeader>

        <WorkspaceForm onSubmit={onSubmit} isLoading={isPending} />
      </DialogContent>
    </Dialog>
  );
};
