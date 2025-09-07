import { CategoryModal } from "@/components/product-category/category-modal";
import { EditCategoryModal } from "@/components/product-category/edit-category.modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFindCategoriesByProductQuery } from "@/hooks/product-categories/use-product-categories";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export const ProductCategoriesTab = ({ productId }: { productId: string }) => {
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  const { data: categories, isLoading } = useFindCategoriesByProductQuery(productId);

  const onCreateCategory = () => {
    setIsCreatingCategory(true);
  };

  const onEditCategory = (categoryId: string): void => {
    setEditingCategoryId(categoryId);
    setIsEditingCategory(true);
  };

  if (isLoading) return <p>Ładowanie kategorii...</p>;

  if (!categories || categories.length === 0)
    return (
      <>
        <Card className="min-h-fit">
          <CardHeader>
            <CardTitle className="text-foreground">Kategorie (0)</CardTitle>
            <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={onCreateCategory}>
              <Plus className="w-4 h-4" /> Dodaj kategorię
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm text-center py-6">Brak kategorii przypisanych do produktu</p>
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
          <CardTitle className="text-header-foreground">Kategorie ({categories.length})</CardTitle>
          <Button variant="default" size="sm" className="flex items-center gap-1" onClick={onCreateCategory}>
            <Plus className="w-4 h-4" /> Dodaj kategorię
          </Button>
        </CardHeader>
        <CardContent className="overflow-hidden p-0">
          <ul className="divide-y divide-border">
            {categories.map((cat) => (
              <li key={cat._id} className="flex justify-between items-center py-3 group hover:bg-muted/40 px-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{cat.name}</Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="opacity-0 group-hover:opacity-100 transition text-foreground"
                      variant="ghost"
                      size="icon"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditCategory(cat._id)}>
                      <Pencil className="w-4 h-4 mr-2" /> Edytuj
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log(`Usuń ${cat.name}`)} className="text-red-600">
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
      {editingCategoryId && productId && (
        <EditCategoryModal
          categoryId={editingCategoryId}
          productId={productId}
          isEditingCategory={isEditingCategory}
          setIsEditingCategory={setIsEditingCategory}
        />
      )}
    </>
  );
};
