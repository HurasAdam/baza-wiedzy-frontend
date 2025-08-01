import type { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import {
  useFindProductQuery,
  useUpdateProductMutation,
} from "../../hooks/products/use-products";

import { Loader } from "lucide-react";
import { TopicForm } from "./topic-form";
import type { IProduct } from "@/types/product";
import type { topicSchema } from "@/validation/topic.schema";
import {
  useFindTopicQuery,
  useUpdateTopicMutation,
} from "@/hooks/topics/use-topics";

interface CreateWorkspaceProps {
  products: IProduct[];
  topicId: string;
  isEditingTopic: boolean;
  setIsEditingTopic: (isEditingTopic: boolean) => void;
  closeOnOutsideClick?: boolean;
}

export type topicFormData = z.infer<typeof topicSchema>;

export const EditTopicModal = ({
  products,
  topicId,
  isEditingTopic,
  setIsEditingTopic,
  closeOnOutsideClick,
}: CreateWorkspaceProps) => {
  const { data: topic, isLoading: isProductLoading } =
    useFindTopicQuery(topicId);
  const { mutate, isPending } = useUpdateTopicMutation();

  const onSubmit = (data: topicFormData) => {
    if (!topic) return;
    mutate(
      { topicId: topic._id, data },
      {
        onSuccess: () => {
          setIsEditingTopic(false);
          queryClient.invalidateQueries({ queryKey: ["topics"] });
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
                    Temat rozmowy o tej nazwie już istnieje, nazwa nazwa tematu
                    musi być unikalna
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
    <Dialog open={isEditingTopic} onOpenChange={setIsEditingTopic} modal={true}>
      <DialogContent
        {...(!closeOnOutsideClick
          ? { onInteractOutside: (e) => e.preventDefault() }
          : {})}
        className="max-h-[80vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>
            {" "}
            {isProductLoading ? (
              <div className="h-5  ">Edytuj produkt: </div>
            ) : (
              `Edytuj temat rozmowy: ${topic?.title} `
            )}
          </DialogTitle>
        </DialogHeader>

        {isProductLoading ? (
          // ==== SKELETON ====
          <div className="space-y-6 justify-between  py-6 px-4 h-53">
            <div className=" flex justify-center my-12">
              <Loader className="animate-spin" />
            </div>
          </div>
        ) : (
          // ==== REAL FORM ====
          <TopicForm
            products={products}
            onSubmit={onSubmit}
            defaultValues={{
              title: topic!.title,
              product: topic!.product._id, // <-- tylko ID
            }}
            isSubmitting={isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
