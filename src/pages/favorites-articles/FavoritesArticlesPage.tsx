import { HeartIcon, Loader } from "lucide-react";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { NoDataFound } from "../../components/shared/NoDataFound";
import queryClient from "../../config/query.client";
import { useArticleToggleFavouriteMutation } from "../../hooks/articles/use-articles";
import { useFindCategoriesByProductQuery } from "../../hooks/product-categories/use-product-categories";
import { useFindProductsQuery } from "../../hooks/products/use-products";
import { useFindUserFavoritesArticlesQuery } from "../../hooks/users/use-users";
import type { ArticleListItem } from "../../types/article";
import FavoriteArticleCard from "./components/FavoriteArticleCard";
import FavoriteArticlesFilterBar from "./components/FavoriteArticles-filterBar";

export const FavoritesArticlesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const titleParam = searchParams.get("title") || "";
  const selectedProduct = searchParams.get("product") || "";
  const selectedCategory = searchParams.get("category") || "";
  const [pendingId, setPendingId] = useState<string | null>(null);

  const { data, isLoading, isError } =
    useFindUserFavoritesArticlesQuery(searchParams);
  const { data: products = [] } = useFindProductsQuery();

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
        queryClient.invalidateQueries({ queryKey: ["favorite-articles"] });
        toast.success(data?.message || "Zaktualizowano ulubione");
      },
      onSettled: () => {
        setPendingId(null);
      },
    });
  };

  return (
    <div className="flex flex-col ">
      {/* ------ State Loaders ------ */}
      {/* ------ Filter Bar ------ */}
      <h1 className="text-xl font-bold mb-6.5 tracking-wide text-foreground flex items-center gap-1.5">
        <HeartIcon className="w-6 h-6" /> Moje ulubione
      </h1>
      <FavoriteArticlesFilterBar
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
          <FavoriteArticleCard
            article={article}
            toggleFavourite={toggleFavourite}
            toggleFavouriteLoading={pendingId === article._id}
          />
        ))}
      </div>
    </div>
  );
};
