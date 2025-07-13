import { Loader } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import queryClient from "../../config/query.client";
import {
  useArticleToggleFavouriteMutation,
  useFindArticlesQuery,
} from "../../hooks/articles/use-articles";
import type { ArticleListItem } from "../../types/article";
import ArticleCard from "./components/ArticleCard";

export const ArticlesPage: React.FC = () => {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const { data, isLoading, isError } = useFindArticlesQuery();
  const { mutate } = useArticleToggleFavouriteMutation();

  const toggleFavourite = (id: string) => {
    setPendingId(id);
    mutate(id, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["articles"], exact: true });
        toast.success(data?.message || "Zaktualizowano ulubione");
      },
      onSettled: () => {
        setPendingId(null);
      },
    });
  };

  if (isLoading)
    return (
      <div className=" h-full w-full flex items-center flex-col gap-0.5 justify-center">
        <Loader className="animate-spin w-7 h-7" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Ładowanie...
        </p>
      </div>
    );
  if (isError)
    return (
      <p className="text-sm text-destructive">
        Błąd podczas ładowania artykułów.
      </p>
    );

  return (
    <div className="grid gap-4 py-4">
      {data?.data.map((article: ArticleListItem) => (
        <ArticleCard
          article={article}
          toggleFavourite={toggleFavourite}
          toggleFavouriteLoading={pendingId === article._id}
        />
      ))}
    </div>
  );
};
