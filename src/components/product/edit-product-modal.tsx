import type { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import {
  useFindProductQuery,
  useUpdateProductMutation,
} from "../../hooks/products/use-products";
import { productSchema } from "../../validation/product.schema";
import { ProductForm } from "./product-form";
import { Loader } from "lucide-react";

interface CreateWorkspaceProps {
  productId: string;
  isEditingProduct: boolean;
  setIsEditingProduct: (isEditingProduct: boolean) => void;
  closeOnOutsideClick?: boolean;
}

export type ProductForm = z.infer<typeof productSchema>;

export const EditProductModal = ({
  productId,
  isEditingProduct,
  setIsEditingProduct,
  closeOnOutsideClick,
}: CreateWorkspaceProps) => {
  const { data: product, isLoading: isProductLoading } =
    useFindProductQuery(productId);
  const { mutate, isPending } = useUpdateProductMutation();

  const onSubmit = (data: ProductForm) => {
    if (!product) return;
    mutate(
      { productId: product._id, data },
      {
        onSuccess: () => {
          setIsEditingProduct(false);
          queryClient.invalidateQueries({ queryKey: ["products"] });
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
    <Dialog
      open={isEditingProduct}
      onOpenChange={setIsEditingProduct}
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
            {isProductLoading ? (
              <div className="h-5  ">Edytuj produkt: </div>
            ) : (
              `Edytuj produkt: ${product.name} `
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
          <ProductForm
            defaultValues={{
              name: product!.name,
              labelColor: product!.labelColor,
              banner: product!.banner,
            }}
            onSubmit={onSubmit}
            submitText="Zapisz"
            isSubmitting={isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
