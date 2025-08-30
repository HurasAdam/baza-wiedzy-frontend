import { CalendarDays } from "lucide-react";
import type { Faq } from "../../types/faq";
import { formatDate } from "../../utils/format-date";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
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

  const backendBase = import.meta.env.VITE_BACKEND_BASE_URL ?? "http://localhost:5000";
  const avatarUrl = descriptionContent.createdBy?.profilePicture?.path
    ? `${backendBase}${descriptionContent.createdBy.profilePicture.path.replace(/^\/app/, "")}`
    : null;

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
          <div className="prose prose-sm dark:prose-invert text-muted-foreground max-w-none">
            {descriptionContent.description || "Brak opisu"}
          </div>
        </DialogHeader>

        <Separator className="my-3" />

        {/* --- Author --- */}
        <div className="flex items-center gap-3 px-1.5 pb-2 bg-muted/10 rounded-lg ">
          <Avatar className="w-20 h-20">
            <AvatarImage src={avatarUrl} alt="Avatar" crossOrigin="anonymous" />

            <AvatarFallback className="bg-muted text-foreground">{authorName || "U"}</AvatarFallback>
          </Avatar>
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
