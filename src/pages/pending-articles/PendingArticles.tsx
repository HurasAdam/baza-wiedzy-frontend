import { Loader } from "lucide-react";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { PendingArticleRejectionModal } from "../../components/pending-articles/pending-article-rejection-modal";
import { Alert } from "../../components/shared/alert-modal";
import { NoDataFound } from "../../components/shared/NoDataFound";
import queryClient from "../../config/query.client";
import {
  useAproveArticleMutation,
  useFindArticlesQuery,
  useRejectArticleMutation,
} from "../../hooks/articles/use-articles";
import { useFindCategoriesByProductQuery } from "../../hooks/product-categories/use-product-categories";
import { useFindProductsQuery } from "../../hooks/products/use-products";
import type { ArticleListItem } from "../../types/article";
import PendingArticleCard from "./components/PendingArticleCard";
import PendingArticlesFilterBar from "./components/PendingArticles-filterBar";

export const PendingArticles: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  params.set("status", "pending");
  const titleParam = searchParams.get("title") || "";
  const selectedProduct = searchParams.get("product") || "";
  const selectedCategory = searchParams.get("category") || "";
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [rejectedArticleId, setRejectedArticleId] = useState<null | string>(
    null
  );
  const [approvedArticleId, setApprovedArticleId] = useState<null | string>(
    null
  );
  const [isCreatingArticleRejection, setIsCreatingArticleRejection] =
    useState<boolean>(false);
  const [isCreatinArticleApprove, setIsCreatingArticleApprove] =
    useState<boolean>(false);
  const { data, isLoading, isError } = useFindArticlesQuery(params);
  const { data: products = [] } = useFindProductsQuery();

  const { data: categories } = useFindCategoriesByProductQuery(selectedProduct);

  const { mutate: approveMutate, isPending: isApproveLoading } =
    useAproveArticleMutation();
  const { mutate: rejectionMutate } = useRejectArticleMutation();

  const changeTitleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchParams((prev) => {
      if (value) prev.set("title", value);
      else prev.delete("title");
      return prev;
    });
  };

  console.log("REJECTED", rejectedArticleId);

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

  const onArticleRejectConfirm = ({
    rejectionReason,
  }: {
    rejectionReason: string;
  }) => {
    if (rejectedArticleId) {
      rejectionMutate(
        { articleId: rejectedArticleId, rejectionReason },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["articles"] });
            toast.success(
              "Artykuł został odrzucony, uwagi zostały wysłane do autora artykułu"
            );
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
    <div className="flex gap-6 min-h-[300px] ">
      <div className="grid grid-cols-1 sm:grid-cols-1 xl:grid-cols-1 gap-4 py-4 items-start w-full">
        {isLoading && (
          <div className="flex items-center flex-col gap-0.5 justify-center">
            <Loader className="animate-spin w-7 h-7" />
            <p className="text-sm text-muted-foreground animate-pulse">
              Ładowanie...
            </p>
          </div>
        )}

        {isError && (
          <p className="text-sm text-destructive">
            Błąd podczas ładowania artykułów.
          </p>
        )}

        {!isLoading &&
          !isError &&
          data?.data.length === 0 &&
          (titleParam || selectedProduct || selectedCategory) && (
            <NoDataFound
              title="Nie znaleziono żadnych artykułów"
              description="Spróbuj zmienić filtry lub zresetuj wszystkie."
              buttonText="Wyczyść filtry"
              buttonAction={onResetAllFilters}
            />
          )}

        <div className=" flex flex-col xl:flex-row flex-wrap gap-4">
          {data?.data.map((article: ArticleListItem) => (
            <div className="w-full sm:w-[calc(98%-0.5rem)] ">
              <PendingArticleCard
                key={article._id}
                article={article}
                onApprove={onArticleAprove}
                onReject={onArticleReject}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Sidebar filtrów */}
      <div className="w-[280px] flex-shrink-0">
        <PendingArticlesFilterBar
          selectedTitle={titleParam}
          selectedProduct={selectedProduct}
          selectedCategory={selectedCategory}
          onTitleChange={changeTitleHandler}
          onProductChange={changeProductHandler}
          onCategoryChange={changeCategoryHandler}
          products={products}
          categories={categories}
          onResetAll={onResetAllFilters}
        />
      </div>

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
