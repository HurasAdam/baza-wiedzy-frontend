import type { AxiosError } from "axios";
import { toast } from "sonner";
import type { z } from "zod";
import queryClient from "../../config/query.client";
import { useCreateProductMutation } from "../../hooks/products/use-products";
import { productSchema } from "../../validation/product.schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ProductForm } from "./product-form";

interface CreateWorkspaceProps {
  isCreatingProduct: boolean;
  setIsCreatingProduct: (isCreatingWorkspace: boolean) => void;
  closeOnOutsideClick?: boolean;
}

export type ProductForm = z.infer<typeof productSchema>;

export const ProductModal = ({
  isCreatingProduct,
  setIsCreatingProduct,
  closeOnOutsideClick,
}: CreateWorkspaceProps) => {
  const { mutate, isPending } = useCreateProductMutation();

  const onSubmit = (data: ProductForm) => {
    mutate(data, {
      onSuccess: () => {
        setIsCreatingProduct(false);
        queryClient.invalidateQueries({ queryKey: ["products"] });
        toast.success("Zmiany zapisane", {
          description: "Produkt został pomyślnie dodany.",
          position: "bottom-right",
        });
      },
      onError: (error) => {
        const { status } = error as AxiosError;

        if (status === 409) {
          toast.error("Niepowodzenie", {
            description: "Produkt o tej nazwie już istnieje. Nazwa produktu musi być unikalna.",
            position: "bottom-right",
            duration: 7000,
          });
          return;
        }

        toast.error("Wystąpił błąd serwera");
      },
    });
  };

  return (
    <Dialog open={isCreatingProduct} onOpenChange={setIsCreatingProduct} modal={true}>
      <DialogContent
        {...(!closeOnOutsideClick ? { onInteractOutside: (e) => e.preventDefault() } : {})}
        className="max-h-[80vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Utwórz produkt</DialogTitle>
        </DialogHeader>

        <ProductForm
          defaultValues={{ name: "", labelColor: "#FF5733", banner: "xyz" }}
          onSubmit={onSubmit}
          submitText="Utwórz"
          isSubmitting={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
