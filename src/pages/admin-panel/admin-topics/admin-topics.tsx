import { useMemo, useState } from "react";

import { EditTopicModal } from "@/components/topic/edit-topic.modal";
import { TopicModal } from "@/components/topic/topic-modal";
import { useFindProductsQuery } from "@/hooks/products/use-products";
import { useFindTopicsQuery } from "@/hooks/topics/use-topics";
import TopicsHeader from "./components/TopicsHeader";
import TopicsList from "./components/TopicsList";

export const AdminTopicsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [productFilter, setProductFilter] = useState("");

  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);

  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (searchTerm) searchParams.append("title", searchTerm);
    if (productFilter) searchParams.append("product", productFilter);
    return searchParams;
  }, [searchTerm, productFilter]);

  const { data: products = [] } = useFindProductsQuery(null);

  const { data: topics = [], isLoading, isError, error } = useFindTopicsQuery(params);

  const onResetAllFilters = () => {
    setSearchTerm("");
    setProductFilter("");
  };

  const onCreateTopic = (): void => {
    setIsCreatingTopic(true);
  };

  const onEditTopic = (topicId: string): void => {
    setEditingTopicId(topicId);
    setIsEditingTopic(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-1 space-y-6 pb-10">
      <TopicsHeader
        products={products}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setProductFilter={setProductFilter}
        productFilter={productFilter}
        foundTopicsCount={topics.length}
        onResetAllFilters={onResetAllFilters}
        onCreateTopic={onCreateTopic}
      />
      <TopicsList topics={topics} isLoading={isLoading} isError={isError} error={error} onEditTopic={onEditTopic} />

      <TopicModal products={products} isCreatingTopic={isCreatingTopic} setIsCreatingTopic={setIsCreatingTopic} />
      {editingTopicId && (
        <EditTopicModal
          products={products}
          isEditingTopic={isEditingTopic}
          setIsEditingTopic={setIsEditingTopic}
          topicId={editingTopicId}
        />
      )}
    </div>
  );
};
