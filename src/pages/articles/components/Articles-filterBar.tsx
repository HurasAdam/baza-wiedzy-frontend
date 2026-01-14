import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Box, FolderSearch, X } from "lucide-react";
import React from "react";
import type { IProduct } from "../../../types/product";
import type { ProductCategory } from "../../../types/product-category";

type ArticlesFilterBarProps = {
  selectedTitle: string;
  selectedProduct: string;
  selectedCategory: string;
  selectedPage: number;
  currentPage: number;
  totalPages?: number;
  products: IProduct[];
  categories?: ProductCategory[];
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProductChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onResetAll: () => void;
  resultsCount?: number;
};

const ArticlesFilterBar: React.FC<ArticlesFilterBarProps> = ({
  selectedTitle,
  selectedProduct,
  selectedCategory,
  selectedPage,
  products,
  categories,
  currentPage,
  totalPages,
  onTitleChange,
  onProductChange,
  onCategoryChange,
  onResetAll,
  resultsCount,
}) => {
  const hasFilters = selectedTitle || selectedProduct || selectedCategory || selectedPage > 1;

  return (
    <div className="bg-background flex flex-col gap-4 mb-1">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 ">
            <div className=" rounded-xl bg-primary/10">
              <FolderSearch className="w-6 h-6 text-muted-foreground" />
            </div>
            <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">Baza artykułów</h1>
          </div>

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
      <div className="flex px-3 py-2 gap-3 items-between  flex-wrap">
        {/* Search */}
        <Input value={selectedTitle} onChange={onTitleChange} placeholder="Szukaj artykułów..." className="w-52" />

        {/* Product */}
        <Select
          onValueChange={(value) => onProductChange(value === "all" ? "__clear__" : value)}
          value={selectedProduct || "all"}
        >
          <SelectTrigger className="w-48 border border-input ">
            <SelectValue placeholder="Produkt" />
          </SelectTrigger>
          <SelectContent className="max-h-[66vh] overflow-auto scrollbar-custom">
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
          <SelectTrigger className="w-48 border-ring">
            <SelectValue placeholder="Kategoria" />
          </SelectTrigger>
          <SelectContent className="max-h-[66vh] overflow-auto scrollbar-custom">
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

        <Button variant="outline" size="sm" disabled={!hasFilters} onClick={onResetAll} className="">
          Wyczyść filtry
        </Button>

        <div className="ml-auto flex items-center gap-3 flex-col ">
          {typeof resultsCount === "number" && (
            <Badge variant="outline" className="text-xs font-medium px-3 py-1">
              Znaleziono: {resultsCount}
            </Badge>
          )}

          {currentPage && totalPages && (
            <span className="text-muted-foreground text-xs">
              Strona <span className="font-semibold">{currentPage}</span> z{" "}
              <span className="font-semibold">{totalPages}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticlesFilterBar;
