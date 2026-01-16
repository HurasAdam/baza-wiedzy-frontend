import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { ArticleExtraInfoModal } from "../../../components/article/article-extra-info.modal";
import { FlagModal, type FlagForm } from "../../../components/flag/flag-modal";
import { MarkWithFlagArticleModal } from "../../../components/flag/mark-with-flag-article-modal";
import { ArticleChangesRejectionModal } from "../../../components/pending-articles/article-changes-rejection-modal";
import { Alert } from "../../../components/shared/alert-modal";
import queryClient from "../../../config/query.client";
import {
  useCreateArticleUserFlagMutation,
  useUnflagArticleUserFlagMutation,
} from "../../../hooks/article-user-flag/use-article-user-flag";
import {
  useAproveArticleMutation,
  useFollowArticleMutation,
  useMarkAsImportantMutation,
  useRejectArticleMutation,
  useRequestReviewArticleMutation,
  useUnfollowArticleMutation,
  useUnmarkAsImportantMutation,
} from "../../../hooks/articles/use-articles";
import { useCreateFlagMutation } from "../../../hooks/flag/user-flag";
import type { ArticleOutletContext } from "../../article/ArticleMainPage";
import { ArticleContent } from "./components/ArticleContent";
import { ArticleMainPageHeader } from "./components/ArticleMainPageHeader";
import { ArticleStatusBannerSection } from "./components/ArticleStatusBannerSection";

