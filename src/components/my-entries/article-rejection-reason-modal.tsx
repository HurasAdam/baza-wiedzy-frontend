import { Info } from "lucide-react";
import type { Article } from "../../pages/my-entries/components/MyEntryCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface ArticleRejectionReasonModalProps {
  article: Article;
  open: boolean;
  closeOnOutsideClick?: boolean;
  setOpen: (isCreatingWorkspace: boolean) => void;
}

const ArticleRejectionReasonModal = ({
  article,
  open,
  setOpen,
  closeOnOutsideClick = false,
}: ArticleRejectionReasonModalProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        {...(!closeOnOutsideClick
          ? { onInteractOutside: (e) => e.preventDefault() }
          : {})}
        className="max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="flex gap-1.5">
            {" "}
            <Info className="w-5 h-5 text-muted-foreground " />
            Powód odrzucenia
          </DialogTitle>
          <DialogDescription>
            Artykuł został odrzucony przez moderatora. Poniżej znajdziesz
            uzasadnienie.
          </DialogDescription>
        </DialogHeader>
        <div className="text-sm text-foreground whitespace-pre-wrap break-all">
          {article && article.rejectionReason}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleRejectionReasonModal;
