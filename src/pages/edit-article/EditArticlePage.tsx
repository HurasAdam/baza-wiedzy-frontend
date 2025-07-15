import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ArticleForm from "../../components/article/article-form";
import queryClient from "../../config/query.client";
import {
  useFindArticleQuery,
  useUpdateArticleMutation,
} from "../../hooks/articles/use-articles";
import { useFindCategoriesByProductQuery } from "../../hooks/product-categories/use-product-categories";
import { useFindProductsQuery } from "../../hooks/products/use-products";
import { useFindTagsQuery } from "../../hooks/tags/use-tags";
import type { IProduct } from "../../types/product";
import type { ProductCategory } from "../../types/product-category";
import type { Tag } from "../../types/tags";
import { mapToSelectOptions } from "../../utils/form-mappers";
import type {
  ArticleCreateDto,
  ArticleFormData,
} from "../../validation/article.schema";

export type SelectOption = {
  label: string;
  value: string;
};

interface EditArticlePageProps {
  articleId: string;
  onEditCancel: () => void;
}

export const EditArticlePage = ({
  articleId,
  onEditCancel,
}: EditArticlePageProps) => {
  const {
    data: article,
    isLoading,
    isError,
    error,
  } = useFindArticleQuery(articleId);
  const navigate = useNavigate();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const { data: products = [] } = useFindProductsQuery();

  const { data: categories = [], isLoading: loadingCategories } =
    useFindCategoriesByProductQuery(selectedProductId);
  const { data: tags, isLoading: loadingTags } = useFindTagsQuery();

  const { mutate, isPending: isUpdatedLoading } = useUpdateArticleMutation();

  const onSave = ({
    articleId,
    formData,
  }: {
    articleId: string;
    formData: ArticleFormData;
  }) => {
    if (!articleId) {
      throw new Error("Brakuje articleId");
    }

    const dto: ArticleCreateDto = {
      ...formData,
      tags: formData.tags.map((tag) => tag.value),
    };

    mutate(
      { dto, articleId },
      {
        onSuccess: () => {
          toast.success("Artykuł został zaktualizowany");
          queryClient.invalidateQueries({ queryKey: ["article", articleId] });
          onEditCancel();
        },
        onError: (error) => {
          const { status } = error as AxiosError;

          if (status === 409) {
            toast.error(
              <div>
                <strong style={{ fontWeight: 600, marginBottom: 4 }}>
                  Tytuł artykułu jest już zajęty
                </strong>
                <span>Istnieje już artykuł o takim samym tytule...</span>
              </div>,
              { duration: 6200 }
            );
          } else {
            toast.error("Wystąpił błąd, spróbuj ponownie");
          }
        },
      }
    );
  };

  const formattedProducts: SelectOption[] = mapToSelectOptions<IProduct>(
    products,
    (p) => p.name,
    (p) => p._id
  );

  const formattedCategoriesBySelectedProduct: SelectOption[] =
    mapToSelectOptions<ProductCategory>(
      categories,
      (c) => c.name,
      (c) => c._id
    );

  const formattedTags: SelectOption[] = mapToSelectOptions<Tag>(
    tags?.tags ?? [],
    (t) => t.name,
    (t) => t._id
  );

  useEffect(() => {
    if (article?.product?._id) {
      setSelectedProductId(article.product._id);
    }
  }, [article]);

  if (loadingTags) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader">Ładowanie...</div>
        {/* Możesz podmienić na swój spinner lub ikonę */}
      </div>
    );
  }

  return (
    tags && (
      <div className="space-y-4">
        {/* <div className="flex items-center gap-2">
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={onEditCancel}
          >
            <ArrowLeft />
            Wróć
          </Button>
          <div className="flex space-x-2 items-center">
            <span> Edytuj artykuł</span>

            <span className="font-medium text-xs text-muted-foreground">
              {article.title}
            </span>
          </div>
        </div> */}
        <ArticleForm
          onCancel={onEditCancel}
          isLoading={isUpdatedLoading}
          article={article}
          products={formattedProducts}
          categories={formattedCategoriesBySelectedProduct}
          onProductChange={setSelectedProductId}
          tags={formattedTags}
          loadingCategories={loadingCategories}
          onUpdate={onSave}
        />
      </div>
    )
  );
};
