import { CheckCircleIcon, Loader, XCircleIcon } from "lucide-react";
import { useState } from "react";

import ArticleRejectionReasonModal from "../../../components/my-entries/article-rejection-reason-modal";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import type { Article } from "../../my-entries/components/MyEntryCard";

interface RejectedArticleBannerProps {
  article: Article;
  onResubmit: () => void;
  isResubmitting: boolean;
  currentUserPermissions?: string[]; // przekazujemy uprawnienia zalogowanego użytkownika
}

export const RejectedArticleBanner: React.FC<RejectedArticleBannerProps> = ({
  article,
  onResubmit,
  isResubmitting,
  currentUserPermissions = [],
}) => {
  const [isRejectionReasonModalOpen, setIsRejectionReasonModalOpen] = useState(false);

  const openModal = () => setIsRejectionReasonModalOpen(true);
  const closeModal = () => setIsRejectionReasonModalOpen(false);

  // Sprawdzenie, czy użytkownik ma prawo widzieć rejectionNote
  const canViewRejectionNote =
    !!article.rejectionNote ||
    currentUserPermissions.includes("VERIFY_ARTICLE") ||
    currentUserPermissions.includes("APPROVE_ARTICLE");

  // Komunikat zależny od uprawnień
  const bannerMessage = canViewRejectionNote
    ? "Artykuł został odrzucony. Zapoznaj się z uwagami i wprowadź zmiany przed ponownym zgłoszeniem."
    : "Artykuł został odrzucony i wymaga poprawek.";

  return (
    <>
      <Card className="mb-6 border bg-destructive/10 border-destructive/30">
        <CardContent className="p-4 sm:p-5 grid grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-6">
          <div className="flex items-center justify-center">
            <XCircleIcon className="w-6 h-6 text-red-700" />
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-semibold text-foreground">Artykuł został odrzucony</h2>
            <p className="text-sm text-foreground">{bannerMessage}</p>

            {/* Przycisk pokazujący szczegóły tylko dla uprawnionych */}
            {canViewRejectionNote && article.rejectionNote?.text && (
              <Button onClick={openModal} size="sm" className="text-foreground cursor-pointer" variant="link">
                Pokaż więcej...
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={onResubmit} size="sm" variant="default">
              {isResubmitting ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircleIcon className="w-4 h-4" />}
              Zgłoś do weryfikacji
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal tylko dla uprawnionych */}
      {canViewRejectionNote && article.rejectionNote?.text && (
        <ArticleRejectionReasonModal article={article} open={isRejectionReasonModalOpen} setOpen={closeModal} />
      )}
    </>
  );
};
