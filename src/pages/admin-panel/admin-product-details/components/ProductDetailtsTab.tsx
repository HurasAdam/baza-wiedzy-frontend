import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X, Loader } from "lucide-react";
import { ProductDetailsForm } from "./ProductDetailsForm";
import { FormProvider, useForm } from "react-hook-form";
import { useUpdateProductMutation } from "@/hooks/products/use-products";
import { toast } from "sonner";
import queryClient from "@/config/query.client";
import type { AxiosError } from "axios";
import type { ProductForm } from "@/components/product/product-modal";

interface ProductDetailsTabProps {
  product: {
    _id: string;
    name: string;
    labelColor: string;
    createdBy: { name: string; surname: string };
    createdAt: string;
  };
}

export const ProductDetailsTab = ({ product }: ProductDetailsTabProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const { mutate, isPending } = useUpdateProductMutation();

  const onEdit = () => {
    form.reset({
      name: product.name,
      labelColor: product.labelColor,
    });
    setIsEditing(true);
  };

  const handleSave = (data: ProductForm) =>
    onSave({ productId: product._id, data });

  const form = useForm({
    defaultValues: {
      name: product && product.name,
      labelColor: product && product.labelColor,
    },
  });

  const { isDirty } = form.formState;

  const onSave = ({
    productId,
    data,
  }: {
    productId: string;
    data: ProductForm;
  }) => {
    mutate(
      { productId, data },
      {
        onSuccess: () => {
          toast.success("Produkt został zaktualizowany");
          queryClient.invalidateQueries({ queryKey: ["product", product._id] });
          form.reset();
          setIsEditing(false);
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

  const handleSubmit = form.handleSubmit(handleSave);

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Informacje o produkcie</CardTitle>
          {isEditing ? (
            <div className="flex gap-2">
              <Button
                size="sm"
                className="gap-2"
                onClick={handleSubmit}
                disabled={!isDirty || isPending}
              >
                {isPending ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Zapisz
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={() => setIsEditing(false)}
              >
                <X className="w-4 h-4" /> Anuluj
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={onEdit}
            >
              <Pencil className="w-4 h-4" /> Edytuj
            </Button>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {isEditing && product ? (
            <FormProvider {...form}>
              <ProductDetailsForm />
            </FormProvider>
          ) : (
            <>
              <div>
                <p className=" text-muted-foreground block text-sm font-medium mb-1">
                  Nazwa:
                </p>

                <div className="h-10 flex items-center">
                  <p className="text-sm font-medium">{product.name}</p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground block text-sm font-medium mb-1">
                  Kolor etykiety:
                </p>
                <div className="h-10 flex items-center gap-2">
                  <span
                    className="inline-block w-8 h-8 rounded-full"
                    style={{ backgroundColor: product.labelColor }}
                  />
                  <span className="text-sm">{product.labelColor}</span>
                </div>
              </div>
            </>
          )}

          <Separator />

          <div>
            <p className="text-xs text-muted-foreground">Utworzony przez:</p>
            <div className="flex items-center gap-1.5">
              <p className="text-sm">{product.createdBy.name}</p>
              <p className="text-sm">{product.createdBy.surname}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Data utworzenia:</p>
            <p className="text-sm">
              {new Date(product.createdAt).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
