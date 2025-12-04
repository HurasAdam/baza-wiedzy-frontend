import { useState } from "react";
import { toast } from "sonner";
import queryClient from "../../../config/query.client";
import {
  useAproveArticleMutation,
  useRejectArticleChangesMutation,
  useRejectArticleMutation,
  useRequestReviewArticleMutation,
  useVerifyArticleMutation,
} from "../../../hooks/articles/use-articles";

import { ArticleChangesRejectionModal } from "../../../components/pending-articles/article-changes-rejection-modal";
import { PendingArticleRejectionModal } from "../../../components/pending-articles/pending-article-rejection-modal";
import { Alert } from "../../../components/shared/alert-modal";
import { ArticleDraftVisibleBanner } from "./ArticleDraftVisibleBanner";
import { ArticleVerificationBanner } from "./ArticleVerificationBanner";
import { NewArticleBanner } from "./NewArticleBanner";
import { NewArticleRejectedBanner } from "./NewArticleRejectedBanner";

const ArticleBannerSection = ({ article, userPermissions }) => {
  const articleStatus = article.status;
  const isVisible = article.isVisible;

  const [isCreatingArticleApprove, setIsCreatingArticleApprove] = useState(false);
  const [isCreatingArticleVerify, setIsCreatingArticleVerify] = useState(false);
  const [isCreatingArticleRejection, setIsCreatingArticleRejection] = useState(false);
  const [isCreatingArticleChangesRejection, setIsCreatingArticleChangesRejection] = useState(false);

  const { mutate: approveMutate, isPending: isApproveLoading } = useAproveArticleMutation();
  const { mutate: verifyMutate, isPending: isVerifyLoading } = useVerifyArticleMutation();
  const { mutate: rejectionMutate, isPending: isRejectLoading } = useRejectArticleMutation();
  const { mutate: rejectionChangesMutate, isPending: isRejectChangesLoading } = useRejectArticleChangesMutation();
  const { mutate: requestReviewMutate, isPending: isRequestReviewLoading } = useRequestReviewArticleMutation();

  const onArticleApprove = () => setIsCreatingArticleApprove(true);
  const onArticleVerify = () => setIsCreatingArticleVerify(true);
  const onArticleReject = () => setIsCreatingArticleRejection(true);
  const onArticleChangesReject = () => setIsCreatingArticleChangesRejection(true);

  const onCloseArticleApproveAlert = () => setIsCreatingArticleApprove(false);
  const onCloseArticleVerifyAlert = () => setIsCreatingArticleVerify(false);

  const onArticleApproveConfirm = () => {
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
      onSettled: () => setIsCreatingArticleApprove(false),
    });
  };

  const onArticleVerifyConfirm = () => {
    if (!article) return;
    verifyMutate(article._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["article", article._id] });
        toast.success("Artykuł został zweryfikowany.");
      },
      onError: (error: any) => {
        const status = error?.status;
        if (status === 403) toast.warning("Brak wymaganych uprawnień do wykonania tej operacji.");
        else toast.error("Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.");
      },
      onSettled: () => setIsCreatingArticleVerify(false),
    });
  };

  const onArticleRejectConfirm = ({ rejectionReason }: { rejectionReason: string }) => {
    if (!article) return setIsCreatingArticleRejection(false);

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
        onSettled: () => setIsCreatingArticleRejection(false),
      }
    );
  };

  const onArticleChangesRejectConfirm = ({ rejectionReason }: { rejectionReason: string }) => {
    if (!article) return setIsCreatingArticleRejection(false);

    rejectionChangesMutate(
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
        onSettled: () => setIsCreatingArticleChangesRejection(false),
      }
    );
  };

  const onArticleRequestReviewConfirm = () => {
    if (!article) return;
    requestReviewMutate(article._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["article", article._id] });
        toast.info("Artykuł został zgłoszony do ponownej weryfikacji.");
      },
    });
  };

  return (
    <>
      {articleStatus === "rejected" && (
        <NewArticleRejectedBanner
          article={article}
          isResubmitting={isRequestReviewLoading}
          onResubmit={onArticleRequestReviewConfirm}
        />
      )}

      {articleStatus === "pending" && (
        <ArticleVerificationBanner
          article={article}
          isResubmitting={isVerifyLoading}
          onApprove={onArticleVerify}
          userPermissions={userPermissions}
        />
      )}

      {articleStatus === "draft" && (
        <>
          {!isVisible ? (
            <NewArticleBanner
              status={article.status}
              onApprove={onArticleApprove}
              onReject={onArticleReject}
              userPermissions={userPermissions}
            />
          ) : (
            <ArticleDraftVisibleBanner
              status={article.status}
              isApproving={isApproveLoading}
              isRejecting={isRejectLoading}
              onApprove={onArticleApprove}
              onReject={onArticleChangesReject}
              userPermissions={userPermissions}
            />
          )}
        </>
      )}

      {/* Approve / Verify Alert */}
      <Alert
        isOpen={isCreatingArticleApprove}
        isLoading={isApproveLoading}
        type="info"
        title={articleStatus === "draft" ? "Zatwierdź artykuł" : "Zweryfikuj artykuł"}
        onCancel={onCloseArticleApproveAlert}
        onConfirm={onArticleApproveConfirm}
      >
        <div className="flex flex-col gap-1">
          <span>Czy na pewno chcesz zatwierdzić ten artykuł?</span>
          <span className="text-sm">
            Po potwierdzeniu status artykułu zostanie ustawiony jako{" "}
            <span className="text-primary/90">*zweryfikowany*</span> i stanie się widoczny dla wszystkich użytkowników.
          </span>
        </div>
      </Alert>

      {/* Reject modal */}
      <PendingArticleRejectionModal
        onSubmit={onArticleRejectConfirm}
        isCreatingArticleRejection={isCreatingArticleRejection}
        setIsCreatingArticleRejection={setIsCreatingArticleRejection}
        isPending={isRejectLoading}
      />

      <ArticleChangesRejectionModal
        onSubmit={onArticleChangesRejectConfirm}
        isCreatingArticleRejection={isCreatingArticleChangesRejection}
        setIsCreatingArticleRejection={setIsCreatingArticleChangesRejection}
        isPending={isRejectChangesLoading}
      />
    </>
  );
};

export default ArticleBannerSection;
