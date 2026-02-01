import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import ArticleDrawer from "../../components/article-drawer/ArticleDrawer";
import Pagination from "../../components/shared/Pagination";
import queryClient from "../../config/query.client";
import * as animation from "../../constants/animations";
import { useArticleToggleFavouriteMutation, useFindArticlesQuery } from "../../hooks/articles/use-articles";
import { useFindCategoriesByProductQuery } from "../../hooks/product-categories/use-product-categories";
import { useFindProductsQuery } from "../../hooks/products/use-products";
import ArticlesFilterBar from "./components/Articles-filterBar";
import ArticlesList from "./components/ArticlesList";

export const ArticlesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const titleParam = searchParams.get("title") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const selectedProduct = searchParams.get("product") || "";
  const selectedCategory = searchParams.get("category") || "";
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [hoveredArticleId, setHoveredArticleId] = useState<string | null>(null);
  const hoveredArticleIdRef = useRef<string | null>(null);

  console.log(hoveredArticleIdRef);
  const {
    data: articles = { data: [], pagination: { total: 0, page: 1, pages: 1 } },
    isLoading,
    isError,
  } = useFindArticlesQuery(searchParams);
  const { data: products = [] } = useFindProductsQuery(null);

  const { data: categories } = useFindCategoriesByProductQuery(selectedProduct);

  const { mutate } = useArticleToggleFavouriteMutation();

  const changeTitleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchParams((prev) => {
      if (value) prev.set("title", value);
      else prev.delete("title");
      prev.delete("page");
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
      prev.delete("page");
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
      prev.delete("page");
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

  const openArticleDrawer = (articleId: string) => {
    setSelectedArticleId(articleId);
    setIsDrawerOpen(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "v") {
        const currentHoveredId = hoveredArticleIdRef.current;
        if (!isDrawerOpen && currentHoveredId) {
          openArticleDrawer(currentHoveredId);
        } else if (isDrawerOpen) {
          setIsDrawerOpen(false);
          setSelectedArticleId(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen]);

  return (
    <motion.div
      variants={animation.pageFadePremium}
      initial="init"
      animate="visible"
      exit="exit"
      className="flex flex-col gap-1.5 pb-5 max-w-[1320px] mx-auto"
    >
      <ArticlesFilterBar
        selectedTitle={titleParam}
        selectedProduct={selectedProduct}
        selectedCategory={selectedCategory}
        selectedPage={pageParam}
        currentPage={pageParam}
        totalPages={articles.pagination.pages}
        onTitleChange={changeTitleHandler}
        onProductChange={changeProductHandler}
        onCategoryChange={changeCategoryHandler}
        products={products}
        categories={categories}
        onResetAll={onResetAllFilters}
        resultsCount={articles.pagination.total}
      />

      <ArticlesList
        articles={articles}
        isLoading={isLoading}
        isError={isError}
        onResetAllFilters={onResetAllFilters}
        toggleFavourite={toggleFavourite}
        pendingId={pendingId}
        selectedTitle={titleParam}
        selectedProduct={selectedProduct}
        selectedCategory={selectedCategory}
        openArticleDrawer={openArticleDrawer}
        setHoveredArticleId={setHoveredArticleId}
        setHoveredArticleIdRef={(id) => (hoveredArticleIdRef.current = id)}
      />

      {articles?.pagination.pages > 1 && (
        <Pagination
          currentPage={pageParam}
          pages={articles.pagination.pages}
          onPageChange={(page) => {
            setSearchParams((prev) => {
              prev.set("page", page.toString());
              return prev;
            });
          }}
        />
      )}

      <ArticleDrawer
        articleId={selectedArticleId}
        open={isDrawerOpen}
        onOpenChange={(open) => {
          setIsDrawerOpen(open);
          if (!open) setSelectedArticleId(null);
        }}
      />
    </motion.div>
  );
};
