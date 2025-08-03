import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { useFindCategoriesByProductQuery } from "@/hooks/product-categories/use-product-categories";
import { useState } from "react";
import { CategoryModal } from "@/components/product-category/category-modal";

export const ProductCategoriesTab = ({ productId }: { productId: string }) => {
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const { data: categories, isLoading } =
    useFindCategoriesByProductQuery(productId);

  const onCreateCategory = () => {
    setIsCreatingCategory(true);
  };

  if (isLoading) return <p>Ładowanie kategorii...</p>;

  if (!categories || categories.length === 0)
    return (
      <>
        <Card className="min-h-fit">
          <CardHeader>
            <CardTitle>Kategorie (0)</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={onCreateCategory}
            >
              <Plus className="w-4 h-4" /> Dodaj kategorię
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm text-center py-6">
              Brak kategorii przypisanych do produktu
            </p>
          </CardContent>
        </Card>
        <CategoryModal
          productId={productId}
          isCreatingCategory={isCreatingCategory}
          setIsCreatingCategory={setIsCreatingCategory}
        />
      </>
    );

  return (
    <>
      <Card className="min-h-fit">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Kategorie ({categories.length})</CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={onCreateCategory}
          >
            <Plus className="w-4 h-4" /> Dodaj kategorię
          </Button>
        </CardHeader>
        <CardContent className="overflow-hidden">
          <ul className="divide-y divide-border">
            {categories.map((cat) => (
              <li
                key={cat._id}
                className="flex justify-between items-center py-3"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{cat.name}</Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => console.log(`Edytuj ${cat.name}`)}
                    >
                      <Pencil className="w-4 h-4 mr-2" /> Edytuj
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => console.log(`Usuń ${cat.name}`)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Usuń
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      {productId && (
        <CategoryModal
          productId={productId}
          isCreatingCategory={isCreatingCategory}
          setIsCreatingCategory={setIsCreatingCategory}
        />
      )}
    </>
  );
};
