import { Flag } from "lucide-react";
import { useFindMyFlags } from "../../hooks/flag/user-flag";
import type { Article } from "../../types/article";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import FlagArticleForm from "./flag-article-form";

interface MarkWithFlagArticleModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  article: Article;
  articleUserFlag?: { selectedFlag: { _id: string; name: string; color: string } | null };
  onSave: (data: { flagId?: string; articleId: string }) => void;
  isLoading: boolean;
}

export const MarkWithFlagArticleModal = ({
  isOpen,
  setIsOpen,
  article,
  articleUserFlag,
  onSave,
  isLoading,
}: MarkWithFlagArticleModalProps) => {
  const { data: flags = [], isLoading: isFlagListLoading } = useFindMyFlags(isOpen);

  const onSubmit = (data: { flagId?: string }) => {
    onSave({ ...data, articleId: article._id });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogContent className="w-[460px] min-w-lg max-w-[95vw] min-h-[74vh] max-h-[74vh] p-0 bg-background/95 backdrop-blur-xl rounded-2xl shadow-xl border border-border/30  flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-3 border-b border-border/20 bg-gradient-to-r from-background/80 to-muted/40 flex items-center gap-2">
          <DialogTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Flag className="w-5 h-5 text-primary" />
            Wybierz etykiete i oznacz artykuł
          </DialogTitle>
        </DialogHeader>

        <FlagArticleForm
          articleUserFlag={articleUserFlag}
          onSubmit={onSubmit}
          isFlagListLoading={isFlagListLoading}
          flags={flags}
          isSaving={isLoading}
          setIsOpen={setIsOpen}
        />
      </DialogContent>
    </Dialog>
  );
};
