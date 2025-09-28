import type { AxiosError } from "axios";
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
        toast.success("Pytanie zostało dodane");

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
        className="max-h-[80vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Dodaj nowe pytanie</DialogTitle>
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
