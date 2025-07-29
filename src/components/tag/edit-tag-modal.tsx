import type { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import queryClient from "../../config/query.client";

import { productSchema } from "../../validation/product.schema";

import { Loader } from "lucide-react";
import { ProductForm } from "../product/product-form";
import { useFindTagQuery, useUpdateTagMutation } from "@/hooks/tags/use-tags";
import { TagForm, type TagFormData } from "./tag-form";

interface CreateWorkspaceProps {
  tagId: string;
  isEditingTag: boolean;
  setIsEditingTag: (isEditingProduct: boolean) => void;
  closeOnOutsideClick?: boolean;
}

export type ProductForm = z.infer<typeof productSchema>;

export const EditTagModal = ({
  tagId,
  isEditingTag,
  setIsEditingTag,
  closeOnOutsideClick,
}: CreateWorkspaceProps) => {
  const { data: tag, isLoading: isProductLoading } = useFindTagQuery(tagId);
  const { mutate, isPending } = useUpdateTagMutation();

  const onSubmit = (data: TagFormData) => {
    if (!tag) return;
    mutate(
      { tagId: tag._id, data },
      {
        onSuccess: () => {
          setIsEditingTag(false);
          queryClient.invalidateQueries({ queryKey: ["tags"] });
          queryClient.invalidateQueries({ queryKey: ["tag", tag._id] });
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
    <Dialog open={isEditingTag} onOpenChange={setIsEditingTag} modal={true}>
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
              <div className="h-5  ">Edytuj tag: </div>
            ) : (
              `Edytuj produkt: ${tag.name} `
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
          <TagForm
            defaultValues={{
              name: tag && tag!.name,
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
