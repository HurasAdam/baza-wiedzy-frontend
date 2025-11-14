import api from "@/config/api.client";
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

const findOne = (articleId: string) => {
  return api.get(`${baseUrl}/${articleId}`);
};

// const findWorkspaceFolders = (workspaceId: string) => {
//   return api.get(`${baseUrl}/${workspaceId}/folders`);
// };

export const workspaceArticlesService = {
  createWorkspaceArticle,
  findArticlesByFolder,
  findOne,
  //   findWorkspaceFolders,
};
