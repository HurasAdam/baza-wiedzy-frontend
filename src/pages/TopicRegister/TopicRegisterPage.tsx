import { ClipboardList, Plus } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Dropdown } from "../../components/Dropdown";
import { ProductModal } from "../../components/product/product-modal";
import EmptyState from "../../components/shared/EmptyState";
import { TopicModal } from "../../components/topic/topic-modal";
import { Button } from "../../components/ui/button";
import { useFindProductsQuery } from "../../hooks/products/use-products";
import { useFindTopicsQuery } from "../../hooks/topics/use-topics";
import RegisterTopicCard from "./components/register-topic-card";
import RegisterTopicSkeletonCards from "./components/register-topic-skeleton-cards";
import { TopicFiltersPanel } from "./components/topic-filters-panel";

export const TopicRegisterPage = () => {
  const [isCreatingProduct, setIsCreatingProduct] = useState<boolean>(false);
  const [isCreatingTopic, setIsCreatingTopic] = useState<boolean>(false);

  const [params, setParams] = useSearchParams();
  const product = params.get("product") || "";
  const title = params.get("title") || "";
  const hasFilters = Boolean(product || title);

  const { data: topics = [], isLoading: isTopicsLoading } = useFindTopicsQuery({
    title,
    product,
  });
  const { data: products = [] } = useFindProductsQuery();

  const onCreateProduct = (): void => {
    setIsCreatingProduct(true);
  };

  const onCreateTopic = (): void => {
    setIsCreatingTopic(true);
  };

  const dropdownOptions = [
    {
      label: "Dodaj produkt",
      icon: <Plus className="w-4 h-4" />,
      actionHandler: () => {
        onCreateProduct();
      },
    },
    {
      label: "Dodaj temat",
      icon: <Plus className="w-4 h-4" />,
      actionHandler: () => {
        onCreateTopic();
      },
    },
  ];

  const triggerBtn = (
    <Button
      variant="default"
      className="flex items-center gap-1 cursor-pointer"
    >
      Dodaj <Plus className="w-4 h-4" />
    </Button>
  );

  const productHandler = (product: string) => {
    setParams((prev) => {
      prev.set("product", product);
      prev.delete("category");
      return prev;
    });
  };

  const titleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setParams((prev) => {
      if (value) prev.set("title", value);
      else prev.delete("title");
      return prev;
    });
  };

  return (
    <div className="flex w-full ">
      <div className="w-full">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-1.5">
            <ClipboardList className="w-6 h-6" /> Rejestr tematów
          </h1>

          <Dropdown
            triggerBtn={triggerBtn}
            options={dropdownOptions}
            position={{ align: "end" }}
          />
          {/* Tabs */}
        </div>
        <div className="flex w-full gap-6">
          {/* ------ topics ------ */}
          <div className="space-y-3.5 flex-1">
            {isTopicsLoading ? (
              // ---- Loading skeletons -----
              <RegisterTopicSkeletonCards itemsCount={8} />
            ) : topics?.length === 0 && !title ? (
              <EmptyState
                onReset={() => {}}
                resetLabel="+ Dodaj temat"
                title="Brak tematów"
                description="Wygląda na to, że dla tego produktu nie dodano jeszcze żadnych tematów"
              />
            ) : topics?.length === 0 ? (
              <EmptyState onReset={() => setParams({})} />
            ) : (
              topics.map((topic) => (
                <RegisterTopicCard key={topic._id} topic={topic} />
              ))
            )}
          </div>

          <TopicFiltersPanel
            hasFilters={hasFilters}
            title={title}
            product={product}
            products={products}
            onClearFilters={() => setParams(new URLSearchParams())}
            onTitleChange={titleHandler}
            onProductChange={productHandler}
            onSelectAll={() =>
              setParams((prev) => {
                prev.delete("product");
                prev.delete("category");
                return prev;
              })
            }
          />
        </div>
      </div>

      <ProductModal
        isCreatingProduct={isCreatingProduct}
        setIsCreatingProduct={setIsCreatingProduct}
      />

      <TopicModal
        products={products}
        isCreatingTopic={isCreatingTopic}
        setIsCreatingTopic={setIsCreatingTopic}
      />
    </div>
  );
};
