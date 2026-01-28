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

  if (!articleData.rejectionNote) return null;

  return (
    <div className="mb-6 relative overflow-hidden rounded-xl border border-border bg-background px-6 py-4 shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-muted-foreground/30 via-muted-foreground/10 to-transparent" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border bg-muted/40">
            <XCircleIcon className="h-5 w-5 text-rose-500" />
          </div>

          <div className="flex flex-col leading-tight space-y-1">
            <p className="text-sm font-semibold text-foreground">Artykuł odrzucony - wymaga poprawek</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              Poniżej znajdziesz uwagi i kwestie wymagające zmian
              <button
                onClick={() => setIsRejectionReasonModalOpen(true)}
                className="text-xs text-foreground underline hover:text-primary hover:underline ml-1"
              >
                Zobacz uwagi
              </button>
            </p>
          </div>
        </div>

        {/* Action */}
        <div className="flex gap-2 mt-2 sm:mt-0">
          <Button size="sm" className="h-8 px-3 text-xs font-medium" onClick={actions.REQUEST_ARTICLE_REVIEW}>
            Wyślij do ponownej weryfikacji
          </Button>
        </div>
      </div>

      <ArticleRejectionReasonModal
        article={articleData}
        open={isRejectionReasonModalOpen}
        setOpen={setIsRejectionReasonModalOpen}
      />
    </div>
  );
};
