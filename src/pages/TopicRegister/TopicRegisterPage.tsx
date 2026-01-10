import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductModal } from "../../components/product/product-modal";
import { TopicModal } from "../../components/topic/topic-modal";
import { useAuthQuery } from "../../hooks/auth/use-auth";
import { useFindProductsQuery } from "../../hooks/products/use-products";
import { useFindTopicsQuery } from "../../hooks/topics/use-topics";
import TopicListSection from "./components/TopicListSection";
import TopicRegisterHeader from "./components/TopicRegisterHeader";

export const TopicRegisterPage = () => {
  const [isCreatingProduct, setIsCreatingProduct] = useState<boolean>(false);
  const [isCreatingTopic, setIsCreatingTopic] = useState<boolean>(false);
  const { data: user } = useAuthQuery();

  const userPermissions = user?.role?.permissions || [];

  const [params, setParams] = useSearchParams();
  const product = params.get("product") || "";
  const title = params.get("title") || "";

  const { data: topics = [], isLoading: isTopicsLoading } = useFindTopicsQuery(params);
  const { data: products = [] } = useFindProductsQuery();

  const onCreateProduct = (): void => {
    setIsCreatingProduct(true);
  };

  const onCreateTopic = (): void => {
    setIsCreatingTopic(true);
  };

  const productHandler = (product: string) => {
    setParams((prev) => {
      const newParams = new URLSearchParams(prev); // kopia
      if (product) newParams.set("product", product);
      else newParams.delete("product");

      return newParams;
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

  const onResetAllFilters = () => {
    setParams(new URLSearchParams());
  };

  return (
    <div className="flex w-full max-w-[1400px] mx-auto">
      <div className="w-full">
        <TopicRegisterHeader
          products={products}
          title={title}
          product={product}
          foundTopicsCount={topics && topics.length}
          onCreateProduct={onCreateProduct}
          onCreateTopic={onCreateTopic}
          titleHandler={titleHandler}
          productHandler={productHandler}
          onResetAllFilters={onResetAllFilters}
          userPermissions={userPermissions}
        />

        <TopicListSection isTopicsLoading={isTopicsLoading} topics={topics} title={title} setParams={setParams} />
      </div>

      <ProductModal isCreatingProduct={isCreatingProduct} setIsCreatingProduct={setIsCreatingProduct} />

      <TopicModal products={products} isCreatingTopic={isCreatingTopic} setIsCreatingTopic={setIsCreatingTopic} />
    </div>
  );
};
