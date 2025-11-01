import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { articlesService } from "../../services/articles.service";
import type { ToggleFavouriteResponse } from "../../types/article";
import type { ArticleCreateDto, RejectArticleDto } from "../../validation/article.schema";

export const useCreateArticleMutation = () => {
  return useMutation<AxiosResponse, AxiosError, ArticleCreateDto>({
    mutationFn: (data) => articlesService.createArticle(data),
  });
};

export const useFollowArticleMutation = () => {
  return useMutation<void, AxiosError, string>({
    mutationFn: (articleId) => articlesService.followArticle(articleId),
  });
};

export const useUnfollowArticleMutation = () => {
  return useMutation<void, AxiosError, string>({
    mutationFn: (articleId) => articlesService.unfollowArticle(articleId),
  });
};

export const useUpdateArticleMutation = () => {
  return useMutation<AxiosResponse, AxiosError, ArticleCreateDto>({
    mutationFn: (data) => articlesService.updateArticle(data),
  });
};

export const useSimpleUpdateArticleMutation = () => {
  return useMutation<AxiosResponse, AxiosError, ArticleCreateDto>({
    mutationFn: (data) => articlesService.simpleUpdateArticle(data),
  });
};

export const useAproveArticleMutation = () => {
  return useMutation<AxiosResponse, AxiosError, string>({
    mutationFn: (id) => articlesService.aproveOne({ id }),
  });
};
export const useVerifyArticleMutation = () => {
  return useMutation<AxiosResponse, AxiosError, string>({
    mutationFn: (id) => articlesService.verifyArticle({ id }),
  });
};

export const useRejectArticleMutation = () => {
  return useMutation<AxiosResponse, AxiosError, RejectArticleDto>({
    mutationFn: (data) => articlesService.rejectOne(data),
  });
};

export const useRequestReviewArticleMutation = () => {
  return useMutation<AxiosResponse, AxiosError, string>({
    mutationFn: (id) => articlesService.requestReviewOne({ id }),
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

export const useFindMyFlaggedArticlesQuery = (params?: URLSearchParams) => {
  return useQuery({
    queryKey: ["my-flagged-articles", params?.toString()],
    queryFn: () => {
      return articlesService.getMyFlaggedArticles(params);
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};

export const useFindArticleQuery = (articleId?: string) => {
  return useQuery({
    queryKey: ["article", articleId],
    queryFn: () => articlesService.getArticle({ id: articleId! }),
    enabled: !!articleId,
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};
export const useFindArticlesCreatedByUserQuery = (query) => {
  return useQuery({
    queryKey: ["user-articles", query],
    queryFn: () => {
      return articlesService.findAllByUser(query);
    },

    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};
