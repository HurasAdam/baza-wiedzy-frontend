/**
 * Banner dla statusu `Rejected` .
 * Wyświetlany, gdy artykuł został odrzucony i wymaga wprowadzenia zmian w treści .
 * Zawiera przyciski wysłania do ponownej weryfikacji,
 *
 * @param userPermissions - Lista uprawnień użytkownika.
 * @param actions - Obiekt zawierający funkcje do obsługi akcji:
 *   - `REQUEST_ARTICLE_REVIEW` – prośba o ponową weryfikację poprawności treści artykułu,
 */

import { XCircleIcon } from "lucide-react";
import { useState } from "react";
import ArticleRejectionReasonModal from "../../../../components/my-entries/article-rejection-reason-modal";
import { Button } from "../../../../components/ui/button";
import type { ArticleData } from "./ArticleStatusBannerSection";

interface RejectedBannerActions {
  REQUEST_ARTICLE_REVIEW: () => void;
}

interface Props {
  userPermissions: string[];
  actions: RejectedBannerActions;
  articleData: ArticleData;
}

export const RejectedBanner = ({ userPermissions, actions, articleData }: Props) => {
  const [isRejectionReasonModalOpen, setIsRejectionReasonModalOpen] = useState(false);

  if (!articleData.rejectionNote) return false;

  return (
    <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg bg-muted/30 px-5 py-3 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-9 h-9 rounded-md bg-background border shadow-sm">
          <XCircleIcon className="w-4 h-4 text-rose-500" />
        </div>
        <div className="flex flex-col leading-tight space-y-0.5">
          <p className="text-sm font-medium text-foreground">Artykuł odrzucony – wymaga poprawek</p>

          <p className="text-xs text-muted-foreground flex items-center gap-2">
            Poniżej znajdziesz uwagi i kwestie wymagające zmian
            <button
              onClick={() => setIsRejectionReasonModalOpen(true)}
              className="flex items-center text-xs text-foreground underline hover:text-primary hover:underline ml-1 "
            >
              Zobacz uwagi
            </button>
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-2 sm:mt-0">
        {userPermissions.includes("APPROVE_ARTICLE") && (
          <Button onClick={() => actions.REQUEST_ARTICLE_REVIEW()} size="sm">
            Wyślij do ponownej weryfikacji
          </Button>
        )}
      </div>

      <ArticleRejectionReasonModal
        article={articleData}
        open={isRejectionReasonModalOpen}
        setOpen={setIsRejectionReasonModalOpen}
      />
    </div>
  );
};
