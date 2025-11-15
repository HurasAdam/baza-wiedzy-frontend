import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

import { type WorkspaceDataForm } from "@/validation/workspace.schema";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import { useCreateWorkspaceMutation } from "../../hooks/workspace/use-workspace";
import WorkspaceForm from "./workspace-form";

interface CreateWorkspaceProps {
  isCreatingWorkspace: boolean;
  setIsCreatingWorkspace: (isCreatingWorkspace: boolean) => void;
}

export const CreateWorkspaceModal = ({ isCreatingWorkspace, setIsCreatingWorkspace }: CreateWorkspaceProps) => {
  const { mutate, isPending } = useCreateWorkspaceMutation();

  const onSubmit = (data: WorkspaceDataForm) => {
    // mutate(data, {
    //   onSuccess: (data: any) => {
    //     form.reset();
    //     setIsCreatingWorkspace(false);
    //     toast.success("Workspace created successfully");
    //     navigate(`/workspaces/${data._id}`);
    //   },
    //   onError: (error: any) => {
    //     const errorMessage = error.response.data.message;
    //     toast.error(errorMessage);
    //     console.log(error);
    //   },
    // });
    mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["my-workspaces"] });
        toast.success("Dodano nową kolekcję", {
          position: "bottom-right",
          description: "Twoja lista kolekcji została zaktualizowana",
        });
      },
    });
  };

  return (
    <Dialog open={isCreatingWorkspace} onOpenChange={setIsCreatingWorkspace} modal={true}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Utwórz prywanty moduł szablonów i odpowiedzi</DialogTitle>
        </DialogHeader>

        <WorkspaceForm onSubmit={onSubmit} isLoading={isPending} />
      </DialogContent>
    </Dialog>
  );
};
