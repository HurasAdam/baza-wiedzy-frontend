import { Check, Flag as FlagIcon } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { NoDataFound } from "../../components/shared/NoDataFound";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "../../components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import queryClient from "../../config/query.client";
import { useArticleToggleFavouriteMutation, useFindMyFlaggedArticlesQuery } from "../../hooks/articles/use-articles";

import { useFindMyFlags } from "../../hooks/flag/user-flag";
import { useFindCategoriesByProductQuery } from "../../hooks/product-categories/use-product-categories";
import { useFindProductsQuery } from "../../hooks/products/use-products";
import type { ArticleListItem } from "../../types/article";
import SkeletonArticleCard from "../pending-articles/components/SkeletonArticleCard";
import FlaggedArticlesFilterBar from "./components/FlaggedArticles-filterBar";
import { TableFlaggedArticleCard } from "./components/TableFlaggedArticleCard";

export const FlaggedArticlesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const titleParam = searchParams.get("title") || "";
  const selectedProduct = searchParams.get("product") || "";
  const selectedCategory = searchParams.get("category") || "";
  const [pendingId, setPendingId] = useState<string | null>(null);

  // Pobierz flagi użytkownika
  const { data: userFlags = [], isLoading: isFlagsLoading } = useFindMyFlags(true);

  // Active flag
  const flagParam = searchParams.get("flag") || (userFlags[0]?._id ?? "");
  const [activeFlag, setActiveFlag] = useState<string>(flagParam);
  const [openFlags, setOpenFlags] = useState(false);

  const { data, isLoading, isError } = useFindMyFlaggedArticlesQuery(searchParams);
  const { data: products = [] } = useFindProductsQuery(null);
  const { data: categories } = useFindCategoriesByProductQuery(selectedProduct);
  const { mutate } = useArticleToggleFavouriteMutation();

  // Update searchParams when activeFlag changes
  useEffect(() => {
    if (!activeFlag) return;
    setSearchParams((prev) => {
      prev.set("flag", activeFlag);
      return prev;
    });
  }, [activeFlag, setSearchParams]);

  const changeTitleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchParams((prev) => {
      if (value) prev.set("title", value);
      else prev.delete("title");
      return prev;
    });
  };

  const changeProductHandler = (product: string) => {
    setSearchParams((prev) => {
      if (product === "__clear__") {
        prev.delete("product");
        prev.delete("category");
      } else {
        prev.delete("product");
        prev.delete("category");
        prev.set("product", product);
      }
      return prev;
    });
  };

  const changeCategoryHandler = (categoryId: string) => {
    setSearchParams((prev) => {
      if (categoryId === "__clear__") {
        prev.delete("category");
      } else {
        prev.set("category", categoryId);
      }
      return prev;
    });
  };

  const onResetAllFilters = () => setSearchParams({ flag: activeFlag });

  const toggleFavourite = (id: string) => {
    setPendingId(id);
    mutate(id, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["articles"] });
        toast.success(data?.message || "Zaktualizowano ulubione");
      },
      onSettled: () => setPendingId(null),
    });
  };

  const handleFlagChange = (articleId: string, flagId: string) => {
    console.log("Zmiana flagi artykułu", articleId, "na", flagId);
    // API call
  };

  const handleSelectFlag = (flagId: string) => {
    setActiveFlag(flagId);
    setOpenFlags(false);
  };

  const activeFlagData = useMemo(
    () => userFlags.find((f) => f._id === activeFlag) || userFlags[0] || { name: "Brak flagi", color: "#ccc", _id: "" },
    [activeFlag, userFlags]
  );

  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Popover open={openFlags} onOpenChange={setOpenFlags}>
          <PopoverTrigger asChild>
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center shadow-sm cursor-pointer transition-transform hover:scale-105 "
              style={{ backgroundColor: activeFlagData.color }}
            >
              <FlagIcon className="w-7 h-7 text-white" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-64  " side="bottom" align="start">
            <Command>
              <CommandList className="max-h-80 overflow-auto scrollbar-custom">
                <CommandEmpty>Brak flag</CommandEmpty>
                <CommandGroup heading="Wybierz flagę">
                  {userFlags.map((flag) => {
                    const isActive = flag._id === activeFlag;
                    return (
                      <CommandItem
                        key={flag._id}
                        onSelect={() => handleSelectFlag(flag._id)}
                        className={`cursor-pointer px-3 py-1.5 rounded flex items-center justify-between   ${
                          isActive
                            ? "bg-primary text-foreground font-semibold !hover:bg-card" // brak hover dla aktywnej
                            : " text-muted-foreground " // hover tylko dla nieaktywnych
                        }`}
                      >
                        <span>{flag.name}</span>
                        <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-primary">
                          {isActive && <Check className="w-3 h-3" />}
                        </span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <h1 className="text-xl font-bold flex items-center gap-2">Kolekcja - {activeFlagData.name}</h1>
      </div>

      {/* Filter Bar */}
      <FlaggedArticlesFilterBar
        selectedTitle={titleParam}
        selectedProduct={selectedProduct}
        selectedCategory={selectedCategory}
        onTitleChange={changeTitleHandler}
        onProductChange={changeProductHandler}
        onCategoryChange={changeCategoryHandler}
        products={products}
        categories={categories}
        onResetAll={onResetAllFilters}
      />

      {/* Articles List */}
      <div className="flex-grow flex flex-col h-fit border border-border divide-y divide-border rounded-xl bg-card/90">
        {isLoading && (
          <ul className="divide-y divide-border py-2">
            {Array(12)
              .fill(0)
              .map((_, i) => (
                <SkeletonArticleCard key={i} withSpinner={i === 0} />
              ))}
          </ul>
        )}

        {isError && <p className="text-sm text-destructive">Błąd podczas ładowania artykułów.</p>}

        {!isLoading && !isError && data?.data.length === 0 && (titleParam || selectedProduct || selectedCategory) && (
          <NoDataFound
            title="Nie znaleziono żadnych artykułów"
            description="Spróbuj zmienić filtry lub zresetuj wszystkie."
            buttonText="Wyczyść filtry"
            buttonAction={onResetAllFilters}
          />
        )}

        {!isError &&
          data?.data.length > 0 &&
          data?.data.map((article: ArticleListItem) => (
            <TableFlaggedArticleCard
              key={article._id}
              article={article}
              flags={userFlags}
              onFlagChange={handleFlagChange}
              toggleFavourite={toggleFavourite}
              toggleFavouriteLoading={pendingId === article._id}
            />
          ))}
      </div>
    </div>
  );
};
