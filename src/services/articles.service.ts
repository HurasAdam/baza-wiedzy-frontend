import api from "@/config/api.client";
import { buildUrl } from "@/utils/build-url";
import type { AxiosResponse } from "axios";
import type { Article } from "../types/article";
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

export const createArticle = async (
  formData: ArticleCreateDto
): Promise<AxiosResponse> => {
  return await api.post(baseUrl, formData);
};

export const getArticle = ({ id }: { id: string }): Promise<Article> => {
  return api.get(buildUrl(baseUrl, id));
};

export const getArticleHistory = ({ id }) => {
  return api.get(buildUrl(baseUrl, id, "history"));
};

export const verifyArticle = ({ id, isVerified }) => {
  return api.post(buildUrl(baseUrl, id, "verify"), { isVerified });
};

export const markArticleAsFavourite = ({ id }) => {
  return api.post(buildUrl(baseUrl, id, "markAsFavourite"));
};

export const updateArticle = ({ id, formData }) => {
  return api.put(buildUrl(baseUrl, id), formData);
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

const getArticlesCreatedByUser = ({ userId, params }) => {
  // startDate, endDate, limit and page in searchParams
  return api.get(buildUrl(baseUrl, "userArticles", userId), { params });
};

const getArticlesHistoryByUser = ({ userId, params }) => {
  // startDate and endDate in params
  return api.get(buildUrl(baseUrl, "userHistory", userId), { params });
};
const getArticleHistoryItem = ({ id }) => {
  return api.get(buildUrl(baseUrl, "history", id));
};

export const articlesService = {
  getAllArticles,
  createArticle,
  getArticle,
  verifyArticle,
  markArticleAsFavourite,
  deleteArticle,
  updateArticle,
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
};
