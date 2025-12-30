import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { Loader, Plus } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ArticleForm from "../../components/article/article-form";
import { Button } from "../../components/ui/button";
import { useCreateArticleMutation } from "../../hooks/articles/use-articles";
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

export const CreateArticlePage = () => {
  const navigate = useNavigate();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const { data: products = [] } = useFindProductsQuery();

  const { data: categories = [], isLoading: loadingCategories } = useFindCategoriesByProductQuery(selectedProductId);
  const { data: tags, isLoading: loadingTags } = useFindTagsQuery();

  const { mutate, isPending: isCreateLoading } = useCreateArticleMutation();

  const onSave = (formData: ArticleFormData) => {
    const dto: ArticleCreateDto = {
      ...formData,
      tags: formData.tags.map((tag: { label: string; value: string }) => tag.value),
    };

    mutate(dto, {
      onSuccess: () => {
        toast.success("Artykuł został dodany");
        navigate("/articles");
        return;
      },
      onError: (error) => {
        const { status } = error as AxiosError;

        if (status === 409) {
          toast.error(
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column",
                fontFamily: "Inter, sans-serif",
                color: "#991b1b",
                fontSize: "14px",
                lineHeight: "1.4",
              }}
            >
              <strong style={{ fontWeight: 600, marginBottom: 4 }}>Tytuł artykułu jest już zajęty</strong>
              <span style={{ opacity: 0.85 }}>
                Istnieje już artykuł o takim samym tytule. Wprowadź inny, unikalny tytuł i spróbuj ponownie.
              </span>
            </div>,
            { duration: 6200 }
          );
          return;
        } else if (status === 403) {
          toast.error("Brak wymaganych uprawnień do wykonania tej operacji.");
          return;
        }
        toast.error("Wystapił błąd, spróbuj ponownie");
      },
    });
  };

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      product: "",
      category: "",
      tags: [],
      responseVariants: [
        {
          version: 1,
          variantName: "",
          variantContent: "",
        },
      ],
      employeeDescription: "",
      file: [],
    },
  });

  const handleSubmit = form.handleSubmit(onSave);

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
      <div className="pb-12 mx-auto ">
        <header className="py-1 flex  space-x-6 bg-background justify-between">
          <div className="flex gap-6 items-start">
            <div className="rounded-lg p-3 bg-primary/90 text-primary-foreground">
              <Plus className="w-5 h-5 " />
            </div>
            <div>
              <h1 className="text-lg flex items-center font-bold leading-tight tracking-tight text-foreground mb-1">
                Dodaj nowy artykuł
              </h1>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Zaktualizuj szczegóły artykułu, przypisz go do produktu i dostosuj jego metadane.
              </p>
            </div>
          </div>

          {/*  PRZYCISKI */}
          <div className="flex justify-end gap-3 mt-6 px-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Anuluj
            </Button>
            <Button variant="default" onClick={handleSubmit} disabled={isCreateLoading}>
              {isCreateLoading ? (
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
            products={formattedProducts}
            categories={formattedCategoriesBySelectedProduct}
            onProductChange={setSelectedProductId}
            tags={formattedTags}
            loadingCategories={loadingCategories}
          />
        </FormProvider>
        {/*  PRZYCISKI */}
        <div className="flex justify-end gap-3 mt-6 px-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Anuluj
          </Button>
          <Button variant="default" onClick={handleSubmit} disabled={isCreateLoading}>
            {isCreateLoading ? (
              <div className="flex items-center gap-2">
                <Loader className="animate-spin w-4 h-4" />
                Zapisuję...
              </div>
            ) : (
              "Zapisz"
            )}
          </Button>
        </div>
      </div>
    )
  );
};
