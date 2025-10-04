import { AlertTriangle, Clock, DiamondPlus, Loader, RectangleEllipsis } from "lucide-react";
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
import { useFindProductsQuery } from "../../hooks/products/use-products";
import { useFindUsersForSelect } from "../../hooks/users/use-users";
import type { ArticleListItem } from "../../types/article";
import StatusBar from "../my-entries/components/StatusBar";
import type { StatusKey } from "../my-entries/MyEntriesPage";
import PendingArticleCard from "./components/PendingArticleCard";
import PendingArticlesFilterBar from "./components/PendingArticles-filterBar";

export const PendingArticles: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Status pobrany z URL lub domyślnie 'draft'
  const initialStatus = (searchParams.get("status") as PendingKey) || "draft";
  const [currentStatus, setCurrentStatus] = useState<PendingKey>(initialStatus);

  const titleParam = searchParams.get("title") || "";
  const selectedProduct = searchParams.get("product") || "";

  // Tworzenie parametrów do zapytania
  const params = new URLSearchParams(searchParams);
  params.set("status", currentStatus);

  const [pendingId, setPendingId] = useState<string | null>(null);
  const [rejectedArticleId, setRejectedArticleId] = useState<null | string>(null);
  const [approvedArticleId, setApprovedArticleId] = useState<null | string>(null);
  const [isCreatingArticleRejection, setIsCreatingArticleRejection] = useState<boolean>(false);
  const [isCreatinArticleApprove, setIsCreatingArticleApprove] = useState<boolean>(false);

  const { data, isLoading, error } = useFindArticlesQuery(params);
  const { data: users } = useFindUsersForSelect();
  const { data: products = [] } = useFindProductsQuery();

  const { data: user } = useAuthQuery();
  const userPermissions = user?.role?.permissions || [];

  const { mutate: approveMutate, isPending: isApproveLoading } = useAproveArticleMutation();
  const { mutate: rejectionMutate } = useRejectArticleMutation();

  const statuses: { key: StatusKey; label: string; icon: JSX.Element }[] = [
    {
      key: "draft",
      label: "Nowe",
      // Draft = w przygotowaniu
      icon: <DiamondPlus className="w-5 h-5 mr-2" />,
    },
    {
      key: "pending",
      label: "Oczekujące",
      // Pending = oczekuje na decyzję
      icon: <Clock className="w-5 h-5 mr-2" />,
    },

    {
      key: "rejected",
      label: "Odrzucone",
      // Rejected = odrzucone
      icon: <AlertTriangle className="w-5 h-5 mr-2" />,
    },
  ];

  type PendingKey = (typeof statuses)[number]["key"];

  // ---- Handlery filtrów ----
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
      } else {
        prev.set("product", product);
      }
      return prev;
    });
  };

  const onResetAllFilters = () => {
    setSearchParams((prev) => {
      const status = prev.get("status") || "draft";
      return new URLSearchParams({ status });
    });
  };

  // ---- Handlery akcji ----
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
          if (status === 403) toast.warning("Brak wymaganych uprawnień.");
          else toast.error("Wystąpił nieoczekiwany błąd.");
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
            toast.success("Artykuł został odrzucony, uwagi wysłane do autora.");
          },
          onSettled: () => setPendingId(null),
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
    <div className="mx-auto pb-10">
      <div className="flex items-center gap-4 mb-4">
        <div className="rounded-xl bg-primary/10 p-2">
          <RectangleEllipsis className="w-6 h-6 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">Artykuły oczekujące</h1>
      </div>

      {/* ---- StatusBar ---- */}
      <StatusBar
        statuses={statuses}
        currentStatus={currentStatus}
        setCurrentStatus={(key) => {
          setCurrentStatus(key);
          setSearchParams((prev) => {
            prev.set("status", key);
            return prev;
          });
        }}
      />

      {/* ---- Filter Bar ---- */}
      <PendingArticlesFilterBar
        selectedTitle={titleParam}
        selectedProduct={selectedProduct}
        selectedAuthor={searchParams.get("author") || ""} // <-- dodaj wartość
        products={products}
        authors={users}
        onTitleChange={changeTitleHandler}
        onProductChange={changeProductHandler}
        onAuthorChange={(authorId: string) => {
          setSearchParams((prev) => {
            if (authorId === "__clear__") prev.delete("author");
            else prev.set("author", authorId);
            return prev;
          });
        }}
        onResetAll={onResetAllFilters}
        resultsCount={data?.data.length}
      />
      {/* ---- Lista artykułów ---- */}
      <Tabs value={currentStatus} className="w-full">
        {statuses.map(({ key }) => (
          <TabsContent key={key} value={key} className="p-0">
            <div className="bg-card border rounded-xl overflow-hidden">
              {isLoading && (
                <div className="flex justify-center py-10">
                  <Loader className="animate-spin w-6 h-6" />
                </div>
              )}

              {error && (
                <p className="text-destructive text-center py-10">
                  {(error as Error)?.message || "Błąd podczas ładowania artykułów"}
                </p>
              )}

              {!isLoading && !error && data?.data?.length === 0 && (
                <NoDataFound title="Brak wyników" description="Brak artykułów do wyświetlenia." />
              )}

              {!isLoading && !error && data?.data?.length > 0 && (
                <ul className="divide-y divide-border">
                  {data.data.map((article: ArticleListItem) => {
                    const createdAt = new Date(article.createdAt).toLocaleDateString("pl-PL", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    });

                    return (
                      <PendingArticleCard
                        article={article}
                        onApprove={onArticleAprove}
                        onReject={onArticleReject}
                        userPermissions={userPermissions}
                      />
                    );
                  })}
                </ul>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

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
