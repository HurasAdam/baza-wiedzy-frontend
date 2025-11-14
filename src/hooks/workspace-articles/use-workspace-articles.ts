import { useMutation, useQuery } from "@tanstack/react-query";
import { workspaceArticlesService } from "../../services/workspace-articles.service";
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
