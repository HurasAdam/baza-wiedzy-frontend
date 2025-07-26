import { Loader } from "lucide-react";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { NoDataFound } from "../../components/shared/NoDataFound";
import queryClient from "../../config/query.client";
import {
  useArticleToggleFavouriteMutation,
  useFindArticlesQuery,
} from "../../hooks/articles/use-articles";
import { useFindCategoriesByProductQuery } from "../../hooks/product-categories/use-product-categories";
import { useFindProductsQuery } from "../../hooks/products/use-products";
import type { ArticleListItem } from "../../types/article";
import ArticlesFilterBar from "./components/Articles-filterBar";
import TableArticleCard from "./components/TableArticleCard";

export const ArticlesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const titleParam = searchParams.get("title") || "";
  const selectedProduct = searchParams.get("product") || "";
  const selectedCategory = searchParams.get("category") || "";
  const [pendingId, setPendingId] = useState<string | null>(null);
  const { data, isLoading, isError } = useFindArticlesQuery(searchParams);
  const { data: products = [] } = useFindProductsQuery(null);

  const { data: categories } = useFindCategoriesByProductQuery(selectedProduct);

  const { mutate } = useArticleToggleFavouriteMutation();

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

  const toggleFavourite = (id: string) => {
    setPendingId(id);
    mutate(id, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["articles"] });
        toast.success(data?.message || "Zaktualizowano ulubione");
      },
      onSettled: () => {
        setPendingId(null);
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ------ State Loaders ------ */}
      {/* ------ Filter Bar ------ */}
      <ArticlesFilterBar
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
      <div className="flex-grow flex flex-col h-fit bg-card border border-border divide-y divide-border">
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

        {data?.data.map((article: ArticleListItem) => (
          <TableArticleCard
            article={article}
            toggleFavourite={toggleFavourite}
            toggleFavouriteLoading={pendingId === article._id}
          />
        ))}
      </div>
    </div>
  );
};
