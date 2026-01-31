import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { ChevronRight, Edit3, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ArticleForm from "../../components/article/article-form";
import { Button } from "../../components/ui/button";
import queryClient from "../../config/query.client";
import { useFindArticleQuery, useUpdateArticleMutation } from "../../hooks/articles/use-articles";
import { useFindCategoriesByProductQuery } from "../../hooks/product-categories/use-product-categories";
import { useFindProductsQuery } from "../../hooks/products/use-products";
import { useFindTagsQuery } from "../../hooks/tags/use-tags";
import type { IProduct } from "../../types/product";
import type { ProductCategory } from "../../types/product-category";
import type { Tag } from "../../types/tags";
import { mapToSelectOptions } from "../../utils/form-mappers";
import { articleSchema, type ArticleCreateDto, type ArticleFormData } from "../../validation/article.schema";

export type SelectOption = {
  label: string;
  value: string;
};

interface EditArticlePageProps {
  articleId: string;
  onEditCancel: () => void;
}

export const EditArticlePage = ({ articleId, onEditCancel }: EditArticlePageProps) => {
  const { data: article, isLoading, isError, error } = useFindArticleQuery(articleId);
  const navigate = useNavigate();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const { data: products = [] } = useFindProductsQuery(null);

  const { data: categories = [], isLoading: loadingCategories } = useFindCategoriesByProductQuery(selectedProductId);
  const { data: tags, isLoading: loadingTags } = useFindTagsQuery(null);

  const { mutate, isPending: isUpdatedLoading } = useUpdateArticleMutation();

  const onSave = ({ articleId, formData }: { articleId: string; formData: ArticleFormData }) => {
    if (!articleId) {
      throw new Error("Brakuje articleId");
    }

    const dto: ArticleCreateDto = {
      ...formData,
      product: formData.product.value,
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
                <strong style={{ fontWeight: 600, marginBottom: 4 }}>Tytuł artykułu jest już zajęty</strong>
                <span>Istnieje już artykuł o takim samym tytule...</span>
              </div>,
              { duration: 6200 },
            );
            return;
          } else if (status === 403) {
            toast.error("Brak wymaganych uprawnień do wykonania tej operacji.");
            return;
          } else {
            toast.error("Wystąpił błąd, spróbuj ponownie");
          }
        },
      },
    );
  };
  console.log("A", article);
  const handleSave = (formData: ArticleFormData) => onSave({ articleId, formData });

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title ?? "",
      product: article?.product
        ? { label: article.product.name, value: article.product._id }
        : { label: "", value: "" },
      category: article?.category
        ? { label: article.category.name, value: article.category._id }
        : { label: "", value: "" },
      tags: article?.tags.map((tag) => ({ label: tag.name, value: tag._id })) ?? [],
      responseVariants: article?.responseVariants.map((rv) => ({
        version: typeof rv.version === "number" ? rv.version : parseInt(rv.version ?? "1", 10),
        variantName: rv.variantName ?? "",
        variantContent: rv.variantContent ?? "",
      })) ?? [{ version: 1, variantName: "", variantContent: "" }],
      employeeDescription: article?.employeeDescription ?? "",
      file: [],
    },
  });

  const { isDirty } = form.formState;
  const handleSubmit = form.handleSubmit(handleSave);

  const formattedProducts: SelectOption[] = mapToSelectOptions<IProduct>(
    products,
    (p) => p.name,
    (p) => p._id,
  );

  const formattedCategoriesBySelectedProduct: SelectOption[] = mapToSelectOptions<ProductCategory>(
    categories,
    (c) => c.name,
    (c) => c._id,
  );

  const formattedTags: SelectOption[] = mapToSelectOptions<Tag>(
    tags?.tags ?? [],
    (t) => t.name,
    (t) => t._id,
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
      </div>
    );
  }

  return (
    tags && (
      <>
        <header className="px-2.5 py-8 flex  space-x-6 bg-background justify-between">
          <div className="flex gap-6 items-start">
            <div className="rounded-lg p-3 bg-primary/90 text-primary-foreground">
              <Edit3 className="w-5 h-5 " />
            </div>
            <div>
              <h1 className="text-lg flex items-center font-bold leading-tight tracking-tight text-foreground mb-1">
                Edycja artykułu <ChevronRight className="w-5 h-5 mx-2 text-primary animate-pulse" />
                <span className="text-foreground  undercover font-medium">{article ? article.title : "Ładowanie"}</span>
              </h1>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Zaktualizuj szczegóły artykułu, przypisz go do produktu i dostosuj jego metadane.
              </p>
            </div>
          </div>

          {/* 🔽 PRZYCISKI */}
          <div className="flex justify-end gap-3 mt-6 px-2">
            <Button variant="outline" onClick={onEditCancel}>
              Anuluj
            </Button>
            <Button variant="default" onClick={handleSubmit} disabled={isUpdatedLoading || !isDirty}>
              {isUpdatedLoading ? (
                <div className="flex items-center gap-2">
                  <Loader className="animate-spin w-4 h-4" />
                  Zapisuję...
                </div>
              ) : (
                "Zapisz"
              )}
            </Button>
          </div>
        </header>
        <FormProvider {...form}>
          <ArticleForm
            isLoading={isUpdatedLoading}
            article={article}
            products={formattedProducts}
            categories={formattedCategoriesBySelectedProduct}
            onProductChange={setSelectedProductId}
            tags={formattedTags}
            loadingCategories={loadingCategories}
          />
        </FormProvider>
      </>
    )
  );
};
