import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Box, Check, FolderSearch, Plus, Type, X } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover";
import { cn } from "../../../lib/utils";
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
  const [openProduct, setOpenProduct] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
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
          <Button onClick={() => navigate("/articles/new")} className="cursor-pointer " size="sm">
            <div className="flex items-center gap-2 ">
              <Plus className=" w-4 h-4" />
              Nowy artykuł
            </div>
          </Button>
        </div>
      </div>

      {/* ===== Filters bar ===== */}
      <div className="flex flex-wrap items-center gap-3 px-6 py-4">
        <Input value={selectedTitle} onChange={onTitleChange} placeholder="Szukaj artykułów" className="w-60" />

        <Popover open={openProduct} onOpenChange={setOpenProduct}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={openProduct} className="w-52 justify-between">
              {selectedProduct ? (
                (() => {
                  const product = products.find((p) => p._id === selectedProduct);
                  if (!product) return "Produkt";

                  return (
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: product.labelColor }} />
                      <span className="font-normal">{product.name}</span>
                    </div>
                  );
                })()
              ) : (
                <span className="text-muted-foreground font-normal">Wszystkie</span>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-52 p-0">
            <Command>
              <CommandInput placeholder="Wyszukaj produkt..." />
              <CommandList className="max-h-[264px] overflow-auto scrollbar-custom bg-background/95">
                <CommandEmpty>Brak wyników</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="all"
                    onSelect={() => {
                      onProductChange("__clear__");
                      setOpenProduct(false);
                    }}
                  >
                    Wszystkie
                  </CommandItem>

                  {products.map((product) => (
                    <CommandItem
                      key={product._id}
                      value={product.name}
                      onSelect={() => {
                        onProductChange(product._id);
                        setOpenProduct(false);
                      }}
                      className="group px-3 py-2 rounded-lg transition-all duration-150"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div
                          className={`w-3 h-3 rounded-full ring-2 ring-muted transition-transform duration-150 group-hover:scale-110`}
                          style={{ backgroundColor: product.labelColor }}
                        />

                        <span className="font-normal text-sm tracking-tight">{product.name}</span>

                        <Check
                          className={cn(
                            "ml-auto h-4 w-4 text-primary transition-opacity",
                            selectedProduct === product._id ? "opacity-100" : "opacity-0",
                          )}
                        />
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* ===== Kategorie ===== */}
        <Popover open={openCategory} onOpenChange={setOpenCategory}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openCategory}
              className="w-50 justify-between font-normal"
              disabled={!selectedProduct}
            >
              {selectedCategory ? categories?.find((c) => c._id === selectedCategory)?.name : "Wszystkie"}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-50 p-0">
            <Command>
              <CommandInput placeholder="Wyszukaj kategorię..." />
              <CommandList className="max-h-[264px] overflow-auto scrollbar-custom bg-background/95">
                <CommandEmpty>Brak wyników</CommandEmpty>
                <CommandGroup>
                  {/* Opcja wszystkie */}
                  <CommandItem
                    value="all"
                    onSelect={() => {
                      onCategoryChange("__clear__");
                      setOpenCategory(false);
                    }}
                    className="flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent/10 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-[13px] font-normal text-foreground">Wszystkie kategorie</span>
                    </div>
                  </CommandItem>

                  {/* Separator */}
                  <div className="border-t border-border my-1"></div>

                  {categories?.map((category) => (
                    <CommandItem
                      key={category._id}
                      value={category.name}
                      onSelect={() => {
                        onCategoryChange(category._id);
                        setOpenCategory(false);
                      }}
                      className="group px-3 py-2 rounded-lg transition-all duration-150 cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm text-foreground truncate font-normal">{category.name}</span>
                        <Check
                          className={cn(
                            "h-4 w-4 text-primary transition-opacity",
                            selectedCategory === category._id ? "opacity-100" : "opacity-0",
                          )}
                        />
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

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
