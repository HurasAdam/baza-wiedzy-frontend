import type { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

import type { AxiosError } from "axios";

import { toast } from "sonner";
import queryClient from "../../config/query.client";
import { useCreateJstProjectMutation } from "../../hooks/jst-projects/use-jst-projects";
import { jstProjectSchema } from "../../validation/jst-project.schema";
import JstProjectForm from "./jst-project-form";

interface CreateWorkspaceProps {
  closeOnOutsideClick?: boolean;
  isCreatingJstProject: boolean;
  setIsCreatingJstProject: (isCreatingWorkspace: boolean) => void;
}

export type JstProjectForm = z.infer<typeof jstProjectSchema>;

export const JstProjectModal = ({
  closeOnOutsideClick = false,
  isCreatingJstProject,
  setIsCreatingJstProject,
}: CreateWorkspaceProps) => {
  const { mutate, isPending } = useCreateJstProjectMutation();

  const onSubmit = (data: JstProjectForm) => {
    mutate(data, {
      onSuccess: () => {
        setIsCreatingJstProject(false);
        toast.success("Projekt został dodany");
        queryClient.invalidateQueries({ queryKey: ["jst-projects"] });
      },
      onError: (error) => {
        const { status } = error as AxiosError;
        if (status === 409) {
          toast.error(
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontFamily: "Inter, sans-serif",
                color: "#991b1b",
                fontSize: "14px",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>Błąd: Duplikat nazwy projektu</div>
                <div style={{ opacity: 0.8 }}>Projekt o podanej nazwie już istnieje. Wybierz inną nazwę.</div>
              </div>
            </div>,
            { duration: 7000 }
          );
          return;
        }
        if (status === 403) {
          toast.error("Brak uprawnień", {
            description: "Nie posiadasz wymaganych uprawnień do wykonania tej operacji.",
            position: "bottom-right",
            duration: 7000,
          });
          return;
        }

        toast.error("Wystapił błąd, spróbuj ponownie");
      },
    });
  };

  return (
    <Dialog open={isCreatingJstProject} onOpenChange={setIsCreatingJstProject} modal={true}>
      <DialogContent
        {...(!closeOnOutsideClick ? { onInteractOutside: (e) => e.preventDefault() } : {})}
        className="max-h-[80vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Utwórz projekt JST</DialogTitle>
        </DialogHeader>

        <JstProjectForm
          defaultValues={{ name: "", description: "" }}
          onSubmit={onSubmit}
          submitText="Utwórz"
          isSubmitting={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
