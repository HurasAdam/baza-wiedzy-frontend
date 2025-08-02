// ProductTopicsTab.tsx
import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import { useFindTopicsQuery } from "@/hooks/topics/use-topics";

export const ProductTopicsTab = ({ productId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (productId) searchParams.append("product", productId);
    if (searchTerm) searchParams.append("name", searchTerm);
    return searchParams;
  }, [productId, searchTerm]);

  console.log(params);

  const { data: topics, isLoading } = useFindTopicsQuery(params);

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
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Tematy rozmów ({topics.length})</CardTitle>
        <Button variant="outline" size="sm">
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
  );
};
