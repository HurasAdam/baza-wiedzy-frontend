import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

import type { AxiosError } from "axios";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import { useCreateProductMutation } from "../../hooks/products/use-products";
import { productSchema } from "../../validation/product.schema";
import { ProductForm } from "./product-form";

interface CreateWorkspaceProps {
  isCreatingProduct: boolean;
  setIsCreatingProduct: (isCreatingWorkspace: boolean) => void;
  closeOnOutsideClick?: boolean;
}

// export const colorOptions = [
//   "#FF5733", // Red-Orange
//   "#33C1FF", // Blue
//   "#28A745", // Green
//   "#FFC300", // Yellow
//   "#8E44AD", // Purple
//   "#E67E22", // Orange
//   "#2ECC71", // Light Green
//   "#D72631", // Strong Red
//   "#1B998B", // Teal
//   "#F4D35E", // Soft Yellow
//   "#4A90E2", // Soft Blue
//   "#F08A5D", // Coral
// ];

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
        toast.success("Produkt został dodany");
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
    });
  };

  return (
    <Dialog
      open={isCreatingProduct}
      onOpenChange={setIsCreatingProduct}
      modal={true}
    >
      <DialogContent
        {...(!closeOnOutsideClick
          ? { onInteractOutside: (e) => e.preventDefault() }
          : {})}
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
