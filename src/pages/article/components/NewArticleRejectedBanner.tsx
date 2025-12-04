import { CheckCircleIcon, Loader, XCircleIcon } from "lucide-react";
import { useState } from "react";

import ArticleRejectionReasonModal from "../../../components/my-entries/article-rejection-reason-modal";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import type { Article } from "../../my-entries/components/MyEntryCard";

interface NewArticleRejectedBannerProps {
  article: Article;
  onResubmit: () => void;
  isResubmitting: boolean;
  currentUserPermissions?: string[];
}

export const NewArticleRejectedBanner = ({
  article,
  onResubmit,
  isResubmitting,
  currentUserPermissions = [],
}: NewArticleRejectedBannerProps) => {
  const [isRejectionReasonModalOpen, setIsRejectionReasonModalOpen] = useState(false);

  const openModal = () => setIsRejectionReasonModalOpen(true);
  const closeModal = () => setIsRejectionReasonModalOpen(false);

  const canViewRejectionNote =
    !!article.rejectionNote ||
    currentUserPermissions.includes("VERIFY_ARTICLE") ||
    currentUserPermissions.includes("APPROVE_ARTICLE");

  const bannerTitle = "Artykuł wymaga poprawy";
  const bannerMessage = "Ten artykuł został odrzucony i wymaga poprawy.";

  return (
    <>
      <Card className="mb-6 border shadow-sm rounded-2xl bg-destructive/10 border-destructive/30">
        <CardContent className="p-5 flex items-center gap-5">
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-destructive/20">
            <XCircleIcon className="w-6 h-6 text-destructive" />
          </div>

          <div className="flex-1 space-y-1">
            <h2 className="text-base font-semibold text-foreground leading-snug">{bannerTitle}</h2>
            <p className="text-sm text-foreground/80 leading-relaxed">{bannerMessage}</p>

            {canViewRejectionNote && article.rejectionNote?.text && (
              <Button onClick={openModal} size="sm" className="text-foreground cursor-pointer" variant="link">
                Pokaż więcej...
              </Button>
            )}
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <Button onClick={onResubmit} size="sm" variant="default" className="flex items-center gap-1">
              {isResubmitting ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircleIcon className="w-4 h-4" />}
              Zgłoś do weryfikacji
            </Button>
          </div>
        </CardContent>
      </Card>

      {canViewRejectionNote && article.rejectionNote?.text && (
        <ArticleRejectionReasonModal article={article} open={isRejectionReasonModalOpen} setOpen={closeModal} />
      )}
    </>
  );
};
