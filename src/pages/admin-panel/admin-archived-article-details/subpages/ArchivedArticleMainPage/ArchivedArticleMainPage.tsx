import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { ArticleExtraInfoModal } from "../../../../../components/article/article-extra-info.modal";
import { Alert } from "../../../../../components/shared/alert-modal";
import queryClient from "../../../../../config/query.client";
import {
  useArchivizeArticleMutation,
  useFollowArticleMutation,
  useMarkAsImportantMutation,
  useRestoreArticleMutation,
  useUnfollowArticleMutation,
  useUnmarkAsImportantMutation,
} from "../../../../../hooks/articles/use-articles";
import type { ArticleOutletContext } from "../../../../article/ArticleMainPage";
import { ArchivedArticleContent } from "./components/ArchivedArticleContent";
import { ArchivedArticleHeader } from "./components/ArchivedArticleHeader";
import { BannerSection } from "./components/BannerSection";

export const ArchivedArticleMainPage = () => {
  const { article, articleUserFlag, userPermissions, refetch } = useOutletContext<ArticleOutletContext>();
  const navigate = useNavigate();

  // ----- MODALS AND ALERTS -----
  const [isExtraInforModalOpen, setIsExtraInfoModalOpen] = useState(false);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [isCreateFlagModalOpen, setIsCreateFlagModalOpen] = useState(false);
  const [isRestoringArticle, setIsRestoringArticle] = useState(false);
  const [isRejectingArticle, setIsRejectingArticle] = useState(false);
  const [isDeletingArticle, setIsDeletingArticle] = useState(false);

  // ------ MUTATIONS ------

  const { mutate: followArticleMutate, isPending: isFollowPending } = useFollowArticleMutation();
  const { mutate: unfollowArticleMutate, isPending: isUnfollowPending } = useUnfollowArticleMutation();
  const { mutate: markAsImportantMutate, isPending: isMarkAsImportantLoading } = useMarkAsImportantMutation();
  const { mutate: unmarkAsImportantMutate, isPending: isUnmarkAsImportantLoading } = useUnmarkAsImportantMutation();

  const { mutate: archivizeMutate } = useArchivizeArticleMutation();
  const { mutate: restoreMutate, isPending: isRestoreLoading } = useRestoreArticleMutation();

  // ----- ACTION HANDLERS -----
  const openExtraInfoModal = () => setIsExtraInfoModalOpen(true);

  const handleArchivize = (articleId: string) => {
    archivizeMutate(articleId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["articles"] });
        toast.success("Artykuł został przeniesiony do archizum", {
          position: "bottom-right",
        });
        navigate("/articles");
      },
    });
  };

  const onRestoreRequest = (): void => {
    setIsRestoringArticle(true);
  };

  const onRestoreCancel = () => {
    setIsRestoringArticle(false);
  };

  const onDeleteRequest = (): void => {
    setIsDeletingArticle(true);
  };

  const onDeleteCancel = () => {
    setIsDeletingArticle(false);
  };

  const onRestoreConfirm = async () => {
    restoreMutate(article._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["archived-articles"] });
        onRestoreCancel();
        toast.success("Zmiany zostały zatwierdzone", {
          position: "bottom-right",
          description: "Artykuł został przywrócny",
        });
        navigate("/admin/articles/archived");
      },
    });
  };

  const onDeleteConfirm = (): void => {
    if (!article) return;
    setIsDeletingArticle(false);
    toast.info("Brak funkcjonalności", {
      position: "bottom-right",
      duration: 6400,
      description:
        "Usuwanie artykułów nie zostało jeszcze zaimplementowane. Funkcjonalność ta pojawi się w kolejnych aktualizacjach aplikacji...",
    });
  };

  return (
    <div className="mx-auto h-full">
      <ArchivedArticleHeader
        article={article}
        userPermissions={userPermissions}
        actions={{
          openExtraInfoModal,
          handleArchivize,
          refetch,
        }}
      />

      <BannerSection
        articleData={{
          status: article.status,
          isVisible: article.isVisible,
          rejectionNote: article.rejectionNote,
          isArchived: article.isTrashed,
        }}
        userPermissions={userPermissions}
        actions={{
          RESTORE_ARTICLE: onRestoreRequest,
        }}
      />

      <ArchivedArticleContent
        article={article}
        articleUserFlag={articleUserFlag}
        isFollowPending={isFollowPending}
        isUnfollowPending={isUnfollowPending}
        userPermissions={userPermissions}
        isMarkAsImportantLoading={isMarkAsImportantLoading || isUnmarkAsImportantLoading}
        actions={{
          onRestoreRequest,
          onDeleteRequest,
        }}
      />

      {isExtraInforModalOpen && (
        <ArticleExtraInfoModal isOpen={isExtraInforModalOpen} article={article} setIsOpen={setIsExtraInfoModalOpen} />
      )}

      <Alert
        isOpen={isRestoringArticle}
        isLoading={isRestoreLoading}
        type="info"
        title="Przywrócić artykuł z archiwum?"
        onCancel={onRestoreCancel}
        onConfirm={onRestoreConfirm}
        requireConfirmation={true}
        isConfirmEnabled={true}
      >
        <div className="flex flex-col gap-2">
          <span className="font-medium">Czy na pewno chcesz przywrócić ten artykuł z archiwum?</span>

          <span className="text-sm text-muted-foreground">
            Po przywróceniu artykuł ponownie stanie się widoczny w wyszukiwarce i będzie dostępny dla użytkowników
            końcowych.
          </span>
        </div>
      </Alert>

      <Alert
        isOpen={isDeletingArticle}
        isLoading={false}
        type="warning"
        title="Trwałe usunięcie artykułu"
        onCancel={onDeleteCancel}
        onConfirm={onDeleteConfirm}
        requireConfirmation={true}
        isConfirmEnabled={true}
      >
        <div className="flex flex-col gap-2">
          <span className="font-medium">Czy na pewno chcesz trwale usunąć ten artykuł?</span>

          <span className="text-sm text-muted-foreground">
            Artykuł zostanie całkowicie usunięty z systemu i nie będzie możliwości jego przywrócenia.
          </span>
        </div>
      </Alert>
    </div>
  );
};
