import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Box, FolderSearch, Plus, Type, X } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-border bg-background shadow-sm">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
            <FolderSearch className="h-4 w-4 text-muted-foreground" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">Baza artykułów</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={() => navigate("/articles/new")} className="group " size="sm">
            <div className="flex items-center gap-2 ">
              <Plus className=" w-4 h-4 group-hover:animate-spin" />
              Nowy artykuł
            </div>
          </Button>
        </div>
      </div>

      {/* ===== Filters bar ===== */}
      <div className="flex flex-wrap items-center gap-3 px-6 py-4">
        <Input value={selectedTitle} onChange={onTitleChange} placeholder="Szukaj artykułów" className="w-60" />

        <Select
          onValueChange={(value) => onProductChange(value === "all" ? "__clear__" : value)}
          value={selectedProduct || "all"}
        >
          <SelectTrigger className="w-48">
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

        <Select
          onValueChange={(value) => onCategoryChange(value === "all" ? "__clear__" : value)}
          value={selectedCategory || "all"}
          disabled={!selectedProduct}
        >
          <SelectTrigger className="w-48">
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

        <Button variant="ghost" size="sm" disabled={!hasFilters} onClick={onResetAll} className="text-muted-foreground">
          Wyczyść
        </Button>

        <div className="ml-auto flex flex-col items-end gap-0.5">
          {typeof resultsCount === "number" && (
            <span className="text-sm text-muted-foreground">{resultsCount} wyników</span>
          )}
          {currentPage && totalPages && (
            <span className="text-[11px] text-muted-foreground">
              Strona <span className="font-base">{currentPage}</span> z <span className="font-base">{totalPages}</span>
            </span>
          )}
        </div>
      </div>

      {/* ===== Active filters ===== */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 pt-2.5 px-6 pb-4 border-t border-border">
          {selectedTitle && (
            <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-1 text-xs">
              <Type className="h-3 w-3" />
              <span className="truncate max-w-[140px] text-foreground">{selectedTitle}</span>
              <button onClick={() => onTitleChange({ target: { value: "" } } as any)}>
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
          )}

          {selectedProduct && (
            <div className="flex items-center gap-2 rounded-xl bg-primary/55 px-3 py-1 text-xs">
              <Box className="h-3 w-3" />
              <span className="text-foreground">
                {products.find((p) => p._id === selectedProduct)?.name || "Produkt"}
              </span>
              <button onClick={() => onProductChange("__clear__")}>
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
          )}

          {selectedCategory && (
            <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-1 text-xs">
              <span>{categories?.find((c) => c._id === selectedCategory)?.name || "Kategoria"}</span>
              <button onClick={() => onCategoryChange("__clear__")}>
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArticlesFilterBar;
