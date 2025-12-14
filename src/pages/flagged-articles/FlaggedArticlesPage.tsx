import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import { useArticleToggleFavouriteMutation, useFindMyFlaggedArticlesQuery } from "../../hooks/articles/use-articles";
import { useFindMyFlags } from "../../hooks/flag/user-flag";
import { useFindCategoriesByProductQuery } from "../../hooks/product-categories/use-product-categories";
import { useFindProductsQuery } from "../../hooks/products/use-products";
import FlaggedArticlesFilterBar from "./components/FlaggedArticles-filterBar";
import FlaggedArticlesHeader from "./components/FlaggedArticlesHeader";
import FlaggedArticlesListSection from "./components/FlaggedArticlesListSection";

export const FlaggedArticlesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const titleParam = searchParams.get("title") || "";
  const selectedProduct = searchParams.get("product") || "";
  const selectedCategory = searchParams.get("category") || "";
  const [pendingId, setPendingId] = useState<string | null>(null);

  const { data: userFlags = [], isLoading: isFlagsLoading } = useFindMyFlags(true);

  const [activeFlag, setActiveFlag] = useState<string>("");
  const [openFlags, setOpenFlags] = useState(false);

  const { data: products = [] } = useFindProductsQuery(null);
  const { data: categories } = useFindCategoriesByProductQuery(selectedProduct);

  const { mutate } = useArticleToggleFavouriteMutation();

  useEffect(() => {
    if (!activeFlag && userFlags.length > 0) {
      const flagFromQuery = searchParams.get("flag");
      setActiveFlag(flagFromQuery || userFlags[0]._id);
    }
  }, [userFlags, searchParams, activeFlag]);

  useEffect(() => {
    if (!activeFlag) return;
    const params = new URLSearchParams(searchParams);
    params.set("flag", activeFlag);
    setSearchParams(params);
  }, [activeFlag, searchParams, setSearchParams]);

  const { data: articles, isLoading, isError } = useFindMyFlaggedArticlesQuery(searchParams);

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
      if (categoryId === "__clear__") prev.delete("category");
      else prev.set("category", categoryId);
      return prev;
    });
  };

  const onResetAllFilters = () => setSearchParams({ flag: activeFlag });

  const toggleFavourite = (id: string) => {
    setPendingId(id);
    mutate(id, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["articles"] });
        toast.success(data?.message || "Zaktualizowano ulubione");
      },
      onSettled: () => setPendingId(null),
    });
  };

  const handleSelectFlag = (flagId: string) => {
    setActiveFlag(flagId);
    setOpenFlags(false);
  };

  const activeFlagData = useMemo(
    () => userFlags.find((f) => f._id === activeFlag) || { name: "Ładowanie...", color: "#ccc", _id: "" },
    [activeFlag, userFlags]
  );

  return (
    <div className="flex flex-col gap-2 max-w-[1440px] mx-auto">
      <FlaggedArticlesHeader
        isLoading={isFlagsLoading}
        userFlags={userFlags}
        handleSelectFlag={handleSelectFlag}
        activeFlag={activeFlag}
        activeFlagData={activeFlagData}
        openFlags={openFlags}
        setOpenFlags={setOpenFlags}
      />

      {/* Filter Bar */}
      <FlaggedArticlesFilterBar
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

      <FlaggedArticlesListSection
        articles={articles ?? { data: [], pagination: { total: 0, page: 1, pages: 0 } }}
        userFlags={userFlags}
        isLoading={isLoading}
        isError={isError}
        toggleFavourite={toggleFavourite}
        onResetAllFilters={onResetAllFilters}
        titleParam={titleParam}
        selectedProduct={selectedProduct}
        selectedCategory={selectedCategory}
        pendingId={pendingId}
      />
    </div>
  );
};
