import { AlertTriangle, Clock, DiamondPlus } from "lucide-react";
import React, { useState, type JSX } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { PendingArticleRejectionModal } from "../../components/pending-articles/pending-article-rejection-modal";
import { Alert } from "../../components/shared/alert-modal";
import EmptyState from "../../components/shared/EmptyState";
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
import StatusBar from "../my-entries/components/StatusBar";
import type { StatusKey } from "../my-entries/MyEntriesPage";
import PendingArticleCard from "./components/PendingArticleCard";
import PendingArticlesFilterBar from "./components/PendingArticles-filterBar";
import SkeletonArticleCard from "./components/SkeletonArticleCard";

export const PendingArticles: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialStatus = (searchParams.get("status") as PendingKey) || "draft";
  const [currentStatus, setCurrentStatus] = useState<PendingKey>(initialStatus);

  const titleParam = searchParams.get("title") || "";
  const selectedProduct = searchParams.get("product") || "";
  const selectedAuthor = searchParams.get("author") || "";

  const params = new URLSearchParams(searchParams);
  params.set("status", currentStatus);

  const [pendingId, setPendingId] = useState<string | null>(null);
  const [rejectedArticleId, setRejectedArticleId] = useState<null | string>(null);
  const [approvedArticleId, setApprovedArticleId] = useState<null | string>(null);
  const [isCreatingArticleRejection, setIsCreatingArticleRejection] = useState<boolean>(false);
  const [isCreatinArticleApprove, setIsCreatingArticleApprove] = useState<boolean>(false);

  const { data: articles, isLoading, error } = useFindArticlesQuery(params);
  const { data: users } = useFindUsersForSelect();
  const { data: products = [] } = useFindProductsQuery();

  const { data: user } = useAuthQuery();
  const userPermissions = user?.role?.permissions || [];

  const { mutate: approveMutate, isPending: isApproveLoading } = useAproveArticleMutation();
  const { mutate: rejectionMutate, isPending: isRejectionLoading } = useRejectArticleMutation();

  const hasFilters = Boolean(titleParam || selectedProduct || selectedAuthor);

  const statuses: { key: StatusKey; label: string; icon: JSX.Element }[] = [
    {
      key: "draft",
      label: "Nowe",
      icon: <DiamondPlus className="w-5 h-5 " />,
    },
    {
      key: "pending",
      label: "Oczekujące",
      icon: <Clock className="w-5 h-5 " />,
    },

    {
      key: "rejected",
      label: "Odrzucone",
      icon: <AlertTriangle className="w-5 h-5 " />,
    },
  ];

  type PendingKey = (typeof statuses)[number]["key"];

  // ---- Filter handlers  ----
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

  // ---- Action handlers  ----
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
  const currentStatusObj = statuses.find((status) => status.key === currentStatus);
  return (
    <div className="mx-auto pb-10">
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
      <div className="flex items-center mb-4">
        <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <div className="rounded-lg bg-card p-2 ">{currentStatusObj?.icon}</div>

          {currentStatusObj?.label}
        </h1>
      </div>

      <PendingArticlesFilterBar
        selectedTitle={titleParam}
        selectedProduct={selectedProduct}
        selectedAuthor={selectedAuthor}
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
        resultsCount={articles?.data.length}
      />

      <Tabs value={currentStatus} className="w-full">
        {statuses.map(({ key }) => (
          <TabsContent key={key} value={key} className="p-0">
            <div className=" rounded-xl overflow-hidden">
              {isLoading || !users || !products ? (
                <ul className="divide-y divide-border ">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <SkeletonArticleCard key={i} withSpinner={i === 0} />
                    ))}
                </ul>
              ) : articles?.data.length === 0 ? (
                hasFilters ? (
                  <EmptyState onReset={() => setSearchParams(new URLSearchParams({ status: currentStatus }))} />
                ) : (
                  <NoDataFound title="Brak wyników" description="Brak artykułów do wyświetlenia." />
                )
              ) : (
                <ul className="divide-y divide-border border bg-card rounded-xl ">
                  {articles.data.map((article) => (
                    <PendingArticleCard
                      key={article._id}
                      article={article}
                      onApprove={onArticleAprove}
                      onReject={onArticleReject}
                      userPermissions={userPermissions}
                    />
                  ))}
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
        isPending={isRejectionLoading}
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
