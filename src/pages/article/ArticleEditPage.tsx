import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { CheckCircle, ChevronRight, Edit3, Loader, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import ArticleForm from "../../components/article/article-form";
import { Alert } from "../../components/shared/alert-modal";
import { Button } from "../../components/ui/button";
import queryClient from "../../config/query.client";
import {
  useFindArticleQuery,
  useSimpleUpdateArticleMutation,
  useUpdateArticleMutation,
} from "../../hooks/articles/use-articles";
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

export const ArticleEditPage = () => {
  const { id: articleId } = useParams();
  const { data: article, isLoading, isError, error } = useFindArticleQuery(articleId!);
  const navigate = useNavigate();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [saveAlertState, setSaveAlertState] = useState<{
    isOpen: boolean;
    saveVariant: "simple" | "full" | "";
  }>({ isOpen: false, saveVariant: "simple" });
  const { data: products = [] } = useFindProductsQuery(null);

  const { data: categories = [], isLoading: loadingCategories } = useFindCategoriesByProductQuery(selectedProductId);
  const { data: tags, isLoading: loadingTags } = useFindTagsQuery(null);

  const { mutate, isPending: isUpdatedLoading } = useUpdateArticleMutation();
  const { mutate: simpleArticleUpdateMutate, isPending: isSimpleUpdatePending } = useSimpleUpdateArticleMutation();

  const onEditCancel = () => {
    navigate(`/articles/${articleId}`);
  };

  const onCloseArticleApproveAlert = () => {
    setSaveAlertState((state) => ({
      ...state,
      isOpen: false,
      saveVariant: "",
    }));
  };

  const onOpenArticleAproveAlert = () => {
    setSaveAlertState((state) => ({
      ...state,
      isOpen: true,
    }));
  };

  const onArticleSaveModeSelect = (type: "simple" | "full") => {
    setSaveAlertState((state) => ({
      ...state,
      saveVariant: type,
    }));
  };

  const onSave = ({
    articleId,
    formData,
    saveVariant,
  }: {
    articleId: string;
    formData: ArticleFormData;
    saveVariant: "simple" | "full";
  }) => {
    if (!articleId) {
      throw new Error("Brakuje articleId");
    }

    const dto: ArticleCreateDto = {
      ...formData,
      tags: formData.tags.map((tag) => tag.value),
    };

    if (saveVariant === "simple") {
      return simpleArticleUpdateMutate(
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
                { duration: 6200 }
              );
              return;
            } else if (status === 403) {
              toast.error("Brak wymaganych uprawnień do wykonania tej operacji.");
              return;
            } else {
              toast.error("Wystąpił błąd, spróbuj ponownie");
            }
          },
        }
      );
    }

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
              { duration: 6200 }
            );
            return;
          } else if (status === 403) {
            toast.error("Brak wymaganych uprawnień do wykonania tej operacji.");
            return;
          } else {
            toast.error("Wystąpił błąd, spróbuj ponownie");
          }
        },
      }
    );
  };

  const handleSave = (formData: ArticleFormData) =>
    onSave({ articleId, formData, saveVariant: saveAlertState.saveVariant });

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title ?? "",
      product: article?.product?._id ?? "",
      category: article?.category?._id ?? "",
      tags: article ? article.tags.map((tag) => ({ label: tag.name, value: tag._id })) : [],
      responseVariants: article?.responseVariants.map((cd) => ({
        version: typeof cd.version === "number" ? cd.version : parseInt(cd.version ?? "1", 10),
        variantContent: cd.variantContent ?? "",
        variantName: cd.variantName ?? "",
      })) ?? [{ version: 1, variantContent: "", variantName: "" }],
      employeeDescription: article?.employeeDescription ?? "",
      file: [],
    },
  });
  const { isDirty } = form.formState;
  const handleSubmit = form.handleSubmit(handleSave);

  const formattedProducts: SelectOption[] = mapToSelectOptions<IProduct>(
    products,
    (p) => p.name,
    (p) => p._id
  );

  const formattedCategoriesBySelectedProduct: SelectOption[] = mapToSelectOptions<ProductCategory>(
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
            <Button
              variant="default"
              onClick={
                article?.status === "rejected" || article?.status === "draft" ? handleSubmit : onOpenArticleAproveAlert
              }
              disabled={isUpdatedLoading || !isDirty}
            >
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

        <Alert
          isConfirmEnabled={!!saveAlertState.saveVariant}
          requireConfirmation={false} // checkbox niepotrzebny przy wyborze wariantu
          isOpen={saveAlertState.isOpen}
          title="Jak chcesz zapisać zmiany?"
          onCancel={onCloseArticleApproveAlert}
          onConfirm={handleSubmit}
          isLoading={isUpdatedLoading || isSimpleUpdatePending}
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Wybierz tryb zapisu artykułu. To wpłynie na jego status i dalszy proces.
            </p>

            <div className="grid gap-3">
              {/* Prosta edycja */}
              <button
                type="button"
                onClick={() => onArticleSaveModeSelect("simple")}
                className={`p-4 rounded-lg border flex items-start gap-3 transition-all ${
                  saveAlertState.saveVariant === "simple"
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-primary/40 hover:bg-muted/40"
                }`}
              >
                <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                <div className="text-left">
                  <p className="font-medium">Prosta edycja</p>
                  <p className="text-sm text-muted-foreground">
                    Wprowadza zmiany w artykule bez zmiany jego statusu – artykuł pozostaje{" "}
                    <strong>zatwierdzony</strong>.
                  </p>
                </div>
              </button>

              {/* Pełna edycja */}
              <button
                type="button"
                onClick={() => onArticleSaveModeSelect("full")}
                className={`p-4 rounded-lg border flex items-start gap-3 transition-all ${
                  saveAlertState.saveVariant === "full"
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-primary/40 hover:bg-muted/40"
                }`}
              >
                <RefreshCw className="w-5 h-5 text-orange-600 mt-1" />
                <div className="text-left">
                  <p className="font-medium">Pełna edycja</p>
                  <p className="text-sm text-muted-foreground">
                    Wprowadza zmiany w artykule <strong>i zmienia jego status</strong> na{" "}
                    <strong>Oczekujący weryfikacji</strong>, wymagając ponownej weryfikacji.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </Alert>
      </>
    )
  );
};
