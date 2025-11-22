import api from "@/config/api.client";
import type { WorkspaceArticle, WorkspaceArticleUpdateResponse } from "../types/workspace-article";
import type { WorkspaceArticleResponseVariantFormData } from "../validation/workspace-article-response-variant.schema";
import type { WorkspaceArticleFormData } from "../validation/workspace-article.schema";
const baseUrl = "/workspace-articles";
const adminBaseUrl = "/admin";

interface FindArticlesByFolderParams {
  folderId: string;
  title?: string;
  page?: number;
}

const createWorkspaceArticle = (payload: WorkspaceArticleFormData) => {
  return api.post(`${baseUrl}/`, payload);
};

const findArticlesByFolder = ({ folderId, title, page }: FindArticlesByFolderParams) => {
  const params: Record<string, string> = {};
  if (title) params.title = title;
  if (page) params.page = page.toString();

  return api.get(`${baseUrl}/folder/${folderId}`, { params });
};

const findOne = (articleId: string): Promise<WorkspaceArticle> => {
  return api.get(`${baseUrl}/${articleId}`);
};

// const findWorkspaceFolders = (workspaceId: string) => {
//   return api.get(`${baseUrl}/${workspaceId}/folders`);
// };

const updateOne = (articleId: string, payload: unknown): Promise<WorkspaceArticleUpdateResponse> => {
  return api.put(`${baseUrl}/${articleId}`, payload);
};

const createWorkspaceArticleResponseVariant = (
  articleId: string,

  payload: WorkspaceArticleResponseVariantFormData
) => {
  return api.post(`${baseUrl}/${articleId}/response-variants`, payload);
};

const updateWorkspaceArticleResponseVariant = (
  articleId: string,
  responseVariantId: string,
  payload: WorkspaceArticleResponseVariantFormData
) => {
  return api.put(`${baseUrl}/${articleId}/response-variants/${responseVariantId}`, payload);
};

export const workspaceArticlesService = {
  createWorkspaceArticle,
  findArticlesByFolder,
  findOne,
  updateOne,
  createWorkspaceArticleResponseVariant,
  updateWorkspaceArticleResponseVariant,
};
