import type { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

import { workspaceSchema } from "@/validation/workspace.schema";
import { useCreateWorkspaceMutation } from "../../hooks/workspace/use-workspace";
import WorkspaceForm from "./workspace-form";

interface CreateWorkspaceProps {
  isCreatingWorkspace: boolean;
  setIsCreatingWorkspace: (isCreatingWorkspace: boolean) => void;
}

export type WorkspaceForm = z.infer<typeof workspaceSchema>;

export const CreateWorkspaceModal = ({ isCreatingWorkspace, setIsCreatingWorkspace }: CreateWorkspaceProps) => {
  const { mutate } = useCreateWorkspaceMutation();

  const onSubmit = (data: WorkspaceForm) => {
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
    mutate(data);
  };

  return (
    <Dialog open={isCreatingWorkspace} onOpenChange={setIsCreatingWorkspace} modal={true}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Utwórz prywanty moduł szablonów i odpowiedzi</DialogTitle>
        </DialogHeader>

        <WorkspaceForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};
