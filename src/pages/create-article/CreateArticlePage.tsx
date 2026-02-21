import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { Loader } from "lucide-react";
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
import { mapToSelectOptions, mapToSelectProductOptions } from "../../utils/form-mappers";
import { articleSchema, type ArticleCreateDto, type ArticleFormData } from "../../validation/article.schema";
import { Banner } from "./components/Banner";
import { Header } from "./components/Header";

export type SelectOption = {
  label: string;
  value: string;
};

export const CreateArticlePage = () => {
  const navigate = useNavigate();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const { data: products = [] } = useFindProductsQuery();

  console.log("WYBRANY PRODUTK TO", selectedProductId);

  const { data: categories = [], isLoading: loadingCategories } = useFindCategoriesByProductQuery(selectedProductId);
  const { data: tags, isLoading: loadingTags } = useFindTagsQuery();

  const { mutate, isPending: isCreateLoading } = useCreateArticleMutation();

  const onSave = (formData: ArticleFormData) => {
    const dto: ArticleCreateDto = {
      ...formData,
      product: formData.product.value,
      category: formData.category.value,
      tags: formData.tags.map((tag: { label: string; value: string }) => tag.value),
    };

    mutate(dto, {
      onSuccess: () => {
        toast.success("Zmiany zostały zapisane", {
          description: "Dodano szkic artykułu",
          position: "bottom-right",
        });
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
            { duration: 6200 },
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
      product: { label: "", value: "" },
      category: { label: "", value: "" },
      tags: [],
      responseVariants: [
        {
          version: 1,
          variantName: "Wersja 1",
          variantContent: "",
        },
      ],
      employeeDescription: "",
      file: [],
    },
  });

  const handleSubmit = form.handleSubmit(onSave);
  const { isDirty } = form.formState;

  const formattedProducts: SelectOption[] = mapToSelectProductOptions<IProduct>(
    products,
    (p) => p.name,
    (p) => p._id,
    (p) => p.labelColor,
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

  if (loadingTags) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader">Ładowanie...</div>
      </div>
    );
  }

  return (
    tags && (
      <div className="max-w-[1320px] px-6 lg:px-0 pb-6  mx-auto min-h-screen flex flex-col ">
        <Header onBack={() => navigate(-1)} />

        <Banner isDirty={isDirty} isLoading={isCreateLoading} onSave={handleSubmit} onCancel={() => navigate(-1)} />

        <FormProvider {...form}>
          <ArticleForm
            products={formattedProducts}
            categories={formattedCategoriesBySelectedProduct}
            onProductChange={setSelectedProductId}
            tags={formattedTags}
            loadingCategories={loadingCategories}
          />
        </FormProvider>

        <div className="border-t mt-3.5 py-4 px-6 flex justify-end gap-3 max-w-[1380px] mx-auto w-full z-10">
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
