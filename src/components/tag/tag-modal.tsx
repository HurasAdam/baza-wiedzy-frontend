import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

import type { AxiosError } from "axios";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import { Plus } from "lucide-react";
import { useCreateTagMutation } from "@/hooks/tags/use-tags";
import { TagForm, type TagFormData } from "./tag-form";

interface CreateWorkspaceProps {
  isCreatingTag: boolean;
  setIsCreatingTag: (isCreatingTag: boolean) => void;
  closeOnOutsideClick?: boolean;
}

export const TagModal = ({
  isCreatingTag,
  setIsCreatingTag,
  closeOnOutsideClick,
}: CreateWorkspaceProps) => {
  const { mutate, isPending } = useCreateTagMutation();

  const onSubmit = (data: TagFormData) => {
    mutate(data, {
      onSuccess: () => {
        setIsCreatingTag(false);
        queryClient.invalidateQueries({ queryKey: ["tags"] });
        toast.success("Tag został dodany");
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
                  Błąd: Duplikat tagu
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
    });
  };

  return (
    <Dialog open={isCreatingTag} onOpenChange={setIsCreatingTag} modal={true}>
      <DialogContent
        {...(!closeOnOutsideClick
          ? { onInteractOutside: (e) => e.preventDefault() }
          : {})}
        className="max-h-[80vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className=" p-1 rounded-md  bg-card ">
              <Plus className="w-5 h-5 " />
            </span>
            Utwórz tag
          </DialogTitle>
        </DialogHeader>

        <TagForm
          defaultValues={{ name: "" }}
          onSubmit={onSubmit}
          submitText="Utwórz"
          isSubmitting={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
