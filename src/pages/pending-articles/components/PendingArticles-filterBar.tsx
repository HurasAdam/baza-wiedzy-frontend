import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Box, X } from "lucide-react";
import React from "react";

type PendingArticlesFilterBarProps = {
  selectedTitle: string;
  selectedProduct: string;
  selectedAuthor: string;
  products: IProduct[];
  authors: { _id: string; name: string }[];
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProductChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
  onResetAll: () => void;
  resultsCount?: number;
};

const PendingArticlesFilterBar: React.FC<PendingArticlesFilterBarProps> = ({
  selectedTitle,
  selectedProduct,
  selectedAuthor,
  products,
  authors,
  onTitleChange,
  onProductChange,
  onAuthorChange,
  onResetAll,
  resultsCount,
}) => {
  const hasFilters = selectedTitle || selectedProduct || selectedAuthor;

  return (
    <div className="bg-background flex flex-col gap-1 mb-4">
      {/* ---- Filtry główne ---- */}
      <div className="flex px-3  gap-2.5 items-center flex-wrap">
        <Input
          value={selectedTitle}
          onChange={onTitleChange}
          placeholder="Szukaj artykułów..."
          className="w-52 border-ring"
        />

        <Select value={selectedProduct || "all"} onValueChange={(v) => onProductChange(v === "all" ? "__clear__" : v)}>
          <SelectTrigger className="w-48 border-ring">
            <SelectValue placeholder="Produkt" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Wszystkie</SelectItem>
              {products.map(({ _id, name, labelColor }) => (
                <SelectItem key={_id} value={_id} className="flex items-center gap-2">
                  <Box className="w-3 h-3" style={{ color: labelColor }} />
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={selectedAuthor || "all"} onValueChange={(v) => onAuthorChange(v === "all" ? "__clear__" : v)}>
          <SelectTrigger className="w-50 border-ring">
            <SelectValue placeholder="Autor" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Wszyscy</SelectItem>
              {authors.map(({ _id, name, surname }) => {
                const initials = `${name[0]}${surname[0]}`.toUpperCase();
                return (
                  <SelectItem key={_id} value={_id} className="flex items-center gap-2 group">
                    <div className="min-w-6 min-h-6 rounded-full  flex items-center justify-center text-xs text-foreground bg-primary">
                      <span className="p-0.5"> {initials}</span>
                    </div>
                    {name} {surname}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" disabled={!hasFilters} onClick={onResetAll} className="ml-auto">
          Wyczyść filtry
        </Button>

        {typeof resultsCount === "number" && (
          <Badge variant="outline" className="ml-2 text-xs px-2 py-0.5">
            Znaleziono: {resultsCount}
          </Badge>
        )}
      </div>

      {/* ---- Aktywne filtry (badge) ---- */}
      <div className="flex gap-2 flex-wrap mt-1 min-h-[24px]">
        {selectedTitle && (
          <Badge variant="secondary" className="flex items-center gap-1 px-2 py-0.5 text-xs">
            🔍 {selectedTitle}
            <button onClick={() => onTitleChange({ target: { value: "" } } as any)}>
              <X className="w-3 h-3" />
            </button>
          </Badge>
        )}
        {selectedProduct && (
          <Badge variant="default" className="flex items-center gap-1 px-2 py-0.5 text-xs">
            <Box className="w-3 h-3" />
            {products.find((p) => p._id === selectedProduct)?.name}
            <button onClick={() => onProductChange("__clear__")}>
              <X className="w-3 h-3" />
            </button>
          </Badge>
        )}
        {selectedAuthor && (
          <Badge variant="secondary" className="flex items-center gap-1 px-2 py-0.5 text-xs">
            🧑 {authors.find((a) => a._id === selectedAuthor)?.name}
            <button onClick={() => onAuthorChange("__clear__")}>
              <X className="w-3 h-3" />
            </button>
          </Badge>
        )}
      </div>
    </div>
  );
};

export default PendingArticlesFilterBar;
