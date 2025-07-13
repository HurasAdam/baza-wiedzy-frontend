import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { articlesService } from "../../services/articles.service";
import type { ToggleFavouriteResponse } from "../../types/article";
import type { ArticleCreateDto } from "../../validation/article.schema";

export const useCreateArticleMutation = () => {
  return useMutation<AxiosResponse, AxiosError, ArticleCreateDto>({
    mutationFn: (data) => articlesService.createArticle(data),
  });
};

export const useArticleToggleFavouriteMutation = () => {
  return useMutation<ToggleFavouriteResponse, AxiosError, string>({
    mutationFn: (id) => articlesService.markArticleAsFavourite({ id }),
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

export const useFindArticleQuery = (articleId: string) => {
  return useQuery({
    queryKey: ["article", articleId],
    queryFn: () => {
      return articlesService.getArticle({ id: articleId });
    },

    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};
