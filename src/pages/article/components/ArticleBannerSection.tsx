import { useState } from "react";
import { toast } from "sonner";
import queryClient from "../../../config/query.client";
import {
  useAproveArticleMutation,
  useRejectArticleMutation,
  useRequestReviewArticleMutation,
  useVerifyArticleMutation,
} from "../../../hooks/articles/use-articles";

import { PendingArticleRejectionModal } from "../../../components/pending-articles/pending-article-rejection-modal";
import { Alert } from "../../../components/shared/alert-modal";
import { ArticleDraftBanner } from "./ArticleDraftBanner";
import { ArticleVerificationBanner } from "./ArticleVerificationBanner";
import { RejectedArticleBanner } from "./RejectedArticleBanner";

const ArticleBannerSection = ({ article, userPermissions }) => {
  const articleStatus = article.status;

  const [isCreatingArticleApprove, setIsCreatingArticleApprove] = useState<boolean>(false);
  const [isCreatingArticleVerify, setIsCreatingArticleVerify] = useState<boolean>(false);
  const [isCreatingArticleRejection, setIsCreatingArticleRejection] = useState<boolean>(false);

  const { mutate: approveMutate, isPending: isApproveLoading } = useAproveArticleMutation();
  const { mutate: verifyMutate, isPending: isVerifyLoading } = useVerifyArticleMutation();
  const { mutate: rejectionMutate, isPending: isRejectLoading } = useRejectArticleMutation();
  const { mutate: requestReviewMutate, isPending: isRequestReviewLoading } = useRequestReviewArticleMutation();

  const onArticleApprove = () => setIsCreatingArticleApprove(true);
  const onArticleVerify = () => setIsCreatingArticleVerify(true);
  const onArticleReject = () => setIsCreatingArticleRejection(true);

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

        if (status === 403) {
          toast.warning("Brak wymaganych uprawnień do wykonania tej operacji.");
        } else {
          toast.error("Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.");
        }
      },
      onSettled: () => {
        setIsCreatingArticleApprove(false);
      },
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

        if (status === 403) {
          toast.warning("Brak wymaganych uprawnień do wykonania tej operacji.");
        } else {
          toast.error("Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.");
        }
      },
      onSettled: () => {
        setIsCreatingArticleVerify(false);
      },
    });
  };

  const onArticleRejectConfirm = ({ rejectionReason }: { rejectionReason: string }) => {
    if (article) {
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

            if (status === 403) {
              toast.warning("Brak wymaganych uprawnień do wykonania tej operacji.");
            } else {
              toast.error("Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.");
            }
          },
          onSettled: () => {
            setIsCreatingArticleRejection(false);
          },
        }
      );
    } else {
      setIsCreatingArticleRejection(false);
    }
  };
  const onArticleRequestRevieConfirm = () => {
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
      {/* Banners */}
      {articleStatus === "rejected" && (
        <RejectedArticleBanner
          article={article}
          isResubmitting={isRequestReviewLoading}
          onResubmit={onArticleRequestRevieConfirm}
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
        <ArticleDraftBanner
          status={article.status}
          onApprove={onArticleApprove}
          onReject={onArticleReject}
          userPermissions={userPermissions}
        />
      )}

      {/* Approve */}
      <Alert
        isOpen={isCreatingArticleApprove}
        isLoading={isApproveLoading}
        type="info"
        title={articleStatus === "draft" ? "Zatwierdź artykuł" : "Zweryfikuj artykuł"}
        onCancel={onCloseArticleApproveAlert}
        onConfirm={onArticleApproveConfirm}
      >
        {articleStatus === "draft" ? (
          <div className="flex flex-col gap-1">
            <span>Czy na pewno chcesz zatwierdzić ten artykuł?</span>
            <span className="text-sm ">
              Po potwierdzeniu status artykułu zostanie ustawiony jako{" "}
              <span className="text-primary/90">*zweryfikowany*</span> i stanie się on widoczny dla wszystkich
              użytkowników.
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <span>Czy na pewno chcesz zweryfikować ten artykuł?</span>
            <span className="text-sm ">
              Po potwierdzeniu status artykułu zostanie ustawiony jako{" "}
              <span className="text-primary/90">*zweryfikowany*</span>
            </span>
          </div>
        )}
      </Alert>

      {/* Verify */}
      <Alert
        isOpen={isCreatingArticleVerify}
        isLoading={isVerifyLoading}
        type="info"
        title={articleStatus === "draft" ? "Zatwierdź artykuł" : "Zweryfikuj artykuł"}
        onCancel={onCloseArticleVerifyAlert}
        onConfirm={onArticleVerifyConfirm}
      >
        <div className="flex flex-col gap-1">
          <span>Czy na pewno chcesz zweryfikować ten artykuł?</span>
          <span className="text-sm ">
            Po potwierdzeniu status artykułu zostanie ustawiony jako{" "}
            <span className="text-primary/90">*zweryfikowany*</span>
          </span>
        </div>
      </Alert>

      {/* Reject */}
      <PendingArticleRejectionModal
        onSubmit={onArticleRejectConfirm}
        isCreatingArticleRejection={isCreatingArticleRejection}
        setIsCreatingArticleRejection={setIsCreatingArticleRejection}
        isPending={isRejectLoading}
      />
    </>
  );
};

export default ArticleBannerSection;
