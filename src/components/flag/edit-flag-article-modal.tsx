import { Flag } from "lucide-react";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import { useUpdateArticleUserFlagMutation } from "../../hooks/article-user-flag/use-article-user-flag";
import { useFindMyFlags } from "../../hooks/flag/user-flag";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import FlagArticleForm from "./flag-article-form";

export interface FlaggedArticleForModal {
  _id: string;
  title: string;
  status: string;
  rejectionReason: string | null;
  createdBy: { _id: string; name: string; surname: string };
  viewsCounter: number;
  isTrashed: boolean;
  product: { _id: string; name: string; labelColor: string; banner: string };
  category: { _id: string; name: string };
  createdAt: string;
  flag: { _id: string; name: string; color: string };
  isFlagged: boolean;
  responseVariantsCount: number;
  selectedFlag?: { _id: string; name: string; color: string } | null;
}

interface EditFlagArticleModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  article: FlaggedArticleForModal;
  articleUserFlag?: { selectedFlag: { _id: string; name: string; color: string } | null };
}

export const EditFlagArticleModal = ({ isOpen, setIsOpen, article, articleUserFlag }: EditFlagArticleModalProps) => {
  const { data: flags = [], isLoading: isFlagListLoading } = useFindMyFlags(isOpen);

  const { mutate: changeFlagMutate, isPending: isMutateLoading } = useUpdateArticleUserFlagMutation();

  const onSubmit = (data: { flagId?: string }) => {
    if (!data.flagId) return;

    changeFlagMutate(
      { articleId: article._id, flagId: data.flagId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["my-flagged-articles"] });
          setIsOpen(false);
          toast.success("Zmiany zostały zapisane", {
            position: "bottom-right",
            description: "Etykieta została zaktualizowana",
          });
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogContent className="lg:w-[460px] min-w-lg max-w-[95vw] min-h-[74vh] max-h-[74vh] p-0 bg-background/95 backdrop-blur-xl rounded-2xl shadow-xl border border-border/30  flex flex-col">
        {/* Główek */}
        <DialogHeader className="px-6 pt-6 pb-3 border-b border-border/20 bg-gradient-to-r from-background/80 to-muted/40 flex items-center gap-2">
          <DialogTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Flag className="w-5 h-5 text-primary" />
            Zmień etykietę
          </DialogTitle>
        </DialogHeader>

        <FlagArticleForm
          articleUserFlag={articleUserFlag}
          onSubmit={onSubmit}
          isFlagListLoading={isFlagListLoading}
          flags={flags}
          isSaving={isMutateLoading}
          setIsOpen={setIsOpen}
        />
      </DialogContent>
    </Dialog>
  );
};
