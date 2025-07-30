import type { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import { productSchema } from "../../validation/product.schema";
import { Loader } from "lucide-react";
import { ProductForm } from "../product/product-form";
import JstProjectForm, { type JstProjectFormData } from "./jst-project-form";
import {
  useFindJstProjectQuery,
  useUpdateJstProjectMutation,
} from "@/hooks/jst-projects/use-jst-projects";

interface EditJstProjectModalProps {
  projectId: string;
  isEditingJstProject: boolean;
  setIsEditingJstProject: (isEditingProduct: boolean) => void;
  closeOnOutsideClick?: boolean;
}

export type ProductForm = z.infer<typeof productSchema>;

export const EditJstProjectModal = ({
  projectId,
  isEditingJstProject,
  setIsEditingJstProject,
  closeOnOutsideClick,
}: EditJstProjectModalProps) => {
  const { data: jstProject, isLoading: isJstProjectLoading } =
    useFindJstProjectQuery(projectId);
  const { mutate, isPending } = useUpdateJstProjectMutation();

  const onSubmit = (data: JstProjectFormData) => {
    if (!jstProject) return;
    mutate(
      { jstProjectId: jstProject._id, data },
      {
        onSuccess: () => {
          setIsEditingJstProject(false);
          queryClient.invalidateQueries({ queryKey: ["jst-projects"] });
          queryClient.invalidateQueries({
            queryKey: ["jst-project", jstProject._id],
          });
          toast.success("Zmiany zostały zapisane.");
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
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>
                    Błąd: Duplikat produktu
                  </div>
                  <div style={{ opacity: 0.8 }}>
                    Tag o tej nazwie już istnieje, nazwa produktu musi być
                    unikalna
                  </div>
                </div>
              </div>,
              { duration: 7000 }
            );
            return;
          }

          toast.error("Wystąpił błąd serwera");
        },
      }
    );
  };

  return (
    <Dialog
      open={isEditingJstProject}
      onOpenChange={setIsEditingJstProject}
      modal={true}
    >
      <DialogContent
        {...(!closeOnOutsideClick
          ? { onInteractOutside: (e) => e.preventDefault() }
          : {})}
        className="max-h-[80vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>
            {" "}
            {isJstProjectLoading ? (
              <div className="h-5  ">Edytuj tag: </div>
            ) : (
              `Edytuj projekt JST: ${jstProject.name} `
            )}
          </DialogTitle>
        </DialogHeader>

        {isJstProjectLoading ? (
          // ==== SKELETON ====
          <div className="space-y-6 justify-between  py-6 px-4 h-34">
            <div className=" flex justify-center my-12">
              <Loader className="animate-spin" />
            </div>
          </div>
        ) : (
          // ==== REAL FORM ====
          <JstProjectForm
            defaultValues={{
              name: jstProject!.name,
              description: jstProject!.description,
            }}
            onSubmit={onSubmit}
            isSubmitting={isPending}
            submitText="Zapisz"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
