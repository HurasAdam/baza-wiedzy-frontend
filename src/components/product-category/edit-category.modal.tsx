import type { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import { productSchema } from "../../validation/product.schema";
import { Loader } from "lucide-react";
import { CategoryForm } from "./category-form";
import {
  useFindProductCategoryQuery,
  useUpdateProductCategorytMutation,
} from "@/hooks/product-categories/use-product-categories";
import type { ProductCategoryFormData } from "@/validation/product-category.schema";
import { assertDefined } from "@/utils/asserts";
import { Button } from "../ui/button";

interface EditCategoryModalProps {
  categoryId: string;
  productId: string;
  isEditingCategory: boolean;
  setIsEditingCategory: (isEditingCategory: boolean) => void;
  closeOnOutsideClick?: boolean;
}

export type ProductForm = z.infer<typeof productSchema>;

export const EditCategoryModal = ({
  categoryId,
  productId,
  isEditingCategory,
  setIsEditingCategory,
  closeOnOutsideClick,
}: EditCategoryModalProps) => {
  const { mutate, isPending } = useUpdateProductCategorytMutation();

  const {
    data: category,
    isLoading,
    isError,
  } = useFindProductCategoryQuery(categoryId);

  const onRetry = () => {
    setIsEditingCategory(false);

    queryClient.invalidateQueries({ queryKey: ["category", categoryId] });
  };

  const onSubmit = (data: ProductCategoryFormData) => {
    assertDefined(categoryId, "EditCategoryModal requires categoryId");
    assertDefined(productId, "EditCategoryModal requires productId");
    assertDefined(category, "EditCategoryModal requires category");
    mutate(
      { categoryId: category._id, data },
      {
        onSuccess: () => {
          setIsEditingCategory(false);
          queryClient.invalidateQueries({
            queryKey: ["categories-by-product", productId],
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
                    Produktu o tej nazwie już istnieje, nazwa produktu musi być
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
    <Dialog open={isEditingCategory} onOpenChange={setIsEditingCategory} modal>
      <DialogContent
        {...(!closeOnOutsideClick
          ? { onInteractOutside: (e) => e.preventDefault() }
          : {})}
      >
        <DialogHeader>
          <DialogTitle>
            {isLoading
              ? "Ładowanie kategorii..."
              : isError || !category
              ? "Nie znaleziono kategorii"
              : `Edytuj kategorię: ${category.name}`}
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader className="animate-spin" />
          </div>
        )}

        {!isLoading && (isError || !category) && (
          <div className="p-4 text-center text-muted-foreground">
            <p className="mb-3">
              Wystąpił błąd przy pobieraniu danych kategorii.
            </p>
            <Button size="sm" onClick={onRetry}>
              Spróbuj ponownie
            </Button>
          </div>
        )}

        {!isLoading && category && (
          <CategoryForm
            defaultValues={{ name: category.name }}
            onSubmit={onSubmit}
            isSubmitting={isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
