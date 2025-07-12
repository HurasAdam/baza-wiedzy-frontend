import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { articlesService } from "../../services/articles.service";
import type { ArticleCreateDto } from "../../validation/article.schema";

export const useCreateArticleMutation = () => {
  return useMutation<AxiosResponse, AxiosError, ArticleCreateDto>({
    mutationFn: (data) => articlesService.createArticle(data),
  });
};

export const useFindArticlesQuery = () => {
  return useQuery({
    queryKey: ["articles"],
    queryFn: () => {
      return articlesService.getAllArticles();
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};
