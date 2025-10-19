import api from "@/config/api.client";
import { buildUrl } from "@/utils/build-url";
import type { AxiosResponse } from "axios";
import type { Article, ToggleFavouriteResponse } from "../types/article";
import type { ArticleCreateDto } from "../validation/article.schema";

const baseUrl = "/articles";

export const getAllArticles = (params?: URLSearchParams) => {
  return api.get(baseUrl, { params });
};

export const getLatestArticles = (params: URLSearchParams) => {
  return api.get(buildUrl(baseUrl, "latest"), { params });
};

export const getPopularArticles = (params: URLSearchParams) => {
  return api.get(buildUrl(baseUrl, "popular"), { params });
};

export const findTrashed = (params: URLSearchParams) => {
  return api.get(buildUrl(baseUrl, "trashed"), { params });
};
const findByUser = async (userId, params) => {
  // startDate, endDate, limit, page params
  return api.get(`${baseUrl}/by-user/${userId}`, { params });
};

export const createArticle = async (formData: ArticleCreateDto): Promise<AxiosResponse> => {
  return await api.post(baseUrl, formData);
};

export const followArticle = async (articleId: string): Promise<void> => {
  return await api.post(`${baseUrl}/${articleId}/follow`);
};

export const unfollowArticle = async (articleId: string): Promise<void> => {
  return await api.delete(`${baseUrl}/${articleId}/follow`);
};

export const getArticle = ({ id }: { id: string }): Promise<Article> => {
  return api.get(buildUrl(baseUrl, id));
};

export const getArticleHistory = ({ id }: { id: string }) => {
  return api.get(buildUrl(baseUrl, id, "history"));
};

export const verifyArticle = ({ id }) => {
  return api.post(buildUrl(baseUrl, id, "verify"));
};

export const aproveOne = ({ id }: { id: string }) => {
  return api.post(buildUrl(baseUrl, id, "aprove"));
};
export const rejectOne = ({ articleId, rejectionReason }: { articleId: string; rejectionReason: string }) => {
  console.log("SERIS", articleId, rejectionReason);
  return api.post(buildUrl(baseUrl, articleId, "reject"), {
    rejectionReason,
  });
};
export const requestReviewOne = ({ id }: { id: string }) => {
  return api.post(buildUrl(baseUrl, id, "request-review"));
};

export const markArticleAsFavourite = ({ id }: { id: string }): Promise<ToggleFavouriteResponse> => {
  return api.post(buildUrl(baseUrl, id, "markAsFavourite"));
};

export const updateArticle = ({ articleId, dto }) => {
  return api.put(buildUrl(baseUrl, articleId), dto);
};
export const simpleUpdateArticle = ({ articleId, dto }) => {
  return api.put(buildUrl(baseUrl, articleId, "simple-update"), dto);
};

export const deleteArticle = ({ id }) => {
  return api.delete(buildUrl(baseUrl, id));
};

export const trashArticle = ({ id }) => {
  return api.put(buildUrl(baseUrl, id, "trash"));
};

export const restoreArticle = ({ id }) => {
  return api.put(buildUrl(baseUrl, id, "restore"));
};

export const getUsersArticleStats = (params: URLSearchParams) => {
  // startDate and endDate in params
  return api.get("/users/article-statistics", { params });
};

export const getUsersChangedArticleStats = (params: URLSearchParams) => {
  // startDate and endDate in params
  return api.get("/users/change-statistics", { params });
};

const getArticlesCreatedByUser = ({ userId, params }: { userId: string; params: unknown }) => {
  // startDate, endDate, limit and page in searchParams
  return api.get(buildUrl(baseUrl, "userArticles", userId), { params });
};

const getArticlesHistoryByUser = ({ userId, params }: { userId: string; params: unknown }) => {
  // startDate and endDate in params
  return api.get(buildUrl(baseUrl, "userHistory", userId), { params });
};
const getArticleHistoryItem = ({ id }: { id: string }) => {
  return api.get(buildUrl(baseUrl, "history", id));
};

const findAllByUser = (query: unknown) => {
  return api.get(buildUrl(baseUrl, "my"), { params: query });
};

export const articlesService = {
  getAllArticles,
  createArticle,
  followArticle,
  unfollowArticle,
  getArticle,
  verifyArticle,
  markArticleAsFavourite,
  deleteArticle,
  updateArticle,
  simpleUpdateArticle,
  trashArticle,
  findTrashed,
  getArticleHistory,
  restoreArticle,
  getUsersArticleStats,
  getLatestArticles,
  getPopularArticles,
  getArticlesCreatedByUser,
  getArticlesHistoryByUser,
  getUsersChangedArticleStats,
  getArticleHistoryItem,
  findByUser,
  aproveOne,
  rejectOne,
  requestReviewOne,
  findAllByUser,
};
