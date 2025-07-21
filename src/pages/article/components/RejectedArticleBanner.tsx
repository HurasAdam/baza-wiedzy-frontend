import { XCircleIcon } from "lucide-react";
import { useState } from "react";

import ArticleRejectionReasonModal from "../../../components/my-entries/article-rejection-reason-modal";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import type { Article } from "../../my-entries/components/MyEntryCard";

interface RejectedArticleBannerProps {
  article: Article;
}

export const RejectedArticleBanner: React.FC<RejectedArticleBannerProps> = ({
  article,
}) => {
  const [isRejectionReasonAlertOpen, setIsRejectionReasonAlertOpen] =
    useState<boolean>(false);

  const onRejectionModalOpen = () => {
    setIsRejectionReasonAlertOpen(true);
  };
  const onRejectonModalClose = () => {
    setIsRejectionReasonAlertOpen(false);
  };

  return (
    <>
      <Card className="mb-6 border bg-destructive/10 border-destructive/30">
        <CardContent className="p-4 sm:p-5 grid grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-6">
          <div className="flex items-center justify-center">
            <XCircleIcon className="w-6 h-6 text-red-700" />
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-semibold text-foreground">
              Artykuł został odrzucony
            </h2>
            <p className="text-sm text-foreground">
              Artykuł został odrzucony przez moderatora. Zapoznaj się z uwagami
              i wprowadź poprawki przed ponownym zgłoszeniem.
            </p>
            {article && article.rejectionReason && (
              <Button
                onClick={onRejectionModalOpen}
                size="sm"
                className="text-foreground cursor-pointer"
                variant="link"
              >
                Pokaż więcej...
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      {article && article.rejectionReason && (
        <ArticleRejectionReasonModal
          article={article}
          open={isRejectionReasonAlertOpen}
          setOpen={onRejectonModalClose}
        />
      )}
    </>
  );
};
