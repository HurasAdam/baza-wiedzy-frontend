import type { AxiosError } from "axios";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";
import queryClient from "../../config/query.client";
import { useFindFaqItemQuery, useUpdateFaqItemMutaton } from "../../hooks/faq-item/use-faq-item";
import type { Faq } from "../../types/faq";
import type { faqItemSchema } from "../../validation/faq-item.schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { FaqItemForm } from "./faq-item-form";

interface CreateWorkspaceProps {
  faqs: Faq[];
  faqItemId: string;
  isEditingFaqItem: boolean;
  setIsEditingFaqItem: (isEditingFaqItem: boolean) => void;
  closeOnOutsideClick?: boolean;
}

export type FaqItemFormData = z.infer<typeof faqItemSchema>;

export const EditFaqItemModal = ({
  faqs,
  faqItemId,
  isEditingFaqItem,
  setIsEditingFaqItem,
  closeOnOutsideClick,
}: CreateWorkspaceProps) => {
  const { data: faqItem, isLoading: isProductLoading } = useFindFaqItemQuery(faqItemId);
  const { mutate, isPending } = useUpdateFaqItemMutaton();

  const onSubmit = (data: { faqId: string; answer: string; question: string }) => {
    if (!faqItem) return;
    mutate(
      { faqItemId, ...data },
      {
        onSuccess: () => {
          setIsEditingFaqItem(false);
          queryClient.invalidateQueries({ queryKey: ["faq", faqItem.faqId] });
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
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>Błąd: Duplikat pytania</div>
                  <div style={{ opacity: 0.8 }}>
                    To pytanie już istnieje w tym FAQ. Każde pytanie musi mieć unikalną treść.
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
    <Dialog open={isEditingFaqItem} onOpenChange={setIsEditingFaqItem} modal={true}>
      <DialogContent
        {...(!closeOnOutsideClick ? { onInteractOutside: (e) => e.preventDefault() } : {})}
        className="max-h-[80vh]  overflow-y-auto min-w-[33vw] "
      >
        <DialogHeader>
          <DialogTitle>
            {" "}
            {isProductLoading ? (
              <div className="h-5  ">Edytuj pytanie: </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <span>Edytuj pytanie:</span> <span className="text-sm">{faqItem?.question}</span>{" "}
              </div>
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
          <FaqItemForm
            faqs={faqs}
            faqId={faqItem && faqItem.faqId}
            defaultValues={{
              question: faqItem?.question ?? "",
              answer: faqItem?.answer ?? "",
              faq: "",
            }}
            onSubmit={onSubmit}
            isSubmitting={isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
