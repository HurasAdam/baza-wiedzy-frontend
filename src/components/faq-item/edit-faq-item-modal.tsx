import type { AxiosError } from "axios";
import { Edit3, Loader } from "lucide-react";
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
          toast.success("Zmiany zapisane", {
            position: "bottom-right",
            description: "Pytanie FAQ zostało pomyślnie zaktualizowane w systemie.",
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
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>Błąd: Duplikat pytania</div>
                  <div style={{ opacity: 0.8 }}>
                    To pytanie już istnieje w tym FAQ. Każde pytanie musi mieć unikalną treść.
                  </div>
                </div>
              </div>,
              { duration: 7000 }
            );
            return;
          } else if (status === 403) {
            toast.error("Brak wymaganych uprawnień do wykonania tej operacji.");
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
        className="
          w-[95vw] min-w-5xl
          min-h-[84vh]
          max-h-[84vh]
          p-6 sm:p-8
          rounded-xl
          shadow-xl
          bg-background/95
          backdrop-blur-sm
          border 
          overflow-y-auto
          scrollbar-custom
        "
      >
        <DialogHeader className="border-b border-muted/20 flex flex-col gap-2">
          <div className="flex items-center gap-4">
            {/* Ikona po lewej */}
            <div className="flex h-13 w-13 items-center justify-center rounded-md border bg-background text-foreground">
              <Edit3 className="h-8 w-8" />
            </div>

            {/* Tekst headera */}
            <div className="flex flex-col justify-center">
              <DialogTitle className="text-xl font-semibold text-foreground/90 tracking-tight">
                Edytuj pytanie FAQ
              </DialogTitle>
              <p className="text-[13px] text-muted-foreground">Edytuj treść pytania lub odpowiedzi.</p>
            </div>
          </div>
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
