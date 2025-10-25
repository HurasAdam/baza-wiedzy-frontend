import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { NoDataFound } from "../../components/shared/NoDataFound";
import queryClient from "../../config/query.client";
import { useArticleToggleFavouriteMutation, useFindArticlesQuery } from "../../hooks/articles/use-articles";
import { useFindCategoriesByProductQuery } from "../../hooks/product-categories/use-product-categories";
import { useFindProductsQuery } from "../../hooks/products/use-products";
import type { ArticleListItem } from "../../types/article";
import SkeletonArticleCard from "../pending-articles/components/SkeletonArticleCard";
import ArticlesFilterBar from "./components/Articles-filterBar";
import TableArticleCard from "./components/TableArticleCard";

const dummyFlags = [
  { _id: "1", name: "Red", labelColor: "#FF4C4C" },
  { _id: "2", name: "Blue", labelColor: "#4C6FFF" },
  { _id: "3", name: "Green", labelColor: "#4CFF6F" },
  { _id: "4", name: "Yellow", labelColor: "#FFE14C" },
];

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

  const handleFlagChange = (articleId: string, flagId: string) => {
    console.log("Zmiana flagi artykułu", articleId, "na", flagId);
  };

  return (
    <div className="flex flex-col gap-1.5">
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
      <div className="flex-grow flex flex-col h-fit border border-border divide-y divide-border rounded-xl bg-card/90  ">
        {isLoading && (
          <ul className="divide-y divide-border py-2">
            {Array(12)
              .fill(0)
              .map((_, i) => (
                <SkeletonArticleCard key={i} withSpinner={i === 0} />
              ))}
          </ul>
        )}

        {isError && <p className="text-sm text-destructive">Błąd podczas ładowania artykułów.</p>}

        {!isLoading && !isError && data?.data.length === 0 && (titleParam || selectedProduct || selectedCategory) && (
          <NoDataFound
            title="Nie znaleziono żadnych artykułów"
            description="Spróbuj zmienić filtry lub zresetuj wszystkie."
            buttonText="Wyczyść filtry"
            buttonAction={onResetAllFilters}
          />
        )}

        {!isError &&
          data?.data.length > 0 &&
          data.data.map((article: ArticleListItem) => (
            <TableArticleCard
              key={article._id}
              article={article}
              flags={dummyFlags}
              onFlagChange={handleFlagChange}
              toggleFavourite={toggleFavourite}
              toggleFavouriteLoading={pendingId === article._id}
            />
          ))}
      </div>
    </div>
  );
};
