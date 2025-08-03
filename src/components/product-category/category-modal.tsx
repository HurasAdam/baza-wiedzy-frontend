import type { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import { topicSchema } from "../../validation/topic.schema";
import { CategoryForm } from "./category-form";
import { useCreateProductCategorytMutation } from "@/hooks/product-categories/use-product-categories";
import { assertDefined } from "@/utils/asserts";
import type { ProductCategoryFormData } from "@/validation/product-category.schema";

interface CreateWorkspaceProps {
  isCreatingCategory: boolean;
  setIsCreatingCategory: (isCreatingCategory: boolean) => void;
  closeOnOutsideClick?: boolean;
  productId: string;
}

export type topicFormData = z.infer<typeof topicSchema>;

export const CategoryModal = ({
  isCreatingCategory,
  setIsCreatingCategory,
  closeOnOutsideClick = false,
  productId,
}: CreateWorkspaceProps) => {
  const { mutate, isPending } = useCreateProductCategorytMutation();

  const onSubmit = (data: ProductCategoryFormData) => {
    assertDefined(productId, "CategoryModal requires productId");

    mutate(
      { productId, data },
      {
        onSuccess: () => {
          setIsCreatingCategory(false);
          toast.success("Kategoria została dodana");
          queryClient.invalidateQueries({
            queryKey: ["categories-by-product", productId],
          });
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
                    Błąd: Duplikat kategorii
                  </div>
                  <div style={{ opacity: 0.8 }}>
                    Dla wybranego produtku istnieje już kategoria o tej nazwie.
                  </div>
                </div>
              </div>,
              { duration: 7000 }
            );

            return;
          }
          toast.error("Wystapił błąd, spróbuj ponownie");
        },
      }
    );
  };

  return (
    <Dialog
      open={isCreatingCategory}
      onOpenChange={setIsCreatingCategory}
      modal={true}
    >
      <DialogContent
        {...(!closeOnOutsideClick
          ? { onInteractOutside: (e) => e.preventDefault() }
          : {})}
        className="max-h-[80vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Utwórz kategorie produktu</DialogTitle>
        </DialogHeader>

        <CategoryForm
          onSubmit={onSubmit}
          defaultValues={{ name: "" }}
          isSubmitting={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
