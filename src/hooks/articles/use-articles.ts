import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { articlesService } from "../../services/articles.service";
import type { ToggleFavouriteResponse } from "../../types/article";
import type {
  ArticleCreateDto,
  RejectArticleDto,
} from "../../validation/article.schema";

export const useCreateArticleMutation = () => {
  return useMutation<AxiosResponse, AxiosError, ArticleCreateDto>({
    mutationFn: (data) => articlesService.createArticle(data),
  });
};

export const useAproveArticleMutation = () => {
  return useMutation<AxiosResponse, AxiosError, string>({
    mutationFn: (id) => articlesService.aproveOne({ id }),
  });
};

export const useRejectArticleMutation = () => {
  return useMutation<AxiosResponse, AxiosError, RejectArticleDto>({
    mutationFn: (data) => articlesService.rejectOne(data),
  });
};

export const useArticleToggleFavouriteMutation = () => {
  return useMutation<ToggleFavouriteResponse, AxiosError, string>({
    mutationFn: (id) => articlesService.markArticleAsFavourite({ id }),
  });
};

export const useFindArticlesQuery = (params?: URLSearchParams) => {
  return useQuery({
    queryKey: ["articles", params?.toString()],
    queryFn: () => {
      return articlesService.getAllArticles(params);
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
