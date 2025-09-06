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
import { cn } from "../../../lib/utils";
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

const ArticlesFilterBar: React.FC<ArticlesFilterBarProps> = ({
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
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggleChange = (checked: boolean) => {
    setIsChecked(checked);
    onToggleChange(checked);
  };
  const hasFilters = selectedTitle || selectedProduct || selectedCategory;
  return (
    <div className="w-full border-b  p-4 mb-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative w-64">
          <Input
            value={selectedTitle}
            onChange={onTitleChange}
            placeholder="Szukaj artykułów..."
            className="pl-10 border-ring "
          />
          <span className="absolute left-3 top-2.5 text-muted-foreground">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M16 10a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
          </span>
        </div>

        {/* Product select */}
        <Select onValueChange={onProductChange} value={selectedProduct}>
          <SelectTrigger className="w-56  border-ring">
            <SelectValue placeholder="Produkt" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="__clear__">
                <XIcon className="w-4 h-4 mr-1" />
                Wyczyść produkt
              </SelectItem>
              {products.map(({ _id, name }) => (
                <SelectItem key={_id} value={_id}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Category select */}
        <Select onValueChange={onCategoryChange} value={selectedCategory} disabled={!selectedProduct}>
          <SelectTrigger className="w-56  border-ring">
            <SelectValue placeholder="Kategoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="__clear__">
                <XIcon className="w-4 h-4 mr-1" />
                Wyczyść kategorię
              </SelectItem>
              {categories?.map(({ _id, name }) => (
                <SelectItem key={_id} value={_id}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Toggle Favourites */}
        {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Switch checked={isChecked} onCheckedChange={handleToggleChange} />
          <span>Ulubione</span>
        </div> */}

        {/* Reset Button */}
        <Button
          onClick={onResetAll}
          disabled={!hasFilters}
          className={cn(
            "ml-auto inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
            hasFilters
              ? "bg-muted text-foreground hover:bg-muted/80 border border-border shadow-sm"
              : "bg-muted text-muted-foreground border border-border disabled:opacity-70 cursor-not-allowed opacity-50"
          )}
        >
          <XIcon className="h-4 w-4 stroke-[2] text-foreground" />
          Wyczyść filtry
        </Button>
      </div>
    </div>
  );
};
export default ArticlesFilterBar;
