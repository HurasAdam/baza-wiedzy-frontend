import type { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

import type { AxiosError } from "axios";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import { useCreateTopicMutation } from "../../hooks/topics/use-topics";
import type { IProduct } from "../../types/product";
import { topicSchema } from "../../validation/topic.schema";
import { TopicForm } from "./topic-form";

interface CreateWorkspaceProps {
  isCreatingTopic: boolean;
  setIsCreatingTopic: (isCreatingWorkspace: boolean) => void;
  closeOnOutsideClick?: boolean;
  products: IProduct[];
  productId?: string;
}

// Define 8 predefined colors
export const colorOptions = [
  "#FF5733", // Red-Orange
  "#33C1FF", // Blue
  "#28A745", // Green
  "#FFC300", // Yellow
  "#8E44AD", // Purple
  "#E67E22", // Orange
  "#2ECC71", // Light Green
  "#34495E", // Navy
];

export type topicFormData = z.infer<typeof topicSchema>;

export const TopicModal = ({
  isCreatingTopic,
  setIsCreatingTopic,
  closeOnOutsideClick = false,
  products,
  productId,
}: CreateWorkspaceProps) => {
  const { mutate, isPending } = useCreateTopicMutation();

  const onSubmit = (data: topicFormData) => {
    mutate(data, {
      onSuccess: () => {
        setIsCreatingTopic(false);
        toast.success("Temat rozmowy został dodany");

        if (productId) {
          const params = new URLSearchParams();
          params.append("product", productId);

          queryClient.invalidateQueries({
            queryKey: ["topics", params.toString()],
          });
        } else {
          queryClient.invalidateQueries({ queryKey: ["topics"] });
        }
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
                <div style={{ fontWeight: 600, marginBottom: 2 }}>Błąd: Duplikat tematu</div>
                <div style={{ opacity: 0.8 }}>Dla wybranego produtku istnieje już temat rozmowy o tej nazwie.</div>
              </div>
            </div>,
            { duration: 7000 }
          );
          return;
        } else if (status === 403) {
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
    <Dialog open={isCreatingTopic} onOpenChange={setIsCreatingTopic} modal={true}>
      <DialogContent
        {...(!closeOnOutsideClick ? { onInteractOutside: (e) => e.preventDefault() } : {})}
        className="max-h-[80vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Utwórz temat rozmowy</DialogTitle>
        </DialogHeader>

        <TopicForm
          products={products}
          onSubmit={onSubmit}
          defaultValues={{ title: "", product: "" }}
          isSubmitting={isPending}
          productId={productId}
        />
      </DialogContent>
    </Dialog>
  );
};
