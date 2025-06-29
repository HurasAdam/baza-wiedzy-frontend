import { Check } from "lucide-react";
import React from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import type { IProduct } from "../../../types/product";

interface TopicFiltersPanelProps {
  hasFilters: boolean;
  title: string;
  product: string;
  products?: IProduct[];
  onClearFilters: () => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProductChange: (productId: string) => void;
  onSelectAll: () => void;
}

export const TopicFiltersPanel: React.FC<TopicFiltersPanelProps> = ({
  hasFilters,
  title,
  product,
  products = [],
  onClearFilters,
  onTitleChange,
  onProductChange,
  onSelectAll,
}) => {
  return (
    <aside
      className="w-80 bg-muted/40 rounded-md shadow-md p-6 sticky top-6 h-fit flex flex-col gap-4 border border-border/60   max-h-[calc(100vh-155px)]"
      role="complementary"
      aria-label="Panel filtrów"
    >
      <header className="flex justify-between items-center">
        <h2 className="text-base font-semibold text-foreground select-none">
          Filtruj tematy
        </h2>
        {hasFilters && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            className="cursor-pointer text-xs font-medium text-primary transition"
          >
            Wyczyść
          </Button>
        )}
      </header>

      {/* ---------- search input -------- */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="filter-title"
          className="text-xs font-medium text-muted-foreground"
        >
          Wyszukaj tytuł
        </label>
        <Input
          id="filter-title"
          className="w-full py-2 px-3 border border-border rounded focus:ring-1 focus:ring-ring focus:border-ring transition placeholder:text-muted-foreground text-sm"
          value={title}
          onChange={onTitleChange}
          placeholder="Tytuł tematu..."
          type="search"
          autoComplete="off"
        />
      </div>

      {/*--------- products list ------- */}
      <section
        aria-label="Kategorie produktów"
        className="
          flex flex-col gap-1
          border-t border-border/30 pt-4
          max-h-[calc(100vh-200px)]
          scrollbar-custom
          overflow-y-auto
          pr-2
          
        "
      >
        <ul className="flex flex-col gap-1">
          {/*-------- all products -------- */}
          <li>
            <button
              onClick={onSelectAll}
              aria-pressed={!product}
              role="radio"
              tabIndex={0}
              className={`group w-full flex items-center justify-between py-2 px-3 rounded border text-sm transition
                ${
                  !product
                    ? "border-primary bg-primary/5 text-foreground font-medium"
                    : "border-transparent hover:bg-muted"
                }`}
            >
              <div className="flex items-center gap-2">
                {!product && (
                  <Check className="w-4 h-4 text-primary shrink-0" />
                )}
                Wszystkie produkty
              </div>
            </button>
          </li>

          {/*------------- list of products ----------- */}
          {products.map((cat) => (
            <li key={cat._id}>
              <button
                onClick={() => onProductChange(cat._id)}
                aria-pressed={product === cat._id}
                role="radio"
                tabIndex={0}
                title={cat.name}
                className={`group w-full flex items-center justify-between py-2 px-3 rounded border text-sm transition truncate
                  ${
                    product === cat._id
                      ? "border-primary bg-primary/5 text-foreground font-medium"
                      : "border-transparent hover:bg-muted"
                  }`}
              >
                <div className="flex items-center gap-2">
                  {product === cat._id && (
                    <Check className="w-4 h-4 text-primary shrink-0" />
                  )}
                  {cat.name}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
};
