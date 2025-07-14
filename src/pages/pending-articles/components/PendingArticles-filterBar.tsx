import { XIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Switch } from "../../../components/ui/switch";
import type { IProduct } from "../../../types/product";
import type { ProductCategory } from "../../../types/product-category";

type ArticlesFilterBarProps = {
  selectedTitle: string;
  selectedProduct: string;
  selectedCategory: string;
  products: IProduct[];
  onSearchChange?: (val: string) => void;
  onResetAll: () => void;
  onTagChange?: (val: string) => void;
  onToggleChange?: (val: boolean) => void;
  categories?: ProductCategory[];
  tags?: string[];
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProductChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
};

const PendingArticlesFilterBar: React.FC<ArticlesFilterBarProps> = ({
  selectedTitle,
  selectedProduct,
  selectedCategory,
  products,
  onTitleChange,
  onProductChange,
  onCategoryChange,
  onResetAll,
  onToggleChange = () => {},
  categories,
  tags = ["Tag 1", "Tag 2", "Tag 3"],
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggleChange = (checked: boolean) => {
    setIsChecked(checked);
    onToggleChange(checked);
  };

  return (
    <aside className="w-66 bg-card/50 p-6 border rounded-md shadow-md sticky top-4 h-[calc(100vh-1rem)] overflow-auto flex flex-col gap-6">
      {/* ------ Title ------ */}
      <Input
        placeholder="Search articles..."
        value={selectedTitle}
        onChange={onTitleChange}
        className="w-full"
      />

      {/* ------ Product ------ */}
      <Select onValueChange={onProductChange} value={selectedProduct}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Wybierz produkt" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem className="bg-rose-800/85" value="__clear__">
              <XIcon /> Wyczyść produkt
            </SelectItem>
            {products.map(({ _id, name }) => (
              <SelectItem key={_id} value={_id}>
                {name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* ------ Product - category ------ */}
      <Select
        disabled={!selectedProduct}
        onValueChange={onCategoryChange}
        value={selectedCategory}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Wybierz kategorie" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem className="bg-rose-800/85" value="__clear__">
              <XIcon /> Wyczyść kategorie
            </SelectItem>
            {categories &&
              categories.map(({ _id, name }) => (
                <SelectItem key={_id} value={_id}>
                  {name}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="flex items-center space-x-3">
        <Switch checked={isChecked} onCheckedChange={handleToggleChange} />
        <span className="select-none text-gray-700">Only favourites</span>
      </div>
      <Button
        variant="outline"
        onClick={onResetAll}
        className="self-start mt-2"
      >
        Wyczyść filtry
      </Button>
    </aside>
  );
};

export default PendingArticlesFilterBar;
