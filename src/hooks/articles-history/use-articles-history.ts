import { useQuery } from "@tanstack/react-query";
import { articlesHistoryService } from "../../services/articles-history.service";

export const useFindArticleHistoryQuery = (articleId: string) => {
  return useQuery({
    queryKey: ["faq-item", articleId],
    queryFn: () => articlesHistoryService.findArticleHistory({ id: articleId }),
    refetchOnWindowFocus: false,
  });
};

export const useFindArticleHistoryItemDetailsQuery = (historyItemId: string) => {
  return useQuery({
    queryKey: ["history-item", historyItemId],
    queryFn: () => articlesHistoryService.findArticleHistoryItemDetails(historyItemId),
  });
};
