// ProductTopicsTab.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFindTopicsQuery } from "@/hooks/topics/use-topics";
import { MoreHorizontal, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { TopicModal } from "../../../../components/topic/topic-modal";
import { useFindProductsQuery } from "../../../../hooks/products/use-products";

interface ProductTopicsTabProps {
  productId: string;
}

export const ProductTopicsTab = ({ productId }: ProductTopicsTabProps) => {
  const [isCreatingTopic, setIsCreatingTopic] = useState<boolean>(false);

  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (productId) searchParams.append("product", productId);

    return searchParams;
  }, [productId]);

  const { data: products = [] } = useFindProductsQuery();
  const { data: topics, isLoading } = useFindTopicsQuery(params);

  const onCreateTopic = (): void => {
    setIsCreatingTopic(true);
  };

  if (isLoading) return <p>Ładowanie tematów...</p>;

  if (!topics || topics.length === 0)
    return (
      <>
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Tematy rozmów (0)</CardTitle>
            <Button onClick={onCreateTopic} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" /> Dodaj temat
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm text-center py-6">Brak tematów powiązanych z tym produktem</p>
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

  return (
    <>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-header-foreground">Tematy rozmów ({topics.length})</CardTitle>
          <Button onClick={onCreateTopic} variant="default" size="sm">
            <Plus className="w-4 h-4 mr-1" /> Dodaj temat
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {topics.map((topic) => (
              <li key={topic._id} className="flex justify-between items-center py-3 px-4 group hover:bg-muted/40">
                <p className="text-sm text-foreground">{topic.title}</p>
                <Button
                  className="opacity-0 group-hover:opacity-100 transition text-foreground"
                  variant="ghost"
                  size="icon"
                >
                  <MoreHorizontal className="w-4 h-4 " />
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
