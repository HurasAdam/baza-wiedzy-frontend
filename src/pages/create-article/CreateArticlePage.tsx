import type { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ArticleForm from "../../components/article/article-form";
import { useCreateArticleMutation } from "../../hooks/articles/use-articles";
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

export const CreateArticlePage = () => {
  const navigate = useNavigate();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const { data: products = [] } = useFindProductsQuery();

  const { data: categories = [], isLoading: loadingCategories } =
    useFindCategoriesByProductQuery(selectedProductId);
  const { data: tags, isLoading: loadingTags } = useFindTagsQuery();

  const { mutate } = useCreateArticleMutation();

  const onSave = ({ formData }: { formData: ArticleFormData }) => {
    const dto: ArticleCreateDto = {
      ...formData,
      tags: formData.tags.map(
        (tag: { label: string; value: string }) => tag.value
      ),
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
              <strong style={{ fontWeight: 600, marginBottom: 4 }}>
                Tytuł artykułu jest już zajęty
              </strong>
              <span style={{ opacity: 0.85 }}>
                Istnieje już artykuł o takim samym tytule. Wprowadź inny,
                unikalny tytuł i spróbuj ponownie.
              </span>
            </div>,
            { duration: 6200 }
          );
          return;
        }
        toast.error("Wystapił błąd, spróbuj ponownie");
      },
    });
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
      <>
        <header className=" px-8 py-8  flex items-center space-x-6">
          <div className="rounded-lg p-3 bg-primary/90 text-primary-foreground">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-foreground">
              Dodaj nowy artykuł
            </h1>
            <p className="mt-2 max-w-xl text-sm font-normal text-muted-foreground">
              Wprowadź szczegóły artykułu, aby go utworzyć i przypisać do
              produktu.
            </p>
          </div>
        </header>
        <ArticleForm
          onCancel={() => navigate(-1)}
          products={formattedProducts}
          categories={formattedCategoriesBySelectedProduct}
          onProductChange={setSelectedProductId}
          tags={formattedTags}
          loadingCategories={loadingCategories}
          onCreate={onSave}
        />
      </>
    )
  );
};
