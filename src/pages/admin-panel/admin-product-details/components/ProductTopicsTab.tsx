// ProductTopicsTab.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFindTopicsQuery } from "@/hooks/topics/use-topics";
import { MoreHorizontal, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { TopicModal } from "../../../../components/topic/topic-modal";
import { useFindProductsQuery } from "../../../../hooks/products/use-products";

export const ProductTopicsTab = ({ productId }) => {
  const [isCreatingTopic, setIsCreatingTopic] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (productId) searchParams.append("product", productId);
    if (searchTerm) searchParams.append("name", searchTerm);
    return searchParams;
  }, [productId, searchTerm]);

  const { data: products = [] } = useFindProductsQuery();
  const { data: topics, isLoading } = useFindTopicsQuery(params);

  const onCreateTopic = (): void => {
    setIsCreatingTopic(true);
  };

  if (isLoading) return <p>Ładowanie tematów...</p>;

  if (!topics || topics.length === 0)
    return (
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Tematy rozmów (0)</CardTitle>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1" /> Dodaj temat
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm text-center py-6">
            Brak tematów powiązanych z tym produktem
          </p>
        </CardContent>
      </Card>
    );

  return (
    <>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Tematy rozmów ({topics.length})</CardTitle>
          <Button onClick={onCreateTopic} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1" /> Dodaj temat
          </Button>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {topics.map((topic) => (
              <li
                key={topic._id}
                className="flex justify-between items-center py-3"
              >
                <p className="text-sm">{topic.title}</p>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <TopicModal
        products={products}
        isCreatingTopic={isCreatingTopic}
        setIsCreatingTopic={setIsCreatingTopic}
        productId={productId}
      />
    </>
  );
};
