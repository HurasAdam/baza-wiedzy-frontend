import type { AxiosError } from "axios";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";
import queryClient from "../../config/query.client";
import { useCreateFaqItemMutaton } from "../../hooks/faq-item/use-faq-item";
import type { Faq } from "../../types/faq";
import { topicSchema } from "../../validation/topic.schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { FaqItemForm } from "./faq-item-form";

interface CreateWorkspaceProps {
  isCreatingFaqItem: boolean;
  setIsCreatingFaqItem: (isCreatingFaqItem: boolean) => void;
  closeOnOutsideClick?: boolean;
  faqs: Faq[];
  productId?: string;
}

// Define 8 predefined colors
export const colorOptions = [
  "#FF5733", // Red-Orange
  "#33C1FF", // Blue
  "#28A745", // Green
  "#FFC300", // Yellow
  "#8E44AD", // Purple
  "#E67E22", // Orange
  "#2ECC71", // Light Green
  "#34495E", // Navy
];

export type topicFormData = z.infer<typeof topicSchema>;

export const FaqItemModal = ({
  isCreatingFaqItem,
  setIsCreatingFaqItem,
  closeOnOutsideClick = false,
  faqs,
  productId,
}: CreateWorkspaceProps) => {
  const { mutate, isPending } = useCreateFaqItemMutaton();

  const onSubmit = (data: { question: string; answer: string; faqId: string }) => {
    mutate(data, {
      onSuccess: ({ faqId }) => {
        setIsCreatingFaqItem(false);
        toast.success("Zmiany zostały zapisane", {
          position: "bottom-right",
          description: "Pytanie zostało pomyślnie dodane i jest teraz widoczne w bazie FAQ.",
        });

        queryClient.invalidateQueries({ queryKey: ["faq", faqId] });
        return;
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
                <div style={{ fontWeight: 600, marginBottom: 2 }}>Błąd: pytanie już istnieje</div>
                <div style={{ opacity: 0.8 }}>
                  To pytanie zostało już dodane do wybranego FAQ. Prosimy o zmianę treści.
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
        toast.error("Wystapił błąd, spróbuj ponownie");
      },
    });
  };

  return (
    <Dialog open={isCreatingFaqItem} onOpenChange={setIsCreatingFaqItem} modal={true}>
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
              <PlusCircle className="h-8 w-8" />
            </div>

            {/* Tytuł i opis */}
            <div className="flex flex-col justify-center">
              <DialogTitle className="text-xl font-semibold text-foreground/90 tracking-tight">
                Dodaj nowe pytanie do FAQ
              </DialogTitle>
              <p className="text-[13px] text-muted-foreground">
                Wybierz FAQ oraz wprowadź treść pytania oraz odpowiedzi.
              </p>
            </div>
          </div>
        </DialogHeader>

        <FaqItemForm
          faqs={faqs}
          onSubmit={onSubmit}
          defaultValues={{ question: "", answer: "", faq: "" }}
          isSubmitting={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
