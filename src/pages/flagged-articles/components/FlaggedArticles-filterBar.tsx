import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Box, X } from "lucide-react";
import React from "react";
import type { IProduct } from "../../../types/product";
import type { ProductCategory } from "../../../types/product-category";

type FlaggedArticlesFilterBarProps = {
  selectedTitle: string;
  selectedProduct: string;
  selectedCategory: string;
  products: IProduct[];
  categories?: ProductCategory[];
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProductChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onResetAll: () => void;
  resultsCount?: number;
};

const FlaggedArticlesFilterBar: React.FC<FlaggedArticlesFilterBarProps> = ({
  selectedTitle,
  selectedProduct,
  selectedCategory,
  products,
  categories,
  onTitleChange,
  onProductChange,
  onCategoryChange,
  onResetAll,
  resultsCount,
}) => {
  const hasFilters = selectedTitle || selectedProduct || selectedCategory;

  return (
    <div className="bg-background flex flex-col  mb-4">
      {/* ---- Header ---- */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          {/* Active filter badges */}
          <div className="flex gap-2 pt-2.5 flex-wrap px-2 h-6 mb-3">
            {selectedTitle && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 w-full min-w-[130px] max-w-[130px] justify-between"
              >
                <span className="text-xs font-semibold">🔍</span>
                <span className="truncate" title={selectedTitle}>
                  {selectedTitle}
                </span>
                <button
                  onClick={() => onTitleChange({ target: { value: "" } } as any)}
                  className="hover:text-destructive"
                  aria-label="Usuń filtr tekstowy"
                >
                  <X className="w-4 h-4" />
                </button>
              </Badge>
            )}

            {/* Product */}
            {selectedProduct && (
              <Badge variant="default" className="flex items-center gap-1">
                <Box className="w-3 h-3 text-foreground" /> {/* Ikonka po lewej */}
                {products.find((p) => p._id === selectedProduct)?.name || "Produkt"}
                <button
                  onClick={() => onProductChange("__clear__")}
                  className="hover:text-destructive"
                  aria-label="Usuń filtr produktu"
                >
                  <X className="w-4 h-4" />
                </button>
              </Badge>
            )}

            {/* Category */}
            {selectedCategory && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {categories?.find((c) => c._id === selectedCategory)?.name || "Kategoria"}
                <button onClick={() => onCategoryChange("__clear__")} className="hover:text-destructive">
                  <X className="w-4 h-4" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* ---- Filters ---- */}
      <div className="flex px-3 py-2 gap-3 items-center flex-wrap">
        {/* Search */}
        <Input value={selectedTitle} onChange={onTitleChange} placeholder="Szukaj artykułów..." className="w-52" />

        {/* Product */}
        <Select
          onValueChange={(value) => onProductChange(value === "all" ? "__clear__" : value)}
          value={selectedProduct || "all"}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Produkt" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Wszystkie</SelectItem>
              {products.map(({ _id, name }) => (
                <SelectItem key={_id} value={_id}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Category */}
        <Select
          onValueChange={(value) => onCategoryChange(value === "all" ? "__clear__" : value)}
          value={selectedCategory || "all"}
          disabled={!selectedProduct}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Kategoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Wszystkie</SelectItem>
              {categories?.map(({ _id, name }) => (
                <SelectItem key={_id} value={_id}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Reset */}
        <Button variant="outline" size="sm" disabled={!hasFilters} onClick={onResetAll} className="ml-auto">
          Wyczyść filtry
        </Button>

        {typeof resultsCount === "number" && (
          <Badge variant="outline" className="ml-2">
            Znaleziono: {resultsCount}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default FlaggedArticlesFilterBar;
