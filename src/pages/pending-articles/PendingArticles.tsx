import { Clock, Loader, XCircle } from "lucide-react";
import React, { useState, type JSX } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { PendingArticleRejectionModal } from "../../components/pending-articles/pending-article-rejection-modal";
import { Alert } from "../../components/shared/alert-modal";
import { NoDataFound } from "../../components/shared/NoDataFound";
import { Tabs, TabsContent } from "../../components/ui/tabs";
import queryClient from "../../config/query.client";
import {
  useAproveArticleMutation,
  useFindArticlesQuery,
  useRejectArticleMutation,
} from "../../hooks/articles/use-articles";
import { useAuthQuery } from "../../hooks/auth/use-auth";
import { useFindCategoriesByProductQuery } from "../../hooks/product-categories/use-product-categories";
import { useFindProductsQuery } from "../../hooks/products/use-products";
import type { ArticleListItem } from "../../types/article";
import StatusBar from "../my-entries/components/StatusBar";
import type { StatusKey } from "../my-entries/MyEntriesPage";
import PendingArticleCard from "./components/PendingArticleCard";

export const PendingArticles: React.FC = () => {
  const [currentStatus, setCurrentStatus] = useState<PendingKey>("draft");
  const [searchParams, setSearchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  params.set("status", currentStatus);
  const titleParam = searchParams.get("title") || "";
  const selectedProduct = searchParams.get("product") || "";
  const selectedCategory = searchParams.get("category") || "";
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [rejectedArticleId, setRejectedArticleId] = useState<null | string>(null);
  const [approvedArticleId, setApprovedArticleId] = useState<null | string>(null);
  const [isCreatingArticleRejection, setIsCreatingArticleRejection] = useState<boolean>(false);
  const [isCreatinArticleApprove, setIsCreatingArticleApprove] = useState<boolean>(false);
  const { data, isLoading, error } = useFindArticlesQuery(params);
  const { data: products = [] } = useFindProductsQuery();

  const { data: categories } = useFindCategoriesByProductQuery(selectedProduct);

  const { data: user } = useAuthQuery();

  const userPermissions = user?.role?.permissions || [];

  const { mutate: approveMutate, isPending: isApproveLoading } = useAproveArticleMutation();
  const { mutate: rejectionMutate } = useRejectArticleMutation();

  const statuses: { key: StatusKey; label: string; icon: JSX.Element }[] = [
    {
      key: "draft",
      label: "Nowe",
      icon: <XCircle className="w-4 h-4 mr-1" />,
    },
    {
      key: "pending",
      label: "Oczekujące",
      icon: <Clock className="w-4 h-4 mr-1" />,
    },
  ];
  type PendingKey = (typeof statuses)[number]["key"];
  const changeTitleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchParams((prev) => {
      if (value) prev.set("title", value);
      else prev.delete("title");
      return prev;
    });
  };

  const changeProductHandler = (product: string) => {
    setSearchParams((prev) => {
      if (product === "__clear__") {
        prev.delete("product");
        prev.delete("category");
      } else {
        prev.delete("product");
        prev.delete("category");
        prev.set("product", product);
      }
      return prev;
    });
  };

  const changeCategoryHandler = (categoryId: string) => {
    setSearchParams((prev) => {
      if (categoryId === "__clear__") {
        prev.delete("category");
      } else {
        prev.set("category", categoryId);
      }

      return prev;
    });
  };

  const onResetAllFilters = () => {
    setSearchParams({});
  };

  const onArticleAprove = (id: string) => {
    setApprovedArticleId(id);
    setIsCreatingArticleApprove(true);
  };

  const onArticleAproveConfirm = () => {
    setPendingId(approvedArticleId);
    if (approvedArticleId) {
      approveMutate(approvedArticleId, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["articles"] });
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
          setPendingId(null);
          setApprovedArticleId(null);
          setIsCreatingArticleApprove(false);
        },
      });
    }
  };

  const onArticleReject = (articleId: string) => {
    setIsCreatingArticleRejection(true);
    setRejectedArticleId(articleId);
  };

  const onArticleRejectConfirm = ({ rejectionReason }: { rejectionReason: string }) => {
    if (rejectedArticleId) {
      rejectionMutate(
        { articleId: rejectedArticleId, rejectionReason },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["articles"] });
            toast.success("Artykuł został odrzucony, uwagi zostały wysłane do autora artykułu");
          },
          onSettled: () => {
            setPendingId(null);
          },
        }
      );
    }

    setIsCreatingArticleRejection(false);
    setRejectedArticleId(null);
  };

  const onCloseArticleApproveAlert = () => {
    setIsCreatingArticleApprove(false);
    setApprovedArticleId(null);
  };

  return (
    <div className="mx-auto pb-10 ">
      <h1 className="text-xl font-bold mb-6.5 tracking-wide text-foreground">Moje artykuły</h1>

      {/* TU WYRENDERUJESZ STATUSBAR */}

      <StatusBar
        statuses={statuses}
        currentStatus={currentStatus}
        setCurrentStatus={(key) => {
          setCurrentStatus(key);
          setSearchParams({}); // opcjonalnie reset filtrów
        }}
      />

      <Tabs value={currentStatus} className="w-full">
        {statuses.map(({ key }) => (
          <TabsContent key={key} value={key} className="p-0">
            <div className="divide-y divide-border space-y-4">
              {isLoading && (
                <div className="flex items-center justify-center p-6 text-gray-500 dark:text-gray-400">
                  <Loader className="animate-spin" />
                  <span>Ładowanie artykułów...</span>
                </div>
              )}

              {error && (
                <div className="p-6 text-center text-red-600 dark:text-red-400 font-medium">
                  <svg
                    className="inline-block mr-2 h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Wystąpił błąd podczas pobierania artykułów.
                </div>
              )}

              {!isLoading && data?.data?.length === 0 && (
                // <p className="p-6 text-center text-gray-500 dark:text-gray-400 italic">
                //   Brak artykułów do wyświetlenia.
                // </p>
                <NoDataFound title="Brak wyników" description="Brak artykułów do wyświetlenia." />
              )}

              {data?.data?.map((article: ArticleListItem) => (
                <PendingArticleCard
                  userPermissions={userPermissions}
                  key={article._id}
                  article={article}
                  onApprove={onArticleAprove}
                  onReject={onArticleReject}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      {/* Sidebar filtrów */}

      <PendingArticleRejectionModal
        onSubmit={onArticleRejectConfirm}
        isCreatingArticleRejection={isCreatingArticleRejection}
        setIsCreatingArticleRejection={setIsCreatingArticleRejection}
      />
      <Alert
        isOpen={isCreatinArticleApprove}
        isLoading={isApproveLoading}
        type="info"
        title="Zatwierdź artykuł"
        onCancel={onCloseArticleApproveAlert}
        onConfirm={onArticleAproveConfirm}
      >
        Czy na pewno chcesz zatwierdzić ten artykuł?
      </Alert>
    </div>
  );
};
