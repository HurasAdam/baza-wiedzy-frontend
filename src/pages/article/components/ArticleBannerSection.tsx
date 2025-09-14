import { useState } from "react";
import { toast } from "sonner";
import queryClient from "../../../config/query.client";
import {
  useAproveArticleMutation,
  useRejectArticleMutation,
  useRequestReviewArticleMutation,
} from "../../../hooks/articles/use-articles";

import { PendingArticleRejectionModal } from "../../../components/pending-articles/pending-article-rejection-modal";
import { Alert } from "../../../components/shared/alert-modal";
import { ArticleDraftBanner } from "./ArticleDraftBanner";
import { ArticleVerificationBanner } from "./ArticleVerificationBanner";
import { RejectedArticleBanner } from "./RejectedArticleBanner";

const ArticleBannerSection = ({ article }) => {
  const articleStatus = article.status;

  const [isCreatingArticleApprove, setIsCreatingArticleApprove] = useState<boolean>(false);
  const [isCreatingArticleRejection, setIsCreatingArticleRejection] = useState<boolean>(false);

  const { mutate: approveMutate, isPending: isApproveLoading } = useAproveArticleMutation();
  const { mutate: rejectionMutate, isPending: isRejectLoading } = useRejectArticleMutation();
  const { mutate: requestReviewMutate, isPending: isRequestReviewLoading } = useRequestReviewArticleMutation();

  const onArticleApprove = () => setIsCreatingArticleApprove(true);
  const onArticleReject = () => setIsCreatingArticleRejection(true);

  const onCloseArticleApproveAlert = () => setIsCreatingArticleApprove(false);

  const onArticleApproveConfirm = () => {
    if (!article) return;
    approveMutate(article._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["article", article._id] });
        toast.success("Artykuł został zatwierdzony.");
      },
      onSettled: () => {
        setIsCreatingArticleApprove(false);
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
        <ArticleVerificationBanner article={article} isResubmitting={isApproveLoading} onApprove={onArticleApprove} />
      )}
      {articleStatus === "draft" && (
        <ArticleDraftBanner status={article.status} onApprove={onArticleApprove} onReject={onArticleReject} />
      )}

      {/* Modale */}
      <Alert
        isOpen={isCreatingArticleApprove}
        isLoading={isApproveLoading}
        type="info"
        title="Zatwierdź artykuł"
        onCancel={onCloseArticleApproveAlert}
        onConfirm={onArticleApproveConfirm}
      >
        Czy na pewno chcesz zatwierdzić ten artykuł?
      </Alert>

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
