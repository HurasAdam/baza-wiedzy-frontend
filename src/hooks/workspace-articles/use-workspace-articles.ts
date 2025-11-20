import { useMutation, useQuery } from "@tanstack/react-query";
import { workspaceArticlesService } from "../../services/workspace-articles.service";
import type { WorkspaceArticleResponseVariantFormData } from "../../validation/workspace-article-response-variant.schema";
import type { WorkspaceArticleFormData } from "../../validation/workspace-article.schema";

export const useFindArticlesByFolderQuery = (params: { folderId: string; title?: string; page?: number }) => {
  return useQuery({
    queryKey: ["workspaceArticles", params.folderId, params.title, params.page],
    queryFn: () => {
      return workspaceArticlesService.findArticlesByFolder(params);
    },
  });
};

export const useFindWorkspaceArticleQuery = (articleId: string) => {
  return useQuery({
    queryKey: ["workspace-article", articleId],
    queryFn: () => {
      return workspaceArticlesService.findOne(articleId);
    },
  });
};

export const useCreateWorkspaceArticleMutation = () => {
  return useMutation({
    mutationFn: (payload: WorkspaceArticleFormData) => {
      return workspaceArticlesService.createWorkspaceArticle(payload);
    },
  });
};

export const useCreateWorkspaceArticleVariantMutation = () => {
  return useMutation({
    mutationFn: ({
      articleId,

      payload,
    }: {
      articleId: string;

      payload: WorkspaceArticleResponseVariantFormData;
    }) => {
      return workspaceArticlesService.createWorkspaceArticleResponseVariant(articleId, payload);
    },
  });
};

export const useUpdateWorkspaceArticleVariantMutation = () => {
  return useMutation({
    mutationFn: ({
      articleId,
      responseVariantId,
      payload,
    }: {
      articleId: string;
      responseVariantId: string;
      payload: WorkspaceArticleResponseVariantFormData;
    }) => {
      return workspaceArticlesService.updateWorkspaceArticleResponseVariant(articleId, responseVariantId, payload);
    },
  });
};
