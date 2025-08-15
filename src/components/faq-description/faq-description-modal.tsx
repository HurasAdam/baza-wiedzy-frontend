import { CalendarDays } from "lucide-react";
import type { Faq } from "../../types/faq";
import { formatDate } from "../../utils/format-date";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";

interface FaqItemDescriptionModalProps {
  isFaqItemDescriptionModalOpen: boolean;
  setIsFaqItemDescriptionModalOpen: (isOpen: boolean) => void;
  closeOnOutsideClick?: boolean;
  descriptionContent: Faq;
  onClose?: () => void;
}

export const FaqDescriptionModal = ({
  isFaqItemDescriptionModalOpen,
  setIsFaqItemDescriptionModalOpen,
  closeOnOutsideClick,
  descriptionContent,
  onClose,
}: FaqItemDescriptionModalProps) => {
  const handleOpenChange = (open: boolean) => {
    setIsFaqItemDescriptionModalOpen(open);
    if (!open && onClose) {
      setTimeout(() => onClose?.(), 300);
    }
  };

  if (!descriptionContent) return null;

  const authorName = `${descriptionContent.createdBy?.name || ""} ${
    descriptionContent.createdBy?.surname || ""
  }`.trim();
  const initials = authorName
    ? authorName
        .split(" ")
        .map((n) => n[0]?.toUpperCase())
        .join("")
    : "?";

  return (
    <Dialog open={isFaqItemDescriptionModalOpen} onOpenChange={handleOpenChange} modal={true}>
      <DialogContent
        {...(!closeOnOutsideClick ? { onInteractOutside: (e) => e.preventDefault() } : {})}
        className="max-h-[80vh] overflow-y-auto bg-background p-5 rounded-2xl shadow-md"
      >
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-bold tracking-tight flex flex-col gap-1">
            Szczegóły FAQ <span className=" text-sm text-muted-foreground">{descriptionContent.title}</span>
          </DialogTitle>

          {/* --- Description ---*/}
          <div className="text-sm font-medium text-muted-foreground mb-1">Opis</div>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {descriptionContent.description || "Brak opisu"}
          </div>
        </DialogHeader>

        <Separator className="my-3" />

        {/* --- Author --- */}
        <div className="flex items-center gap-3 px-1.5 pb-2 bg-muted/10 rounded-lg ">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm">{authorName || "Nieznany autor"}</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="w-3 h-3" />
              {formatDate(descriptionContent.createdAt, { weekday: true, hours: true })}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
