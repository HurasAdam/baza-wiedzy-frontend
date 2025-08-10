import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface FaqItemDescriptionModalProps {
  isFaqItemDescriptionModalOpen: boolean;
  setIsFaqItemDescriptionModalOpen: (isOpen: boolean) => void;
  closeOnOutsideClick?: boolean;
  content: string;
  onClose?: () => void;
}

export const FaqItemDescriptionModal = ({
  isFaqItemDescriptionModalOpen,
  setIsFaqItemDescriptionModalOpen,
  closeOnOutsideClick,
  content,
  onClose,
}: FaqItemDescriptionModalProps) => {
  const handleOpenChange = (open: boolean) => {
    setIsFaqItemDescriptionModalOpen(open);
    if (!open && onClose) {
      setTimeout(() => {
        onClose();
      }, 300);
    }
  };

  return (
    <Dialog
      open={isFaqItemDescriptionModalOpen}
      onOpenChange={handleOpenChange}
      modal={true}
    >
      <DialogContent
        {...(!closeOnOutsideClick
          ? { onInteractOutside: (e) => e.preventDefault() }
          : {})}
        className="max-h-[80vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Szczegóły FAQ</DialogTitle>
          <DialogDescription>
            Tutaj znajdziesz pełny opis wybranej kategorii FAQ.
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};