export const Articlev2MainPage = () => {
  const { article, articleUserFlag, userPermissions, refetch } = useOutletContext<ArticleOutletContext>();

  // ----- MODALS AND ALERTS -----
  const [isExtraInforModalOpen, setIsExtraInfoModalOpen] = useState(false);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [isCreateFlagModalOpen, setIsCreateFlagModalOpen] = useState(false);
  const [isApprovingArticle, setIsApprovingArticle] = useState(false);
  const [isRejectingArticle, setIsRejectingArticle] = useState(false);
  const [isRequestingArticleReview, setIsRequestingArticleReview] = useState(false);

  // ------ MUTATIONS ------
  const { mutate: createFlagMutate, isPending: isCreateFlagPending } = useCreateFlagMutation();
  const { mutate: flagArticleMutate, isPending: isFlagingArticlePending } = useCreateArticleUserFlagMutation();
  const { mutate: unflagMutate } = useUnflagArticleUserFlagMutation();
  const { mutate: followArticleMutate, isPending: isFollowPending } = useFollowArticleMutation();
  const { mutate: unfollowArticleMutate, isPending: isUnfollowPending } = useUnfollowArticleMutation();
  const { mutate: markAsImportantMutate, isPending: isMarkAsImportantLoading } = useMarkAsImportantMutation();
  const { mutate: unmarkAsImportantMutate, isPending: isUnmarkAsImportantLoading } = useUnmarkAsImportantMutation();
  const { mutate: approveMutate, isPending: isApproveLoading } = useAproveArticleMutation();
  const { mutate: rejectionMutate, isPending: isRejectionLoading } = useRejectArticleMutation();
  const { mutate: requestReviewMutate, isPending: isRequestReviewLoading } = useRequestReviewArticleMutation();

  // ----- ACTION HANDLERS -----
  const openExtraInfoModal = () => setIsExtraInfoModalOpen(true);
  const openAddFlagModal = () => {
    setIsCreateFlagModalOpen(true);
  };
  const openMarkWithFlagModal = () => setIsFlagModalOpen(true);

  const onHandleCreateFlag = (data: FlagForm) => {
    createFlagMutate(data, {
      onSuccess: () => {
        toast.success("Zapisano zmian", { position: "bottom-right", description: "Dodano nową flagę" });
        setIsCreateFlagModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["my-flags"] });
      },
    });
  };

  const onHandleFlagArticle = (payload) => {
    flagArticleMutate(payload, {
      onSuccess: () => {
        toast.success("Zmiany zostały zapisane", {
          position: "bottom-right",
          description: "Artykuł został oznaczny flagą",
        });
        setIsFlagModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["article-user-flag", article._id] });
      },
    });
  };

  const onHandleUnflag = (articleId: string): void => {
    if (!article) return;
    unflagMutate(articleId, {
      onSuccess: () => {
        toast.success("Oznaczenie artykułu zostało usunięte", {
          position: "bottom-right",
          description: "Artykuł nie jest już oznaczony flagą.",
          duration: 4000,
        });
        queryClient.invalidateQueries({ queryKey: ["article-user-flag", article._id] });
      },
    });
  };

  const handleFollowToggle = (articleId: string, isFollowed: boolean) => {
    if (isFollowed) {
      unfollowArticleMutate(articleId, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["article", articleId] });
          toast.success("Artykuł został usunięty z listy obserwowanych", { position: "bottom-right" });
        },
      });
    } else {
      followArticleMutate(articleId, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["article", articleId] });
          toast.success("Artykuł został dodany do listy obserwowanych", { position: "bottom-right" });
        },
      });
    }
  };

  const handleMarkAsImportant = (articleId: string) => {
    markAsImportantMutate(articleId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["article", articleId] });
        toast.success("Artykuł oznaczono jako ważny", { position: "bottom-right" });
      },
    });
  };
  const handleUnmarkAsImportant = (articleId: string) => {
    unmarkAsImportantMutate(articleId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["article", articleId] });
        toast.success("Oznaczenie ważności zostało usunięte", { position: "bottom-right" });
      },
    });
  };

  const onApprove = (): void => {
    setIsApprovingArticle(true);
  };

  const onApproveConfirm = (): void => {
    if (!article) return;
    approveMutate(article._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["article", article._id] });
        toast.success("Artykuł został zatwierdzony.");
      },
      onError: (error: any) => {
        const status = error?.status;
        if (status === 403) toast.warning("Brak wymaganych uprawnień do wykonania tej operacji.");
        else toast.error("Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.");
      },
      onSettled: () => setIsApprovingArticle(false),
    });
  };

  const onApproveCancel = (): void => {
    setIsApprovingArticle(false);
  };

  const onReject = (): void => {
    setIsRejectingArticle(true);
  };

  const onRejectCancel = (): void => {
    setIsRejectingArticle(false);
  };

  const oneRejectConfirm = ({ rejectionReason }: { rejectionReason: string }) => {
    if (!article) return setIsRejectingArticle(false);

    rejectionMutate(
      { articleId: article._id, rejectionReason },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["articles"] });
          queryClient.invalidateQueries({ queryKey: ["article", article._id] });
          toast.success("Artykuł został odrzucony, uwagi zostały wysłane do autora artykułu");
        },
        onError: (error: any) => {
          const status = error?.status;
          if (status === 403) toast.warning("Brak wymaganych uprawnień do wykonania tej operacji.");
          else toast.error("Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.");
        },
        onSettled: () => setIsRejectingArticle(false),
      }
    );
  };

  const onRequestReview = (): void => {
    setIsRequestingArticleReview(true);
  };

  const onRequestReviewCancel = (): void => {
    setIsRequestingArticleReview(false);
  };

  const onReviewRequestConfirm = () => {
    if (!article) return;
    requestReviewMutate(article._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["article", article._id] });
        toast.info("Artykuł został zgłoszony do ponownej weryfikacji.", {
          position: "bottom-right",
        });
        setIsRequestingArticleReview(false);
      },
    });
  };

  return (
    <div className="mx-auto h-full">
      {/* Header */}

      <ArticleMainPageHeader
        article={article}
        userPermissions={userPermissions}
        actions={{
          handleFollowToggle,
          openExtraInfoModal,
          handleUnmarkAsImportant,
          handleMarkAsImportant,
          refetch,
        }}
      />

      <ArticleStatusBannerSection
        articleData={{
          status: article.status,
          isVisible: article.isVisible,
          rejectionNote: article.rejectionNote,
        }}
        userPermissions={userPermissions}
        actions={{
          APPROVE_ARTICLE: onApprove,
          REJECT_ARTICLE: onReject,
          REQUEST_ARTICLE_REVIEW: onRequestReview,
        }}
      />

      {/* Content */}

      <ArticleContent
        article={article}
        articleUserFlag={articleUserFlag}
        isFollowPending={isFollowPending}
        isUnfollowPending={isUnfollowPending}
        userPermissions={userPermissions}
        isMarkAsImportantLoading={isMarkAsImportantLoading || isUnmarkAsImportantLoading}
        actions={{
          handleFollowToggle,
          onHandleUnflag,
          openMarkWithFlagModal,
          handleMarkAsImportant,
          handleUnmarkAsImportant,
          openAddFlagModal,
        }}
      />

      {isExtraInforModalOpen && (
        <ArticleExtraInfoModal isOpen={isExtraInforModalOpen} article={article} setIsOpen={setIsExtraInfoModalOpen} />
      )}
      <MarkWithFlagArticleModal
        key={article._id + (article.selectedFlag?._id || "no-flag")}
        article={article}
        articleUserFlag={articleUserFlag}
        onSave={onHandleFlagArticle}
        isOpen={isFlagModalOpen}
        setIsOpen={setIsFlagModalOpen}
        isLoading={isFlagingArticlePending}
      />
      <FlagModal
        isLoading={isCreateFlagPending}
        onSave={onHandleCreateFlag}
        isOpen={isCreateFlagModalOpen}
        setIsOpen={setIsCreateFlagModalOpen}
      />

      <Alert
        isOpen={isApprovingArticle}
        isLoading={isApproveLoading}
        type="info"
        title={
          article.status === "draft" && !article.isVisible
            ? "Zatwierdź artykuł"
            : article.status === "draft" && article.isVisible
            ? "Zatwierdź zmiany w artykule"
            : article.status === "pending" && article.isVisible
            ? "Potwierdź aktualność artykułu"
            : "Zatwierdź artykuł"
        }
        onCancel={onApproveCancel}
        onConfirm={onApproveConfirm}
      >
        {article.status === "draft" && article.isVisible ? (
          // CASE B – edycja
          <div className="flex flex-col gap-2">
            <span className="font-medium">Czy na pewno chcesz zatwierdzić wprowadzone zmiany?</span>
            <span className="text-sm text-muted-foreground">
              Potwierdzasz, że aktualna treść artykułu jest poprawna merytorycznie i nie wymaga dalszych poprawek.
            </span>
          </div>
        ) : article.status === "pending" && article.isVisible ? (
          // CASE C – wygasły artykuł
          <div className="flex flex-col gap-2">
            <span className="font-medium">Czy na pewno chcesz potwierdzić aktualność tego artykułu?</span>
            <span className="text-sm text-muted-foreground">
              Potwierdzasz, że treść artykułu pozostaje poprawna merytorycznie i nie wymaga aktualizacji.
            </span>
          </div>
        ) : (
          // CASE A – pierwsza weryfikacja
          <div className="flex flex-col gap-2">
            <span className="font-medium">Czy na pewno chcesz zatwierdzić ten artykuł?</span>
            <span className="text-sm text-muted-foreground">
              Po potwierdzeniu artykuł zostanie oznaczony jako zweryfikowany i stanie się dostępny dla wszystkich
              użytkowników.
            </span>
          </div>
        )}
      </Alert>
      {/* Request another review Alert */}
      <Alert
        isOpen={isRequestingArticleReview}
        isLoading={isRequestReviewLoading}
        type="info"
        title="Wyślij do ponownej weryfikacji"
        onCancel={onRequestReviewCancel}
        onConfirm={onReviewRequestConfirm}
      >
        <div className="flex flex-col gap-2">
          <span className="font-medium">Czy na pewno chcesz wysłać artykuł do ponownej weryfikacji?</span>
          <span className="text-sm text-muted-foreground">
            Potwierdzasz, że wprowadzone zmiany są gotowe do ponownej oceny.
          </span>
        </div>
      </Alert>

      <ArticleChangesRejectionModal
        onSubmit={oneRejectConfirm}
        isCreatingArticleRejection={isRejectingArticle}
        setIsCreatingArticleRejection={setIsRejectingArticle}
        isPending={isRejectionLoading}
      />
    </div>
  );
};
